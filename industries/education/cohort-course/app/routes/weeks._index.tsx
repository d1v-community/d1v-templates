import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { desc, eq, inArray } from 'drizzle-orm';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { EmptyState } from '~/components/sections/EmptyState';
import { PageHeader } from '~/components/sections/PageHeader';
import { db } from '~/db/db.server';
import { ugcSubmissions } from '~/db/schema';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = () => [
  { title: `Syllabus · ${APP_TITLE}` },
  { name: 'description', content: '8-week cohort course syllabus and outcomes.' },
];

const WEEKS = [
  { n: 1, title: 'Why now', outcome: 'Name the constraint and the bet', deliverable: 'One-page problem framing' },
  { n: 2, title: 'Audience and offer', outcome: 'Pick the buyer and the shape of value', deliverable: 'Offer canvas' },
  { n: 3, title: 'Build the v0', outcome: 'Ship the smallest thing that proves the bet', deliverable: 'V0 demo + debrief' },
  { n: 4, title: 'Pricing and packaging', outcome: 'Set the price with intent', deliverable: 'Pricing card + rationale' },
  { n: 5, title: 'First 10 buyers', outcome: 'Hand-sell the first cohort', deliverable: 'Outreach log' },
  { n: 6, title: 'Operations and onboarding', outcome: 'Move buyers into the product without a queue', deliverable: 'Onboarding flow' },
  { n: 7, title: 'Retention loops', outcome: 'Make the second purchase obvious', deliverable: 'Renewal script' },
  { n: 8, title: 'Scale or stop', outcome: 'Decide the next 90 days with evidence', deliverable: 'Decision memo' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);

  const recentByWeek: Record<number, { id: string; authorName: string; body: string; reviewCount: number }[]> = {};
  try {
    const rows = await db
      .select({
        id: ugcSubmissions.id,
        weekN: ugcSubmissions.weekN,
        authorName: ugcSubmissions.authorName,
        body: ugcSubmissions.body,
        reviewCount: ugcSubmissions.reviewCount,
        createdAt: ugcSubmissions.createdAt,
      })
      .from(ugcSubmissions)
      .where(inArray(ugcSubmissions.weekN, WEEKS.map(w => w.n)))
      .orderBy(desc(ugcSubmissions.createdAt))
      .limit(80);
    for (const row of rows) {
      const list = recentByWeek[row.weekN] ?? [];
      if (list.length < 3) {
        list.push({ id: row.id, authorName: row.authorName, body: row.body, reviewCount: row.reviewCount });
        recentByWeek[row.weekN] = list;
      }
    }
  } catch (error) {
    console.error("Failed to load recent submissions:", error);
  }

  return json({ user, weeks: WEEKS, recentByWeek });
}

export default function WeeksIndex() {
  const { user, weeks, recentByWeek } = useLoaderData<typeof loader>();
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
          eyebrow="8-week cohort"
          title="Syllabus and weekly outcomes"
          description="Each week has one outcome and one deliverable. Show up, ship the deliverable, and the cohort compounds."
          back={{ href: '/', label: 'Home' }}
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
          {weeks.length === 0 ? (
            <EmptyState icon="🎓" title="No syllabus yet" description="Build the 8-week arc and weeks will appear here." hint="outline → weeks" />
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {weeks.map(week => {
                const recent = recentByWeek[week.n] ?? [];
                return (
                  <Link
                    key={week.n}
                    to={`/weeks/${week.n}`}
                    className={`group flex flex-col gap-3 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${week.n === 3 ? theme.assistantShell : theme.metricShell}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}>
                        W{week.n}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Outcome</span>
                    </div>
                    <h2 className="text-base font-semibold tracking-tight sm:text-lg">{week.title}</h2>
                    <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{week.outcome}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Deliverable · {week.deliverable}</p>
                    {recent.length > 0 ? (
                      <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-200/50 pt-2 dark:border-slate-700/50">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-50">Recent submissions</span>
                        {recent.map(s => (
                          <p key={s.id} className="line-clamp-2 text-[12px] leading-relaxed opacity-80">
                            <span className="font-semibold">{s.authorName}</span>: {s.body}
                            {s.reviewCount > 0 ? <span className="opacity-50"> · {s.reviewCount} reviews</span> : null}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
