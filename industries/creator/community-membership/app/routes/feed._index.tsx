import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";

import { EmptyState } from "~/components/sections/EmptyState";
import { PostCard, type PostCardData } from "~/components/ugc/PostCard";
import { db } from "~/db/db.server";
import { ugcPosts, ugcReactions } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Feed · ${APP_TITLE}` },
  { name: "description", content: "Member feed with updates, reactions, and replies." },
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

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);

  let posts: PostCardData[] = [];
  const reactedByPost: Record<string, string[]> = {};

  try {
    const rows = await db
      .select()
      .from(ugcPosts)
      .where(eq(ugcPosts.contextKind, "feed"))
      .orderBy(desc(ugcPosts.createdAt));

    if (rows.length > 0) {
      const myReactions = await db
        .select()
        .from(ugcReactions)
        .where(eq(ugcReactions.appUserId, user.id));
      for (const r of myReactions) {
        const list = reactedByPost[r.postId] ?? [];
        list.push(r.emoji);
        reactedByPost[r.postId] = list;
      }
    }

    posts = rows.map(row => ({
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
    }));
  } catch (error) {
    console.error("Failed to load feed posts:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    posts,
    reactedByPost,
  });
}

export default function FeedIndex() {
  const { posts, reactedByPost } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm leading-relaxed ${theme.body}`}>
          Updates, questions, and small wins from members. React, reply, or start your own thread.
        </p>
        <Link
          to="/feed/new"
          className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold transition ${theme.primaryButton}`}
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No posts yet"
          description="Be the first to share something with the circle — a question, a win, or a small update."
          hint="composer → post"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              commentHrefBase="/posts"
              currentUserReacted={reactedByPost[post.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}