#!/usr/bin/env node

import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INDUSTRY_DATA_MODELS } from "./industry-template.data-models.mjs";
import { INDUSTRY_FULFILLMENT_MODELS } from "./industry-template.fulfillment-models.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(__dirname, "industry-templates.config.json");

function parseEnvFile(content) {
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function runCommand({ cmd, args, cwd, env }) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      env: {
        ...process.env,
        ...env,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `${cmd} ${args.join(" ")} failed in ${cwd}\n${stdout}\n${stderr}`.trim(),
        ),
      );
    });
  });
}

async function waitForHttp(url, attempts = 60) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
    } catch {
      // Ignore boot-time connection errors.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function startServer({ cwd, env, port }) {
  const child = spawn(
    "pnpm",
    ["exec", "remix-serve", "./build/server/index.js", "--port", String(port)],
    {
      cwd,
      env: {
        ...process.env,
        ...env,
        PORT: String(port),
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let stderr = "";
  let stdout = "";

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  child.on("error", (error) => {
    stderr += `\n${error instanceof Error ? error.message : String(error)}`;
  });

  try {
    await waitForHttp(`http://127.0.0.1:${port}/`);
  } catch (error) {
    child.kill("SIGTERM");
    throw new Error(
      `${error instanceof Error ? error.message : String(error)}\n${stdout}\n${stderr}`.trim(),
    );
  }

  return {
    child,
    async stop() {
      if (child.killed) return;

      child.kill("SIGTERM");
      await new Promise((resolve) => {
        child.once("close", resolve);
        setTimeout(() => {
          child.kill("SIGKILL");
          resolve();
        }, 5000);
      });
    },
    getLogs() {
      return `${stdout}\n${stderr}`.trim();
    },
  };
}

async function expectJson(url, init, validator, label) {
  const response = await fetch(url, init);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`${label} failed with ${response.status}: ${JSON.stringify(payload)}`);
  }

  validator(payload);
  return payload;
}

async function listPaymentHubProducts(env) {
  const response = await fetch(`${env.PAY_BASE_URL.replace(/\/+$/, "")}/products`, {
    headers: {
      Authorization: `Bearer ${env.PAY_API_TOKEN}`,
      Accept: "application/json",
    },
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Payment Hub /products failed: ${JSON.stringify(payload)}`);
  }

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.products)) return payload.products;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function toPaymentHubUserId(userId) {
  const trimmed = userId.trim();
  if (trimmed.length >= 13) return trimmed;
  return `user_${trimmed.padEnd(13, "0")}`;
}

async function paymentHubRequest({ env, path, method = "GET", body }) {
  const response = await fetch(`${env.PAY_BASE_URL.replace(/\/+$/, "")}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.PAY_API_TOKEN}`,
      Accept: "application/json",
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Payment Hub ${method} ${path} failed: ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function createTemporaryWebhook({ env, webhookUrl, name }) {
  return paymentHubRequest({
    env,
    path: "/webhooks",
    method: "POST",
    body: {
      name,
      url: webhookUrl,
      events: ["payment.succeeded"],
      isActive: true,
    },
  });
}

async function deleteTemporaryWebhook({ env, webhookId }) {
  await paymentHubRequest({
    env,
    path: `/webhooks/${webhookId}`,
    method: "DELETE",
  });
}

async function readTableCounts({ cwd, env, businessTableName }) {
  const query = [
    "import { neon } from '@neondatabase/serverless';",
    "const client = neon(process.env.DATABASE_URL);",
    `const [entitlements] = await client.query(${JSON.stringify(
      "select count(*)::int as value from payment_entitlements",
    )});`,
    `const [fulfillments] = await client.query(${JSON.stringify(
      "select count(*)::int as value from payment_fulfillments",
    )});`,
    `const [events] = await client.query(${JSON.stringify(
      "select count(*)::int as value from payment_webhook_events",
    )});`,
    `const [business] = await client.query(${JSON.stringify(
      `select count(*)::int as value from ${businessTableName}`,
    )});`,
    "console.log(JSON.stringify({ paymentEntitlements: entitlements?.value ?? 0, paymentFulfillments: fulfillments?.value ?? 0, paymentWebhookEvents: events?.value ?? 0, businessRows: business?.value ?? 0 }));",
  ].join(" ");

  const result = await runCommand({
    cmd: "pnpm",
    args: ["exec", "node", "--input-type=module", "-e", query],
    cwd,
    env,
  });

  return JSON.parse(result.stdout.trim());
}

async function readLatestVerificationCode({ cwd, env, email }) {
  const query = [
    "import { neon } from '@neondatabase/serverless';",
    "const client = neon(process.env.DATABASE_URL);",
    `const rows = await client.query(${JSON.stringify(
      "select code from verification_codes where email = $1 order by created_at desc limit 1",
    )}, [${JSON.stringify(email)}]);`,
    "console.log(rows[0]?.code ?? '');",
  ].join(" ");

  const result = await runCommand({
    cmd: "pnpm",
    args: ["exec", "node", "--input-type=module", "-e", query],
    cwd,
    env,
  });

  const code = result.stdout.trim();
  if (!code) {
    throw new Error(`No verification code found in database for ${email}`);
  }

  return code;
}

async function verifyTemplate({ template, port }) {
  const cwd = path.join(rootDir, "industries", template.category, template.slug);
  const envFile = await readFile(path.join(cwd, ".env"), "utf8");
  const env = parseEnvFile(envFile);
  const baseUrl = `http://127.0.0.1:${port}`;
  const runtimeEnv = {
    ...env,
    APP_URL: baseUrl,
  };
  const smokeEmail = `smoke+${template.slug}@example.com`;
  const model = INDUSTRY_DATA_MODELS[template.id];
  const fulfillmentModel = INDUSTRY_FULFILLMENT_MODELS[template.id](model);

  if (!env.DATABASE_URL || !env.PAY_BASE_URL || !env.PAY_API_TOKEN) {
    throw new Error(`Missing DATABASE_URL or PAY_* variables in ${cwd}/.env`);
  }

  await runCommand({
    cmd: "pnpm",
    args: ["install", "--frozen-lockfile"],
    cwd,
  });
  await runCommand({
    cmd: "pnpm",
    args: ["run", "db:migrate"],
    cwd,
    env: runtimeEnv,
  });
  await runCommand({
    cmd: "pnpm",
    args: ["run", "db:seed"],
    cwd,
    env: runtimeEnv,
  });
  await runCommand({
    cmd: "pnpm",
    args: ["run", "typecheck"],
    cwd,
  });
  await runCommand({
    cmd: "pnpm",
    args: ["run", "build"],
    cwd,
  });

  const server = await startServer({ cwd, env: runtimeEnv, port });
  let temporaryWebhook = null;

  try {
    const home = await fetch(`${baseUrl}/`);
    if (!home.ok) {
      throw new Error(`GET / failed with ${home.status}`);
    }

    const pricing = await fetch(`${baseUrl}/pricing`);
    if (!pricing.ok) {
      throw new Error(`GET /pricing failed with ${pricing.status}`);
    }

    const openapi = await expectJson(
      `${baseUrl}/api/openapi.json`,
      undefined,
      (payload) => {
        if (!payload.paths?.["/api/template/snapshot"]) {
          throw new Error("Missing /api/template/snapshot in OpenAPI payload.");
        }
      },
      `${template.slug} openapi`,
    );

    const snapshot = await expectJson(
      `${baseUrl}/api/template/snapshot`,
      undefined,
      (payload) => {
        if (!payload.success || !payload.snapshot?.sections?.length) {
          throw new Error("Template snapshot did not return seeded sections.");
        }
      },
      `${template.slug} template snapshot`,
    );

    const sendCode = await expectJson(
      `${baseUrl}/api/auth/send-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: smokeEmail }),
      },
      (payload) => {
        if (!payload.success) {
          throw new Error("Send code API did not succeed.");
        }
      },
      `${template.slug} send code`,
    );

    const verificationCode =
      sendCode.code ||
      (await readLatestVerificationCode({
        cwd,
        env,
        email: smokeEmail,
      }));

    const verifyLogin = await expectJson(
      `${baseUrl}/api/auth/verify-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: smokeEmail,
          code: verificationCode,
        }),
      },
      (payload) => {
        if (!payload.success || !payload.token) {
          throw new Error("Verify login did not return a token.");
        }
      },
      `${template.slug} verify login`,
    );

    const authMe = await expectJson(
      `${baseUrl}/api/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${verifyLogin.token}`,
        },
      },
      (payload) => {
        if (!payload.authenticated) {
          throw new Error("Auth me did not recognize the login token.");
        }
      },
      `${template.slug} auth me`,
    );

    const products = await listPaymentHubProducts(env);
    if (!products.length || !products[0]?.id) {
      throw new Error("Payment Hub did not return any active products.");
    }

    const countsBefore = await readTableCounts({
      cwd,
      env: runtimeEnv,
      businessTableName: fulfillmentModel.tableName,
    });

    const snapshotBeforeSection =
      snapshot.snapshot.sections.find(
        (section) => section.key === fulfillmentModel.targetExportName,
      ) ?? null;

    temporaryWebhook = await createTemporaryWebhook({
      env,
      webhookUrl: `${baseUrl}/api/pay/webhook`,
      name: `codex-${template.slug}-${Date.now()}`,
    });

    const paymentLink = await expectJson(
      `${baseUrl}/api/pay/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${verifyLogin.token}`,
        },
        body: JSON.stringify({
          productId: products[0].id,
        }),
      },
      (payload) => {
        if (!payload.success || !payload.checkoutUrl || !payload.checkoutRequestId) {
          throw new Error("Payment link API did not return checkoutUrl.");
        }
      },
      `${template.slug} create payment link`,
    );

    const webhookPayload = {
      type: "payment.succeeded",
      id: `evt_${template.slug}_${Date.now()}`,
      data: {
        id: `txn_${template.slug}_${Date.now()}`,
        userId: toPaymentHubUserId(authMe.user.id),
        productId: products[0].id,
        priceId: products[0].prices?.[0]?.id ?? null,
        amount: String(
          products[0].price?.amount ?? products[0].prices?.[0]?.amount ?? "9.90",
        ),
        currency:
          products[0].price?.currency ??
          products[0].prices?.[0]?.currency ??
          "usd",
        status: "succeeded",
        customerEmail: smokeEmail,
        customerName: "Smoke Test User",
        product: {
          id: products[0].id,
          name: products[0].name,
        },
      },
    };
    const webhookBody = JSON.stringify(webhookPayload);
    const webhookSignature = crypto
      .createHmac("sha256", temporaryWebhook.secret)
      .update(webhookBody)
      .digest("hex");

    const webhookResult = await expectJson(
      `${baseUrl}/api/pay/webhook`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-payment-hub-signature": webhookSignature,
        },
        body: webhookBody,
      },
      (payload) => {
        if (!payload.success || !payload.result) {
          throw new Error("Webhook route did not acknowledge the event.");
        }
        if (!["fulfilled", "duplicate"].includes(payload.result.status)) {
          throw new Error(`Unexpected webhook status ${payload.result.status}`);
        }
      },
      `${template.slug} payment webhook`,
    );

    const snapshotAfter = await expectJson(
      `${baseUrl}/api/template/snapshot`,
      undefined,
      (payload) => {
        if (!payload.success || !payload.snapshot?.sections?.length) {
          throw new Error("Template snapshot did not return seeded sections.");
        }
      },
      `${template.slug} template snapshot after webhook`,
    );

    const countsAfter = await readTableCounts({
      cwd,
      env: runtimeEnv,
      businessTableName: fulfillmentModel.tableName,
    });

    if (countsAfter.paymentEntitlements <= 0) {
      throw new Error("Webhook fulfillment did not create/update any payment entitlement.");
    }
    if (countsAfter.paymentFulfillments <= countsBefore.paymentFulfillments) {
      throw new Error("Webhook fulfillment did not record a payment fulfillment row.");
    }
    if (countsAfter.paymentWebhookEvents <= countsBefore.paymentWebhookEvents) {
      throw new Error("Webhook fulfillment did not persist the webhook event.");
    }

    const afterSection =
      snapshotAfter.snapshot.sections.find(
        (section) => section.key === fulfillmentModel.targetExportName,
      ) ?? null;

    if (!afterSection) {
      throw new Error(`Missing snapshot section ${fulfillmentModel.targetExportName}`);
    }

    const snapshotContainsSmokeUser = afterSection.items.some((item) =>
      JSON.stringify(item).toLowerCase().includes(smokeEmail.toLowerCase()),
    );

    if (!snapshotContainsSmokeUser && afterSection.total < (snapshotBeforeSection?.total ?? 0)) {
      throw new Error("Industry business table snapshot did not reflect the fulfilled record.");
    }

    const successPage = await fetch(
      `${baseUrl}/pay/success?checkout_request_id=${encodeURIComponent(
        paymentLink.checkoutRequestId,
      )}&product_id=${encodeURIComponent(products[0].id)}`,
    );
    const successHtml = await successPage.text();
    if (!successPage.ok || !/Fulfillment completed/i.test(successHtml)) {
      throw new Error("Payment success page did not render the fulfillment state.");
    }

    let ai = null;
    if (template.aiAssistant?.enabled) {
      ai = await expectJson(
        `${baseUrl}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: "Give me a one-sentence smoke test reply.",
              },
            ],
          }),
        },
        (payload) => {
          if (!payload.success || !payload.reply) {
            throw new Error("AI chat route did not return a reply.");
          }
        },
        `${template.slug} ai chat`,
      );
    }

    return {
      slug: template.slug,
      home: home.status,
      pricing: pricing.status,
      openapiPaths: Object.keys(openapi.paths ?? {}).length,
      snapshotSections: snapshot.snapshot.sections.length,
      checkoutUrl: paymentLink.checkoutUrl,
      checkoutRequestId: paymentLink.checkoutRequestId,
      webhookStatus: webhookResult.result.status,
      paymentEntitlements: countsAfter.paymentEntitlements,
      paymentFulfillments: countsAfter.paymentFulfillments,
      paymentWebhookEvents: countsAfter.paymentWebhookEvents,
      aiModel: ai?.model ?? null,
    };
  } finally {
    if (temporaryWebhook?.id) {
      try {
        await deleteTemporaryWebhook({ env, webhookId: temporaryWebhook.id });
      } catch {
        // Ignore remote cleanup failures during smoke verification.
      }
    }
    await server.stop();
  }
}

async function main() {
  const templates = JSON.parse(await readFile(configPath, "utf8"));
  const filter = process.env.D1V_TEMPLATE_FILTER?.trim();
  const selectedTemplates = filter
    ? templates.filter(
        (template) => template.slug === filter || template.id === filter,
      )
    : templates;
  const results = [];

  if (filter && selectedTemplates.length === 0) {
    throw new Error(`No template matched D1V_TEMPLATE_FILTER=${filter}`);
  }

  for (const [index, template] of selectedTemplates.entries()) {
    const port = 4500 + index;
    const result = await verifyTemplate({ template, port });
    results.push(result);
    console.log(
      JSON.stringify(
        {
          status: "ok",
          template: template.slug,
          port,
          result,
        },
        null,
        2,
      ),
    );
  }

  console.log(
    JSON.stringify(
        {
          success: true,
          verifiedTemplates: results.length,
          filter: filter || null,
          results,
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
