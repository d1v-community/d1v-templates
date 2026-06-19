import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { asc, eq } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { PageHeader } from "~/components/sections/PageHeader";
import { CommentThread, type CommentEntry } from "~/components/ugc/CommentThread";
import { PostCard, type PostCardData } from "~/components/ugc/PostCard";
import { db } from "~/db/db.server";
import { ugcComments, ugcPosts, ugcReactions } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";
import { getUserFromRequest } from "~/utils/auth.server";

export const meta: MetaFunction = ({ params }) => [
  { title: `Post · ${params.id ?? ""} · ${APP_TITLE}` },
  { name: "description", content: "Member post detail and replies." },
];

function parseReactions(raw: string | null | undefined): Record<string, number> {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === "object") {
      const out: Record<string, number> = {};
      for (const [k, v] of Object.entries(obj)) {
        const n = typeof v === "number" ? v : Number(v);
        if (!Number.isNaN(n)) out[k] = n;
      }
      return out;
    }
  } catch {
    // fall through
  }
  return {};
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? "";

  let post: PostCardData | null = null;
  let comments: CommentEntry[] = [];
  let reacted: string[] = [];

  try {
    const postRows = await db.select().from(ugcPosts).where(eq(ugcPosts.id, id)).limit(1);
    if (postRows.length > 0) {
      const row = postRows[0];
      post = {
        id: row.id,
        author: {
          id: row.appUserId,
          name: row.authorName,
          initials: row.authorInitials,
        },
        body: row.body,
        createdAt:
          row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt ?? ""),
        reactions: parseReactions(row.reactions),
        commentCount: row.commentCount,
      };

      const commentRows = await db
        .select()
        .from(ugcComments)
        .where(eq(ugcComments.postId, row.id))
        .orderBy(asc(ugcComments.createdAt));

      comments = commentRows.map(c => ({
        id: c.id,
        authorName: c.authorName,
        authorInitials: c.authorInitials,
        body: c.body,
        createdAt:
          c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt ?? ""),
      }));

      const reactionRows = await db
        .select()
        .from(ugcReactions)
        .where(eq(ugcReactions.postId, row.id));
      reacted = reactionRows
        .filter(r => r.appUserId === user.id)
        .map(r => r.emoji);
    }
  } catch (error) {
    console.error("Failed to load post detail:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    id,
    post,
    comments,
    reacted,
  });
}

export default function PostDetail() {
  const { user, id, post, comments, reacted } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d?.authenticated ? setClientUser(d.user) : setClientUser(null)))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      navigate("/?signedOut=1", { replace: true });
    }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Post · ${id}`}
          title={post ? "Reply to this post" : "Post not found"}
          description={
            post
              ? `Posted by ${post.author.name}. Reactions and replies are visible to members.`
              : "This post may have been removed or never existed."
          }
          back={{ href: "/feed", label: "Back to feed" }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          {post ? (
            <>
              <PostCard
                post={post}
                currentUserReacted={reacted}
              />
              <section className={`flex flex-col gap-4 rounded-2xl p-5 ${theme.metricShell}`}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
                    {comments.length === 0 ? "Replies" : `${comments.length} ${comments.length === 1 ? "reply" : "replies"}`}
                  </h2>
                  <Link
                    to="/feed/new"
                    className={`text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70 transition hover:opacity-100 ${theme.subEyebrow}`}
                  >
                    New post →
                  </Link>
                </div>
                <CommentThread
                  comments={comments}
                  hidden={{ postId: post.id }}
                  placeholder="Reply with a quick note…"
                />
              </section>
            </>
          ) : (
            <Link
              to="/feed"
              className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}
            >
              <span aria-hidden>←</span> Back to feed
            </Link>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}