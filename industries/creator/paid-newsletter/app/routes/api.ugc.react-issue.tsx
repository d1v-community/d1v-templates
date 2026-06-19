import { json, type ActionFunctionArgs } from "@remix-run/node";
import { and, eq } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcPosts, ugcReactions, users } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";
import { REACTION_EMOJIS } from "~/components/ugc/Reactions";

function postIdForIssue(issueNumber: string): string {
  return `issue-${issueNumber}`;
}

async function ensureIssuePost(issueNumber: string): Promise<string> {
  const postId = postIdForIssue(issueNumber);

  let existing: { id: string } | undefined;
  try {
    const rows = await db
      .select({ id: ugcPosts.id })
      .from(ugcPosts)
      .where(eq(ugcPosts.id, postId))
      .limit(1);
    existing = rows[0];
  } catch {
    existing = undefined;
  }

  if (existing) return existing.id;

  let editorId: string | null = null;
  try {
    const editorRows = await db.select({ id: users.id }).from(users).limit(1);
    editorId = editorRows[0]?.id ?? null;
  } catch {
    editorId = null;
  }

  try {
    await db.insert(ugcPosts).values({
      id: postId,
      appUserId: editorId,
      authorName: "BriefClub Editorial",
      authorInitials: "BE",
      body: `Issue #${issueNumber}`,
    });
  } catch {
    // ignore — concurrent insert path
  }

  return postId;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const user = await requireUserOrRedirect(request);

  const formData = await request.formData();
  const issueNumber = (formData.get("issueNumber") ?? "").toString().trim();
  const emoji = (formData.get("emoji") ?? "").toString();

  if (!issueNumber) {
    return json({ ok: false, error: "issueNumber is required" }, { status: 400 });
  }
  if (!REACTION_EMOJIS.includes(emoji as (typeof REACTION_EMOJIS)[number])) {
    return json({ ok: false, error: "emoji is invalid" }, { status: 400 });
  }

  const postId = await ensureIssuePost(issueNumber);

  // Toggle: if the user already reacted with this emoji on this post, remove it.
  let existing: { id: string } | undefined;
  try {
    const rows = await db
      .select({ id: ugcReactions.id })
      .from(ugcReactions)
      .where(
        and(
          eq(ugcReactions.postId, postId),
          eq(ugcReactions.appUserId, user.id),
          eq(ugcReactions.emoji, emoji),
        ),
      )
      .limit(1);
    existing = rows[0];
  } catch {
    existing = undefined;
  }

  if (existing) {
    await db.delete(ugcReactions).where(eq(ugcReactions.id, existing.id));
    return json({ ok: true, action: "removed", emoji });
  }

  const id = `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await db.insert(ugcReactions).values({
    id,
    postId,
    appUserId: user.id,
    emoji,
  });

  return json({ ok: true, action: "added", emoji });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcReactIssueRoute = true;
void postIdForIssue;
