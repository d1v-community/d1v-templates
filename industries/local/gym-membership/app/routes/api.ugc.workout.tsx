import { json, type ActionFunctionArgs } from "@remix-run/node";

import { db } from "~/db/db.server";
import { ugcWorkouts } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";

const MAX_NOTES = 1000;
const MAX_PR = 120;

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
  const type = (formData.get("type") ?? "").toString().trim();
  const durationMinRaw = (formData.get("durationMin") ?? "").toString();
  const notes = (formData.get("notes") ?? "").toString().slice(0, MAX_NOTES);
  const pr = (formData.get("pr") ?? "").toString().slice(0, MAX_PR);

  const durationMin = Number.parseInt(durationMinRaw, 10);

  if (!type) {
    return json({ ok: false, error: "type is required" }, { status: 400 });
  }
  if (!Number.isInteger(durationMin) || durationMin < 1 || durationMin > 600) {
    return json({ ok: false, error: "durationMin must be an integer between 1 and 600" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `w-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcWorkouts).values({
    id,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    type,
    durationMin,
    notes,
    pr,
  });

  return json({ ok: true, id });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcWorkoutRoute = true;