import { json, type ActionFunctionArgs } from "@remix-run/node";
import { eq, sql } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcComments, ugcPosts } from "~/db/schema";
import { getUserFromRequest } from "~/utils/auth.server";

// Loader is intentionally unused; export null so the route stays valid.
export const loader = null;

function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "M";
  return trimmed.charAt(0).toUpperCase();
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (request.method.toUpperCase() !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const postId = formData.get("postId");
  const body = formData.get("body");

  if (typeof postId !== "string" || postId.length === 0) {
    return json({ ok: false, error: "postId is required" }, { status: 400 });
  }
  const trimmedBody = typeof body === "string" ? body.trim() : "";
  if (trimmedBody.length === 0) {
    return json({ ok: false, error: "Body is required" }, { status: 400 });
  }
  if (trimmedBody.length > 1000) {
    return json({ ok: false, error: "Body exceeds 1000 characters" }, { status: 400 });
  }

  const authorName = user.displayName ?? user.username ?? user.email ?? "Member";
  const authorInitials = initialsFromName(authorName);

  try {
    // Confirm the post exists
    const postRows = await db.select({ id: ugcPosts.id }).from(ugcPosts).where(eq(ugcPosts.id, postId)).limit(1);
    if (postRows.length === 0) {
      return json({ ok: false, error: "Post not found" }, { status: 404 });
    }

    await db.insert(ugcComments).values({
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      postId,
      appUserId: user.id,
      authorName,
      authorInitials,
      body: trimmedBody,
    });

    await db
      .update(ugcPosts)
      .set({ commentCount: sql`${ugcPosts.commentCount} + 1`, updatedAt: sql`now()` })
      .where(eq(ugcPosts.id, postId));

    return json({ ok: true });
  } catch (error) {
    console.error("Failed to post comment:", error);
    return json({ ok: false, error: "Failed to post comment" }, { status: 500 });
  }
}