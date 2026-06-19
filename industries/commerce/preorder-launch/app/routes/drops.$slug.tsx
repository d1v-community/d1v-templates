import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { and, desc, eq } from 'drizzle-orm';
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
import { ugcReviews, ugcShares } from '~/db/schema';
import { ReviewStars } from '~/components/ugc/ReviewStars';
import { Composer } from '~/components/ugc/Composer';

export const meta: MetaFunction = ({ params }) => [
  { title: `Drop · ${params.slug ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single drop detail view.' },
];

const DETAILS: Record<string, { title: string; tier: number; price: string; when: string; includes: string[] }> = {
  'first-drop': { title: 'First drop — Issue 1', tier: 1, price: '$24', when: 'Now', includes: ['Founders note', 'Lite template', 'Community thread access'] },
  'volume-2': { title: 'Volume 2 — Issue 2', tier: 2, price: '$48', when: 'In 7d', includes: ['Everything in tier 1', 'Pro template', 'Two recorded walkthroughs'] },
  'volume-3': { title: 'Volume 3 — Issue 3', tier: 3, price: '$96', when: 'In 21d', includes: ['Everything in tier 2', 'Live cohort call', 'Bonus asset pack'] },
};

const SHARE_CHANNELS: Array<{ id: string; label: string }> = [
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'bluesky', label: 'Bluesky' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'email', label: 'Email' },
  { id: 'other', label: 'Other' },
];

const SEED_REVIEWS: Array<{
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  body: string;
  daysAgo: number;
}> = [
  { id: 'seed-rev-1', authorName: 'Hana Suzuki', authorInitials: 'HS', rating: 5, body: 'Tier 1 already paid for itself — the founders note is the clearest I have read all quarter.', daysAgo: 3 },
  { id: 'seed-rev-2', authorName: 'Owen Becker', authorInitials: 'OB', rating: 4, body: 'Liked it. Volume 2 cohort slot sold out fast, so glad I locked in.', daysAgo: 9 },
];

function getDetail(slug: string) {
  return DETAILS[slug] ?? { title: slug, tier: 1, price: '$—', when: '—', includes: ['Replace with the actual unlock.'] };
}

function relTime(daysAgo: number): string {
  const now = Date.now();
  const t = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(t).toISOString();
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const slug = params.slug ?? 'unknown';
  const detail = getDetail(slug);

  let reviewRows: Array<{
    id: string;
    authorName: string;
    authorInitials: string;
    rating: number;
    body: string;
    createdAt: Date | null;
  }> = [];

  try {
    reviewRows = await db
      .select({
        id: ugcReviews.id,
        authorName: ugcReviews.authorName,
        authorInitials: ugcReviews.authorInitials,
        rating: ugcReviews.rating,
        body: ugcReviews.body,
        createdAt: ugcReviews.createdAt,
      })
      .from(ugcReviews)
      .where(and(eq(ugcReviews.contextKind, 'drop'), eq(ugcReviews.contextSlug, slug)))
      .orderBy(desc(ugcReviews.createdAt));
  } catch {
    reviewRows = [];
  }

  const hasReviews = reviewRows.length > 0;
  const reviews = hasReviews
    ? reviewRows.map(r => ({
        id: r.id,
        authorName: r.authorName,
        authorInitials: r.authorInitials,
        rating: r.rating,
        body: r.body,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
      }))
    : SEED_REVIEWS.map(s => ({
        id: s.id,
        authorName: s.authorName,
        authorInitials: s.authorInitials,
        rating: s.rating,
        body: s.body,
        createdAt: relTime(s.daysAgo),
      }));

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  // Per-channel share counts (DB only; fallback omitted — share log lives in DB).
  const channelCounts: Record<string, number> = {};
  try {
    const shareRows = await db
      .select({ channel: ugcShares.channel })
      .from(ugcShares)
      .where(eq(ugcShares.dropId, slug));
    for (const row of shareRows) {
      channelCounts[row.channel] = (channelCounts[row.channel] ?? 0) + 1;
    }
  } catch {
    // Keep zeros.
  }

  return json({
    user,
    slug,
    ...detail,
    reviews,
    avgRating,
    channelCounts,
  });
}

export default function DropDetail() {
  const data = useLoaderData<typeof loader>();
  const { user, slug, title, tier, price, when, includes, reviews, avgRating, channelCounts } = data;
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
          eyebrow={`Tier ${tier} · ${when}`}
          title={title}
          description="Lock in the current tier. Higher tiers unlock at scheduled drops."
          back={{ href: '/drops', label: 'All drops' }}
          trailing={<span className={`text-3xl font-semibold tracking-[-0.04em] ${theme.metricValue}`}>{price}</span>}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-2">
              {includes.map((line, i) => (
                <article key={line} className={`flex items-start gap-3 rounded-2xl p-4 ${i === 0 ? theme.assistantShell : theme.listItemShell}`}>
                  <span className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed sm:text-[15px]">{line}</span>
                </article>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <header className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
                <p className="text-xs uppercase tracking-[0.2em] opacity-60">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  {avgRating > 0 ? ` · avg ${avgRating.toFixed(1)} / 5` : ''}
                </p>
              </div>
              {avgRating > 0 ? (
                <ReviewStars value={Math.round(avgRating)} showValue />
              ) : null}
            </header>

            <Composer
              action="/api/ugc/review-drop"
              hidden={{ dropSlug: slug, rating: '5' }}
              submitLabel="Post review"
              placeholder="Share your take on this drop…"
            />

            <div className="flex flex-col gap-3">
              {reviews.map(r => (
                <article key={r.id} className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.listItemShell}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                      >
                        {r.authorInitials}
                      </span>
                      <span className="text-sm font-semibold tracking-tight">{r.authorName}</span>
                    </div>
                    <ReviewStars value={r.rating} size="sm" />
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{r.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Share */}
          <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <header className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight">Share this drop</h2>
              <p className="text-xs uppercase tracking-[0.2em] opacity-60">Pick a channel and log a share.</p>
            </header>

            <div className="flex flex-wrap gap-2">
              {SHARE_CHANNELS.map(channel => (
                <form
                  key={channel.id}
                  method="post"
                  action="/api/ugc/share-drop"
                  className="contents"
                >
                  <input type="hidden" name="dropId" value={slug} />
                  <input type="hidden" name="channel" value={channel.id} />
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60`}
                  >
                    <span>{channel.label}</span>
                    {channelCounts[channel.id] ? (
                      <span className="tabular-nums opacity-70">{channelCounts[channel.id]}</span>
                    ) : null}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/drops" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> All drops
            </Link>
            <Link to="/pricing" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Reserve my copy
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
