import { json, type ActionFunctionArgs } from "@remix-run/node";

import { db } from "~/db/db.server";
import { ugcPrs } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";

const MAX_NOTE = 120;

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
  const movement = (formData.get("movement") ?? "").toString().trim();
  const weightKgRaw = (formData.get("weightKg") ?? "").toString();
  const repsRaw = (formData.get("reps") ?? "").toString();
  const note = (formData.get("note") ?? "").toString().slice(0, MAX_NOTE);
  const achievedAt = (formData.get("achievedAt") ?? "").toString().trim();

  const weightKg = Number.parseInt(weightKgRaw, 10);
  const reps = Number.parseInt(repsRaw, 10);

  if (!movement) {
    return json({ ok: false, error: "movement is required" }, { status: 400 });
  }
  if (!Number.isInteger(weightKg) || weightKg < 0) {
    return json({ ok: false, error: "weightKg must be a non-negative integer" }, { status: 400 });
  }
  if (!Number.isInteger(reps) || reps < 1) {
    return json({ ok: false, error: "reps must be a positive integer" }, { status: 400 });
  }
  if (!achievedAt) {
    return json({ ok: false, error: "achievedAt is required" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `pr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcPrs).values({
    id,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    movement,
    weightKg,
    reps,
    note,
    achievedAt,
  });

  return json({ ok: true, id });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcPrRoute = true;