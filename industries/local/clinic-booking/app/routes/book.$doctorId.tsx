import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { asc, eq, and } from 'drizzle-orm';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { CommentThread, type CommentEntry } from '~/components/ugc/CommentThread';
import { ReviewStars } from '~/components/ugc/ReviewStars';
import { db } from '~/db/db.server';
import { ugcMessages, ugcReviews } from '~/db/schema';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = ({ params }) => [
  { title: `Confirm · ${params.doctorId ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Confirm a booking.' },
];

const DOCTORS: Record<string, { name: string; specialty: string }> = {
  'dr-okafor': { name: 'Dr. Okafor', specialty: 'General medicine' },
  'dr-lin': { name: 'Dr. Lin', specialty: 'Pediatrics' },
  'dr-park': { name: 'Dr. Park', specialty: 'Dermatology' },
  'dr-singh': { name: 'Dr. Singh', specialty: 'Family care' },
};

function getDoctor(id: string) {
  return DOCTORS[id] ?? { name: 'Provider', specialty: '—' };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.doctorId ?? 'unknown';

  let messages: CommentEntry[] = [];
  let avgRating = 0;
  let reviewCount = 0;
  try {
    const msgRows = await db
      .select()
      .from(ugcMessages)
      .where(eq(ugcMessages.doctorId, id))
      .orderBy(asc(ugcMessages.createdAt));
    messages = msgRows.map(m => ({
      id: m.id,
      authorName: m.authorName,
      authorInitials: m.authorInitials,
      body: m.body,
      createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt ?? ""),
    }));

    const reviewRows = await db
      .select()
      .from(ugcReviews)
      .where(and(eq(ugcReviews.contextKind, "doctor"), eq(ugcReviews.contextSlug, id)));
    reviewCount = reviewRows.length;
    if (reviewCount > 0) {
      avgRating = reviewRows.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
    }
  } catch (error) {
    console.error("Failed to load booking extras:", error);
  }

  return json({ user, id, messages, avgRating, reviewCount, ...getDoctor(id) });
}

export default function ConfirmBooking() {
  const { user, id, name, specialty, messages, avgRating, reviewCount } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);
  const [searchParams] = useSearchParams();
  const slot = searchParams.get('slot') ?? '—';

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
          eyebrow={`Confirm · ${id}`}
          title={name}
          description={`${specialty} · ${slot}`}
          back={{ href: '/book', label: 'Pick a slot' }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className={`rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <h2 className="text-lg font-semibold tracking-tight">Booking summary</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className={`rounded-2xl p-4 ${theme.metricShell}`}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Provider</dt>
                <dd className="mt-1 text-sm font-semibold">{name}</dd>
              </div>
              <div className={`rounded-2xl p-4 ${theme.metricShell}`}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Specialty</dt>
                <dd className="mt-1 text-sm font-semibold">{specialty}</dd>
              </div>
              <div className={`rounded-2xl p-4 ${theme.metricShell}`}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Slot</dt>
                <dd className="mt-1 text-sm font-semibold">{slot}</dd>
              </div>
              <div className={`rounded-2xl p-4 ${theme.metricShell}`}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Account</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {effectiveUser?.email ?? effectiveUser?.displayName ?? 'Guest'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/book" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> Pick another slot
            </Link>
            <Link to="/appointments" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Confirm booking
            </Link>
          </div>

          <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">Rate this provider</h2>
                <p className="mt-1 text-xs opacity-60">{reviewCount} {reviewCount === 1 ? "review" : "reviews"} · share your experience</p>
              </div>
              {reviewCount > 0 ? (
                <ReviewStars value={Math.round(avgRating)} showValue size="md" />
              ) : null}
            </header>
            <ReviewStars
              value={0}
              action="/api/ugc/review-doctor"
              name="rating"
              size="lg"
            />
            <form method="post" action="/api/ugc/review-doctor" className="flex flex-col gap-2">
              <input type="hidden" name="doctorId" value={id} />
              <textarea
                name="body"
                required
                maxLength={1000}
                rows={3}
                placeholder="Tell other patients how it went…"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme.assistantInput}`}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold transition ${theme.primaryButton}`}
                >
                  Post review
                </button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
              Messages with {name}
            </h2>
            <CommentThread
              comments={messages}
              action="/api/ugc/message-doctor"
              hidden={{ doctorId: id }}
              placeholder={`Message ${name}…`}
            />
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
