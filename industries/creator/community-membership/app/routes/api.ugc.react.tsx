import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { and, eq, sql } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcPosts, ugcReactions } from "~/db/schema";
import { REACTION_EMOJIS } from "~/components/ugc/Reactions";
import { getUserFromRequest } from "~/utils/auth.server";

const ALLOWED_EMOJIS = new Set<string>(REACTION_EMOJIS);

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const postId = url.searchParams.get("postId") ?? "";
  const user = await getUserFromRequest(request);

  if (!user) {
    return json({ reacted: [] as string[] });
  }

  if (!postId) {
    return json({ reacted: [] as string[] });
  }

  try {
    const rows = await db
      .select({ emoji: ugcReactions.emoji })
      .from(ugcReactions)
      .where(and(eq(ugcReactions.postId, postId), eq(ugcReactions.appUserId, user.id)));
    return json({ reacted: rows.map(r => r.emoji) });
  } catch (error) {
    console.error("Failed to load reactions:", error);
    return json({ reacted: [] as string[] });
  }
}

function buildReactionMap(rows: Array<{ emoji: string }>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    out[r.emoji] = (out[r.emoji] ?? 0) + 1;
  }
  return out;
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
  const emoji = formData.get("emoji");

  if (typeof postId !== "string" || postId.length === 0) {
    return json({ ok: false, error: "postId is required" }, { status: 400 });
  }
  if (typeof emoji !== "string" || !ALLOWED_EMOJIS.has(emoji)) {
    return json({ ok: false, error: "Invalid emoji" }, { status: 400 });
  }

  try {
    const existing = await db
      .select()
      .from(ugcReactions)
      .where(
        and(
          eq(ugcReactions.postId, postId),
          eq(ugcReactions.appUserId, user.id),
          eq(ugcReactions.emoji, emoji),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .delete(ugcReactions)
        .where(eq(ugcReactions.id, existing[0].id));
    } else {
      await db.insert(ugcReactions).values({
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        postId,
        appUserId: user.id,
        emoji,
      });
    }

    // Recompute counts and persist aggregated reactions JSON on the post
    const allReactions = await db
      .select({ emoji: ugcReactions.emoji })
      .from(ugcReactions)
      .where(eq(ugcReactions.postId, postId));

    const counts = buildReactionMap(allReactions);

    await db
      .update(ugcPosts)
      .set({ reactions: JSON.stringify(counts), updatedAt: sql`now()` })
      .where(eq(ugcPosts.id, postId));

    return json({ ok: true, reactions: counts });
  } catch (error) {
    console.error("Failed to toggle reaction:", error);
    return json({ ok: false, error: "Failed to toggle reaction" }, { status: 500 });
  }
}