import { json, type ActionFunctionArgs } from "@remix-run/node";

import { db } from "~/db/db.server";
import { ugcPackSubmissions } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";

const MAX_CONTENT = 4000;
const MAX_NAME = 120;
const MAX_WORKFLOW = 60;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const user = await requireUserOrRedirect(request);
  const formData = await request.formData();
  const name = (formData.get("name") ?? "").toString().trim().slice(0, MAX_NAME);
  const workflow = (formData.get("workflow") ?? "").toString().trim().slice(0, MAX_WORKFLOW);
  const content = (formData.get("content") ?? "").toString().trim().slice(0, MAX_CONTENT);

  if (!name) {
    return json({ ok: false, error: "name is required" }, { status: 400 });
  }
  if (!workflow) {
    return json({ ok: false, error: "workflow is required" }, { status: 400 });
  }
  if (!content) {
    return json({ ok: false, error: "content is required" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcPackSubmissions).values({
    id,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    name,
    workflow,
    content,
    status: "pending",
  });

  return json({ ok: true, id });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcSubmitPackRoute = true;