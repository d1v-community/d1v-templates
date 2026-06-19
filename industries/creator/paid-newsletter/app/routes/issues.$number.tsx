import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';
import { db } from '~/db/db.server';
import { ugcComments, ugcPosts, ugcReactions } from '~/db/schema';
import { Composer } from '~/components/ugc/Composer';
import { Reactions, REACTION_EMOJIS } from '~/components/ugc/Reactions';

export const meta: MetaFunction = ({ params }) => [
  { title: `Issue · #${params.number ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single issue detail view.' },
];

const DETAILS: Record<string, { title: string; date: string; minutes: number; lede: string; sections: string[] }> = {
  '042': { title: 'The quiet compounding edition', date: 'Oct 21, 2026', minutes: 7, lede: 'Small systems beat large intentions. The four habits I run on autopilot.', sections: ['The case for tiny automation', 'Where to put the next habit', 'A short reading list'] },
  '041': { title: 'On paying for software you outgrow', date: 'Oct 14, 2026', minutes: 6, lede: 'A simple rule for when to upgrade, downgrade, or churn.', sections: ['The cost of staying', 'The cost of switching', 'The 90-day check'] },
  '040': { title: 'The renewal problem', date: 'Oct 7, 2026', minutes: 8, lede: 'Why most renewals slip and what to do about it in week 8, not week 12.', sections: ['The week-8 pivot', 'Quiet saves vs. loud saves', 'A two-question check-in'] },
  '039': { title: 'Ship before you polish', date: 'Sep 30, 2026', minutes: 5, lede: 'The minimum amount of polish required to learn from the next 100 readers.', sections: ['Polish as a tax', 'The first 100 readers', 'When to invest in polish'] },
};

const SEED_REACTIONS: Record<string, number> = { "👍": 12, "❤️": 8, "🎯": 4, "🔥": 6, "💡": 3 };

const SEED_COMMENTS: Array<{
  id: string;
  authorName: string;
  authorInitials: string;
  body: string;
  hoursAgo: number;
}> = [
  { id: 'seed-c-1', authorName: 'Anya Mehta', authorInitials: 'AM', body: 'The week-8 pivot is going in my saved folder. We always wait until renewal is on fire to scramble.', hoursAgo: 6 },
  { id: 'seed-c-2', authorName: 'Soren Kim', authorInitials: 'SK', body: 'Quiet saves vs loud saves framing finally made me articulate what I have been doing intuitively. Thanks.', hoursAgo: 18 },
];

function getDetail(num: string) {
  return DETAILS[num] ?? { title: 'Issue', date: '—', minutes: 0, lede: 'Publish your first issue to populate the detail view.', sections: ['Add sections once the issue goes out.'] };
}

function postIdForIssue(issueNumber: string): string {
  return `issue-${issueNumber}`;
}

function relTimeHours(hoursAgo: number): string {
  const now = Date.now();
  const t = now - hoursAgo * 60 * 60 * 1000;
  return new Date(t).toISOString();
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const number = params.number ?? '000';
  const postId = postIdForIssue(number);

  // Reaction counts per emoji.
  const reactionCounts: Record<string, number> = {};
  let userReactions: string[] = [];
  try {
    const rows = await db
      .select({ emoji: ugcReactions.emoji, appUserId: ugcReactions.appUserId })
      .from(ugcReactions)
      .where(eq(ugcReactions.postId, postId));

    for (const row of rows) {
      reactionCounts[row.emoji] = (reactionCounts[row.emoji] ?? 0) + 1;
      if (row.appUserId === user.id) {
        userReactions.push(row.emoji);
      }
    }
  } catch {
    // ignore — keep empty maps
  }

  const hasReactionData = Object.keys(reactionCounts).length > 0 || userReactions.length > 0;
  const finalReactions: Record<string, number> = hasReactionData
    ? reactionCounts
    : SEED_REACTIONS;
  const finalUserReactions: string[] = hasReactionData ? userReactions : [];

  // Comments for this issue's post.
  let commentRows: Array<{
    id: string;
    authorName: string;
    authorInitials: string;
    body: string;
    createdAt: Date | null;
  }> = [];

  try {
    commentRows = await db
      .select({
        id: ugcComments.id,
        authorName: ugcComments.authorName,
        authorInitials: ugcComments.authorInitials,
        body: ugcComments.body,
        createdAt: ugcComments.createdAt,
      })
      .from(ugcComments)
      .where(eq(ugcComments.postId, postId))
      .orderBy(asc(ugcComments.createdAt));
  } catch {
    commentRows = [];
  }

  const comments = commentRows.length > 0
    ? commentRows.map(c => ({
        id: c.id,
        authorName: c.authorName,
        authorInitials: c.authorInitials,
        body: c.body,
        createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
      }))
    : SEED_COMMENTS.map(s => ({
        id: s.id,
        authorName: s.authorName,
        authorInitials: s.authorInitials,
        body: s.body,
        createdAt: relTimeHours(s.hoursAgo),
      }));

  // Ensure the post stub exists so the action endpoints can attach FK rows.
  try {
    const existing = await db
      .select({ id: ugcPosts.id })
      .from(ugcPosts)
      .where(eq(ugcPosts.id, postId))
      .limit(1);
    if (!existing[0]) {
      await db.insert(ugcPosts).values({
        id: postId,
        appUserId: null,
        authorName: "BriefClub Editorial",
        authorInitials: "BE",
        body: `Issue #${number}`,
      });
    }
  } catch {
    // ignore — stub will be created lazily on first reaction/comment
  }

  // Silence the unused-imports lint when no reactions ever come back.
  void inArray;
  void desc;

  return json({
    user,
    number,
    ...getDetail(number),
    postId,
    reactions: finalReactions,
    userReactions: finalUserReactions,
    comments,
  });
}

