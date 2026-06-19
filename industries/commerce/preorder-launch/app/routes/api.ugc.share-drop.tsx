import { json, type ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcShares } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";

const VALID_CHANNELS = new Set(["twitter", "linkedin", "bluesky", "reddit", "email", "other"]);

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
  const dropId = (formData.get("dropId") ?? "").toString().trim();
  const channel = (formData.get("channel") ?? "").toString().trim().toLowerCase();

  if (!dropId) {
    return json({ ok: false, error: "dropId is required" }, { status: 400 });
  }
  if (!VALID_CHANNELS.has(channel)) {
    return json({ ok: false, error: "channel is invalid" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `share-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcShares).values({
    id,
    dropId,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    channel,
  });

  return json({ ok: true, id, channel });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcShareDropRoute = true;
void eq;
