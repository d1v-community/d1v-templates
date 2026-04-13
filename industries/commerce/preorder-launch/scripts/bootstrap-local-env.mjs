#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function parseBooleanFlag(value, fallback) {
  if (value == null) return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  throw new Error(`Invalid boolean value: ${value}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function normalizeBaseUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return "http://localhost:8999";
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

async function requestJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const detail =
      payload?.detail ||
      payload?.error ||
      payload?.message ||
      text ||
      `${response.status} ${response.statusText}`;
    throw new Error(`Request failed for ${url}: ${detail}`);
  }

  return payload;
}

async function readTemplateMetadata() {
  try {
    const raw = await readFile(
      path.resolve(process.cwd(), ".d1v-template.json"),
      "utf8",
    );
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const metadata = await readTemplateMetadata();
  const authToken = args["auth-token"] || process.env.AUTH_TOKEN || "";
  const baseUrl = normalizeBaseUrl(
    args["base-url"] ||
      process.env.BACKEND_ADMIN_API_BASE ||
      process.env.D1V_API_BASE,
  );
  const writePath = args["write-path"] || ".env";
  const prompt =
    args.prompt ||
    metadata?.prompt ||
    process.env.D1V_BOOTSTRAP_PROMPT ||
    "Create a paid Remix application with database support.";
  const templateRepo =
    args["template-repo"] ||
    process.env.D1V_TEMPLATE_REPO ||
    metadata?.templateRepo ||
    "";
  const projectIdArg = args["project-id"] || process.env.PROJECT_ID || "";

  if (!authToken) {
    throw new Error("Missing AUTH_TOKEN or --auth-token.");
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  let projectId = projectIdArg;
  let createdRepoPath = "";

  if (!projectId) {
    const body = {
      prompt,
      enable_pay: parseBooleanFlag(args["enable-pay"], true),
      enable_database: parseBooleanFlag(args["enable-database"], true),
      enable_resend: parseBooleanFlag(args["enable-resend"], true),
    };

    if (templateRepo) {
      body.template_repo = templateRepo;
    }

    const createPayload = await requestJson(
      `${baseUrl}/api/projects/create-with-integrations`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
    );

    const createData = createPayload?.data || createPayload?.result || {};
    const project = createData?.project || {};
    projectId = project.id || createData?.project_id || "";
    createdRepoPath = project.opcode_project_path || "";

    if (!projectId) {
      throw new Error("Project creation response did not include a project id.");
    }
  }

  const exportPayload = await requestJson(
    `${baseUrl}/api/projects/${projectId}/env-vars/export`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  const exportData = exportPayload?.data || exportPayload?.result || {};
  const content = exportData?.content || "";

  if (!content) {
    throw new Error("Environment export response did not include .env content.");
  }

  const resolvedWritePath = path.resolve(process.cwd(), writePath);
  await writeFile(resolvedWritePath, content, "utf8");

  console.log(
    JSON.stringify(
      {
        success: true,
        projectId,
        writePath: resolvedWritePath,
        projectPath: createdRepoPath || undefined,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
