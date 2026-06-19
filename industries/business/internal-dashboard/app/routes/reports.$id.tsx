import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = ({ params }) => [
  { title: `Report · ${params.id ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single report detail view.' },
];

const DETAILS: Record<string, { title: string; period: string; sections: Array<{ heading: string; bullets: string[] }> }> = {
  'weekly-pipeline': {
    title: 'Weekly pipeline review',
    period: 'Week 42 · 2026',
    sections: [
      { heading: 'What moved', bullets: ['Renewals closed +18% week over week', 'New logo deals flat to last week', 'Three deals slipped to W43 with verbal commit'] },
      { heading: 'Where to focus', bullets: ['Late-stage deals need exec sponsorship', 'Mid-market requires a faster security review path'] },
    ],
  },
  'queue-load': {
    title: 'Queue load by team',
    period: 'Week 42 · 2026',
    sections: [
      { heading: 'By team', bullets: ['Support -14%', 'Engineering on-call -22%', 'Billing +3 (renewal paperwork)'] },
    ],
  },
  'incident-postmortem': {
    title: 'On-call postmortem (W42)',
    period: 'Week 42 · 2026',
    sections: [
      { heading: 'Root cause', bullets: ['Cache invalidation skipped after deploy script', 'No alert until customer-visible error rate climbed'] },
      { heading: 'Action items', bullets: ['Add a deploy step check', 'Add a synthetic monitor to catch stale cache'] },
    ],
  },
  'forecast-q4': {
    title: 'Q4 forecast model',
    period: 'Q4 · 2026',
    sections: [
      { heading: 'Scenarios', bullets: ['Base: $1.42M', 'Upside: $1.61M (renewals +1 logo)', 'Downside: $1.18M (one major loss)'] },
    ],
  },
};

function getDetail(id: string) {
  return DETAILS[id] ?? { title: 'Report', period: '—', sections: [{ heading: 'Awaiting data', bullets: ['Connect the data warehouse to populate this report.'] }] };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? 'unknown';
  return json({ user, id, ...getDetail(id) });
}

export default function ReportDetail() {
  const { user, id, title, period, sections } = useLoaderData<typeof loader>();
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
          eyebrow={`Report · ${period}`}
          title={title}
          description={id}
          back={{ href: '/reports', label: 'All reports' }}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-5">
              {sections.map((section, i) => (
                <article key={section.heading} className={`flex flex-col gap-2 rounded-2xl p-4 ${i === 0 ? theme.assistantShell : theme.listItemShell}`}>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">{section.heading}</h2>
                  <ul className="flex flex-col gap-1.5">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="text-sm leading-relaxed sm:text-[15px]">· {b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/reports" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> All reports
            </Link>
            <Link to="/dashboard" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
