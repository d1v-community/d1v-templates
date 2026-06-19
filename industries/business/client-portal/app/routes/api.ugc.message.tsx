import { json, type ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcRequestMessages } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";

const MAX_BODY = 1000;

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
  const requestId = (formData.get("requestId") ?? "").toString().trim();
  const rawBody = (formData.get("body") ?? "").toString();
  const isInternal = (formData.get("isInternal") ?? "false").toString();

  const body = rawBody.trim().slice(0, MAX_BODY);

  if (!requestId) {
    return json({ ok: false, error: "requestId is required" }, { status: 400 });
  }
  if (!body) {
    return json({ ok: false, error: "body is required" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcRequestMessages).values({
    id,
    requestId,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    body,
    isInternal: isInternal === "true" ? "true" : "false",
  });

  return json({ ok: true, id });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

// Marker export to avoid tree-shaking when nothing else references this file.
export const __ugcMessageRoute = true;
void eq;
