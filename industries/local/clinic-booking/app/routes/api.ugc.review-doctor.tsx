import { json, type ActionFunctionArgs } from "@remix-run/node";

import { db } from "~/db/db.server";
import { ugcReviews } from "~/db/schema";
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
  const doctorId = (formData.get("doctorId") ?? "").toString().trim();
  const rawRating = (formData.get("rating") ?? "").toString();
  const rawBody = (formData.get("body") ?? "").toString();
  const body = rawBody.trim().slice(0, MAX_BODY);

  const rating = Number.parseInt(rawRating, 10);

  if (!doctorId) {
    return json({ ok: false, error: "doctorId is required" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ ok: false, error: "rating must be an integer between 1 and 5" }, { status: 400 });
  }
  if (!body) {
    return json({ ok: false, error: "body is required" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Patient";
  const id = `rv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcReviews).values({
    id,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    contextKind: "doctor",
    contextSlug: doctorId,
    rating,
    body,
  });

  return json({ ok: true, id });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcReviewDoctorRoute = true;