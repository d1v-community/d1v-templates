import { json, type ActionFunctionArgs } from "@remix-run/node";
import { eq, sql } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcPeerReviews, ugcSubmissions } from "~/db/schema";
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
  const submissionId = (formData.get("submissionId") ?? "").toString().trim();
  const rawBody = (formData.get("body") ?? "").toString();
  const ratingRaw = (formData.get("rating") ?? "").toString();

  const body = rawBody.trim().slice(0, MAX_BODY);
  const rating = Math.max(1, Math.min(5, Number.parseInt(ratingRaw, 10) || 0));

  if (!submissionId) {
    return json({ ok: false, error: "submissionId is required" }, { status: 400 });
  }
  if (!body) {
    return json({ ok: false, error: "body is required" }, { status: 400 });
  }
  if (rating < 1) {
    return json({ ok: false, error: "rating must be 1-5" }, { status: 400 });
  }

  const reviewerName = user.displayName || user.username || "Reviewer";
  const id = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcPeerReviews).values({
    id,
    submissionId,
    reviewerName,
    reviewerInitials: initialsFromName(reviewerName),
    rating,
    body,
  });

  await db
    .update(ugcSubmissions)
    .set({ reviewCount: sql`${ugcSubmissions.reviewCount} + 1`, updatedAt: new Date() })
    .where(eq(ugcSubmissions.id, submissionId));

  return json({ ok: true, id, rating });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}
