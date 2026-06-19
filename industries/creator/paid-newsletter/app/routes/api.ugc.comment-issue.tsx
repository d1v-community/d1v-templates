import { json, type ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcComments, ugcPosts, users } from "~/db/schema";
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

function postIdForIssue(issueNumber: string): string {
  return `issue-${issueNumber}`;
}

/**
 * Ensure a stub `ugc_posts` row exists for an issue so that comments and reactions
 * have a valid foreign-key target. We use the editor (BriefClub) as the author.
 */
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

  // Pick any user as the editor surrogate; first user in the users table.
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
    // If insert fails (e.g. concurrent insert), try a second select.
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
  const rawBody = (formData.get("body") ?? "").toString();

  const body = rawBody.trim().slice(0, MAX_BODY);

  if (!issueNumber) {
    return json({ ok: false, error: "issueNumber is required" }, { status: 400 });
  }
  if (!body) {
    return json({ ok: false, error: "body is required" }, { status: 400 });
  }

  const postId = await ensureIssuePost(issueNumber);

  const authorName = user.displayName || user.username || "Member";
  const id = `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcComments).values({
    id,
    postId,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    body,
  });

  return json({ ok: true, id, postId });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcCommentIssueRoute = true;
void postIdForIssue;
