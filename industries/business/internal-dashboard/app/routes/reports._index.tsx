import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { EmptyState } from '~/components/sections/EmptyState';
import { PageHeader } from '~/components/sections/PageHeader';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = () => [
  { title: `Reports · ${APP_TITLE}` },
  { name: 'description', content: 'Operator reports archive.' },
];

const REPORTS = [
  { id: 'weekly-pipeline', title: 'Weekly pipeline review', period: 'Week 42 · 2026', summary: 'Pipeline closed +18% on renewals. New logo deals flat.' },
  { id: 'queue-load', title: 'Queue load by team', period: 'Week 42 · 2026', summary: 'Support queue normalized after the export endpoint fix.' },
  { id: 'incident-postmortem', title: 'On-call postmortem (W42)', period: 'Week 42 · 2026', summary: 'Single root cause: cache invalidation skipped after deploy.' },
  { id: 'forecast-q4', title: 'Q4 forecast model', period: 'Q4 · 2026', summary: 'Base / upside / downside scenarios with confidence ranges.' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, reports: REPORTS });
}

export default function ReportsIndex() {
  const { user, reports } = useLoaderData<typeof loader>();
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
          eyebrow="Reports"
          title="Reports archive"
          description="Each report ties to a period and an owner. Drill in for assumptions, charts, and decisions logged."
          back={{ href: '/dashboard', label: 'Dashboard' }}
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
          {reports.length === 0 ? (
            <EmptyState icon="📊" title="No reports yet" description="Connect the data warehouse to surface reports here." hint="warehouse → reports" />
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {reports.map(report => (
                <Link
                  key={report.id}
                  to={`/reports/${report.id}`}
                  className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{report.period}</p>
                  <h2 className="text-base font-semibold tracking-tight sm:text-lg">{report.title}</h2>
                  <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{report.summary}</p>
                  <span className="mt-1 self-end text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 transition group-hover:opacity-100">Open →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
