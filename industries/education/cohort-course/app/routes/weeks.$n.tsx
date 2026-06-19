import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { desc, eq } from 'drizzle-orm';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { db } from '~/db/db.server';
import { ugcSubmissions } from '~/db/schema';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = ({ params }) => [
  { title: `Week ${params.n ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single week lesson view.' },
];

const WEEKS: Record<string, { title: string; outcome: string; deliverable: string; lessons: string[] }> = {
  '1': { title: 'Why now', outcome: 'Name the constraint and the bet', deliverable: 'One-page problem framing', lessons: ['The constraint you cannot negotiate', 'A bet you can defend in 90 seconds', 'The first 10 buyers you can name'] },
  '2': { title: 'Audience and offer', outcome: 'Pick the buyer and the shape of value', deliverable: 'Offer canvas', lessons: ['The audience you can actually reach', 'The offer they would pay for', 'The shape of value (one-time / recurring / cohort)'] },
  '3': { title: 'Build the v0', outcome: 'Ship the smallest thing that proves the bet', deliverable: 'V0 demo + debrief', lessons: ['Cut the feature list in half', 'Build the smallest thing that proves the bet', 'Run the demo and capture objections'] },
  '4': { title: 'Pricing and packaging', outcome: 'Set the price with intent', deliverable: 'Pricing card + rationale', lessons: ['Anchor on alternatives', 'Pick the recurring rail', 'Write the rationale in one paragraph'] },
  '5': { title: 'First 10 buyers', outcome: 'Hand-sell the first cohort', deliverable: 'Outreach log', lessons: ['Hand-sell 10', 'Capture the top 3 objections', 'Convert 3 to paid'] },
  '6': { title: 'Operations and onboarding', outcome: 'Move buyers into the product without a queue', deliverable: 'Onboarding flow', lessons: ['Map the first session', 'Remove the manual steps', 'Add a kickoff call'] },
  '7': { title: 'Retention loops', outcome: 'Make the second purchase obvious', deliverable: 'Renewal script', lessons: ['Find the renewal trigger', 'Write the renewal note', 'Schedule the second touch'] },
  '8': { title: 'Scale or stop', outcome: 'Decide the next 90 days with evidence', deliverable: 'Decision memo', lessons: ['Pull the data', 'Write the memo', 'Decide: scale, hold, or stop'] },
};

function getWeek(n: string) {
  return WEEKS[n] ?? { title: 'Week', outcome: '—', deliverable: '—', lessons: ['Publish the syllabus to populate this week.'] };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const n = params.n ?? '0';
  const week = getWeek(n);
  const weekN = Number.parseInt(n, 10);

  let submissions: Array<{
    id: string;
    authorName: string;
    authorInitials: string;
    body: string;
    reviewCount: number;
    createdAt: string;
  }> = [];

  if (Number.isFinite(weekN) && weekN > 0) {
    try {
      const rows = await db
        .select()
        .from(ugcSubmissions)
        .where(eq(ugcSubmissions.weekN, weekN))
        .orderBy(desc(ugcSubmissions.createdAt))
        .limit(20);
      submissions = rows.map(row => ({
        id: row.id,
        authorName: row.authorName,
        authorInitials: row.authorInitials,
        body: row.body,
        reviewCount: row.reviewCount,
        createdAt:
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : new Date(row.createdAt as unknown as string).toISOString(),
      }));
    } catch (error) {
      console.error("Failed to load week submissions:", error);
    }
  }

  return json({ user, n, ...week, submissions });
}

export default function WeekDetail() {
  const { user, n, title, outcome, deliverable, lessons, submissions } = useLoaderData<typeof loader>();
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
          eyebrow={`Week ${n} · ${deliverable}`}
          title={title}
          description={outcome}
          back={{ href: '/syllabus', label: 'Syllabus' }}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-2">
              {lessons.map((line, i) => (
                <article key={line} className={`flex items-start gap-3 rounded-2xl p-4 ${i === 0 ? theme.assistantShell : theme.listItemShell}`}>
                  <span className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed sm:text-[15px]">{line}</span>
                </article>
              ))}
            </div>
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Submissions</p>
              <Link
                to={`/weeks/${n}/submit`}
                className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${theme.primaryButton}`}
              >
                Submit deliverable
              </Link>
            </div>
            {submissions.length === 0 ? (
              <p className="text-sm leading-relaxed opacity-60">No submissions yet for this week.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {submissions.map(s => (
                  <li key={s.id} className={`flex flex-col gap-1.5 rounded-2xl p-4 ${theme.listItemShell}`}>
                    <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.2em] opacity-70">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                        >
                          {s.authorInitials}
                        </span>
                        <span className="text-xs font-semibold tracking-tight normal-case opacity-100">{s.authorName}</span>
                      </span>
                      <span>{s.reviewCount} review{s.reviewCount === 1 ? "" : "s"}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed line-clamp-3">{s.body}</p>
                    <div className="mt-1 flex justify-end">
                      <Link
                        to={`/submissions/${s.id}/review`}
                        className={`text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70 transition hover:opacity-100 ${theme.subEyebrow}`}
                      >
                        Review →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/syllabus" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> Syllabus
            </Link>
            <Link to="/pricing" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Open pricing
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