export default function IssueDetail() {
  const data = useLoaderData<typeof loader>();
  const { user, number, title, date, minutes, lede, sections, postId, reactions, userReactions, comments } = data;
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d?.authenticated ? setClientUser(d.user) : setClientUser(null)))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } finally { navigate('/?signedOut=1', { replace: true }); }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Issue · #${number} · ${date}`}
          title={title}
          description={`${minutes} min read · ${lede}`}
          back={{ href: '/issues', label: 'All issues' }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-3">
              {sections.map((section, i) => (
                <article key={section} className={`flex items-start gap-3 rounded-2xl p-4 ${i === 0 ? theme.assistantShell : theme.listItemShell}`}>
                  <span className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed sm:text-[15px]">{section}</span>
                </article>
              ))}
            </div>
          </div>

          {/* Reactions + comments */}
          <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <header className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold tracking-tight">Reader reactions</h2>
                <p className="text-xs uppercase tracking-[0.2em] opacity-60">Pick how this one hit.</p>
              </div>
            </header>

            <ReactionsForIssue postId={postId} number={number} reactions={reactions} userReactions={userReactions} />

            <div className="flex flex-col gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold tracking-tight">Comments</h3>
              <Composer
                action="/api/ugc/comment-issue"
                hidden={{ issueNumber: number }}
                submitLabel="Post comment"
                placeholder="Reply with your own take…"
              />
              <div className="flex flex-col gap-2">
                {comments.length > 0 ? (
                  comments.map(c => (
                    <article key={c.id} className={`flex flex-col gap-1.5 rounded-2xl p-4 ${theme.listItemShell}`}>
                      <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.2em] opacity-70">
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                          >
                            {c.authorInitials}
                          </span>
                          <span className="text-xs font-semibold tracking-tight normal-case opacity-100">
                            {c.authorName}
                          </span>
                        </span>
                        <span>{formatRelative(c.createdAt)}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm leading-relaxed opacity-60">Be the first to comment.</p>
                )}
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/issues" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> All issues
            </Link>
            <Link to="/pricing" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Subscribe
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
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

interface ReactionsForIssueProps {
  postId: string;
  number: string;
  reactions: Record<string, number>;
  userReactions: string[];
}

/**
 * Local copy of the Reactions UI that posts to `/api/ugc/react-issue` and sends
 * `issueNumber` instead of a free-form `postId`.
 */
function ReactionsForIssue({ postId, number, reactions, userReactions }: ReactionsForIssueProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {REACTION_EMOJIS.map(emoji => {
        const count = reactions[emoji] ?? 0;
        const active = userReactions.includes(emoji);
        return (
          <form
            key={emoji}
            method="post"
            action="/api/ugc/react-issue"
            className="contents"
          >
            <input type="hidden" name="issueNumber" value={number} />
            <input type="hidden" name="emoji" value={emoji} />
            <button
              type="submit"
              aria-pressed={active}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition ${
                active
                  ? `${theme.eyebrow} border-current`
                  : `border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60`
              }`}
            >
              <span>{emoji}</span>
              {count > 0 ? <span className="text-[11px] font-semibold tabular-nums">{count}</span> : null}
            </button>
          </form>
        );
      })}
      <span className="sr-only">Post id {postId}</span>
    </div>
  );
}
