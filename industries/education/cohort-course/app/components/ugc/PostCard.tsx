import { Link } from "@remix-run/react";

import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { Reactions, REACTION_EMOJIS } from "~/components/ugc/Reactions";

export interface PostCardAuthor {
  id: string;
  name: string;
  initials: string;
  role?: string;
}

export interface PostCardData {
  id: string;
  author: PostCardAuthor;
  body: string;
  createdAt: string;
  contextRef?: { kind: string; slug: string };
  reactions: Record<string, number>;
  commentCount: number;
  rating?: number;
  /** Optional animation stagger index. Larger = later in the list. */
  index?: number;
}

interface PostCardProps {
  post: PostCardData;
  /** Path prefix for the comment thread route. The component builds `{hrefBase}/{id}`. */
  commentHrefBase?: string;
  /** Optional current user id so the Reactions component can show "I reacted". */
  currentUserReacted?: string[];
  /** Optional animation stagger index (defaults to 0). */
  index?: number;
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function PostCard({ post, commentHrefBase, currentUserReacted = [], index = 0 }: PostCardProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const commentHref = commentHrefBase ? `${commentHrefBase}/${post.id}` : null;

  // Stagger animation: each card enters with a 50ms delay (capped at 12)
  const delay = Math.min(index, 12) * 50;

  return (
    <article
      className={`group flex flex-col gap-3 rounded-2xl p-5 motion-safe:animate-[ugc-slide-up_0.35s_ease-out_both] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md transition-all duration-200 ${theme.metricShell}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-semibold transition-transform motion-safe:group-hover:scale-105 ${theme.eyebrow}`}
            aria-hidden
          >
            {post.author.initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight truncate">{post.author.name}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] opacity-60">
              {post.author.role ?? "Member"} · {formatRelative(post.createdAt)}
            </p>
          </div>
        </div>
        {post.rating != null ? (
          <span
            className="text-sm font-semibold tracking-tight transition-all duration-200 motion-safe:hover:scale-105"
            aria-label={`${post.rating} out of 5 stars`}
          >
            <span className="text-amber-500">{"★".repeat(post.rating)}</span>
            <span className="opacity-30">{"★".repeat(5 - post.rating)}</span>
          </span>
        ) : null}
      </header>

      <p className="whitespace-pre-wrap text-sm leading-relaxed">{post.body}</p>

      <footer className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <Reactions
          postId={post.id}
          reactions={post.reactions}
          reactedByCurrentUser={currentUserReacted}
        />
        {commentHref ? (
          <Link
            to={commentHref}
            className={`text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70 transition-all duration-150 motion-safe:hover:opacity-100 motion-safe:hover:translate-x-0.5 ${theme.subEyebrow}`}
          >
            {post.commentCount > 0 ? `${post.commentCount} comments` : "Reply"} →
          </Link>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">
            {post.commentCount > 0 ? `${post.commentCount} comments` : "0 comments"}
          </span>
        )}
      </footer>
    </article>
  );
}

export { REACTION_EMOJIS };
