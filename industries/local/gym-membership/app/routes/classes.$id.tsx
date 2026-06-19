import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { desc, eq } from 'drizzle-orm';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { ReviewStars } from '~/components/ugc/ReviewStars';
import { db } from '~/db/db.server';
import { ugcCheckins } from '~/db/schema';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = ({ params }) => [
  { title: `Class · ${params.id ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single class detail view.' },
];

const CLASSES: Record<string, { name: string; when: string; coach: string; spots: number; level: string; notes: string[] }> = {
  strength: { name: 'Strength 101', when: 'Mon · 18:00', coach: 'Avery', spots: 6, level: 'Beginner', notes: ['Compound lifts at 70% effort', 'Coached technique for every set', 'Cool-down stretch'] },
  mobility: { name: 'Mobility flow', when: 'Tue · 07:30', coach: 'Ren', spots: 12, level: 'All levels', notes: ['Hip and shoulder flow', 'Breathwork primer', 'Cooldown meditation'] },
  hiit: { name: 'HIIT 30', when: 'Wed · 19:00', coach: 'Mika', spots: 4, level: 'Intermediate', notes: ['30 sec on / 30 sec off', '4 stations × 4 rounds', 'Cool-down stretch'] },
  pilates: { name: 'Reformer pilates', when: 'Thu · 12:00', coach: 'Sage', spots: 8, level: 'All levels', notes: ['Reformer flow', 'Core focus', 'Slow stretch'] },
  'run-club': { name: 'Run club', when: 'Sat · 09:00', coach: 'Avery', spots: 20, level: 'All levels', notes: ['5k loop', 'Two pace groups', 'Coffee after'] },
};

function getClass(id: string) {
  return CLASSES[id] ?? { name: 'Class', when: '—', coach: '—', spots: 0, level: '—', notes: ['Schedule a class to populate this view.'] };
}

interface CheckinRow {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  body: string;
  createdAt: string;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? 'unknown';

  let checkins: CheckinRow[] = [];
  try {
    const rows = await db
      .select()
      .from(ugcCheckins)
      .where(eq(ugcCheckins.classId, id))
      .orderBy(desc(ugcCheckins.createdAt));
    checkins = rows.map(r => ({
      id: r.id,
      authorName: r.authorName,
      authorInitials: r.authorInitials,
      rating: r.rating,
      body: r.body,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt ?? ""),
    }));
  } catch (error) {
    console.error("Failed to load checkins:", error);
  }

  return json({ user, id, checkins, ...getClass(id) });
}

export default function ClassDetail() {
  const { user, id, name, when, coach, spots, level, notes, checkins } = useLoaderData<typeof loader>();
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
          eyebrow={`Class · ${id} · ${level}`}
          title={name}
          description={`${when} · coached by ${coach} · ${spots} spots`}
          back={{ href: '/plans', label: 'Plans & classes' }}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-2">
              {notes.map((line, i) => (
                <article key={line} className={`flex items-start gap-3 rounded-2xl p-4 ${i === 0 ? theme.assistantShell : theme.listItemShell}`}>
                  <span className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed sm:text-[15px]">{line}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/plans" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> Plans & classes
            </Link>
            <Link to="/pricing" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Reserve a spot
            </Link>
          </div>

          <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <header>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">Check in</h2>
              <p className="mt-1 text-xs opacity-60">Tell other members how the class felt.</p>
            </header>
            <form method="post" action="/api/ugc/class-checkin" className="flex flex-col gap-3">
              <input type="hidden" name="classId" value={id} />
              <ReviewStars value={0} action="/api/ugc/class-checkin" name="rating" size="lg" />
              <textarea
                name="body"
                required
                maxLength={1000}
                rows={3}
                placeholder="How was the session?"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme.assistantInput}`}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold transition ${theme.primaryButton}`}
                >
                  Post check-in
                </button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
              Recent check-ins
            </h2>
            {checkins.length === 0 ? (
              <p className="text-sm opacity-60">No check-ins yet — be the first.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {checkins.map(c => (
                  <li key={c.id} className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.metricShell}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                        >
                          {c.authorInitials}
                        </span>
                        <p className="text-sm font-semibold tracking-tight">{c.authorName}</p>
                      </div>
                      <ReviewStars value={c.rating} size="sm" />
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
