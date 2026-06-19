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
  { title: `Issues · ${APP_TITLE}` },
  { name: 'description', content: 'Newsletter archive.' },
];

const ISSUES = [
  { number: '042', title: 'The quiet compounding edition', date: 'Oct 21, 2026', summary: 'Small systems beat large intentions. The four habits I run on autopilot.', minutes: 7 },
  { number: '041', title: 'On paying for software you outgrow', date: 'Oct 14, 2026', summary: 'A simple rule for when to upgrade, downgrade, or churn.', minutes: 6 },
  { number: '040', title: 'The renewal problem', date: 'Oct 7, 2026', summary: 'Why most renewals slip and what to do about it in week 8, not week 12.', minutes: 8 },
  { number: '039', title: 'Ship before you polish', date: 'Sep 30, 2026', summary: 'The minimum amount of polish required to learn from the next 100 readers.', minutes: 5 },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, issues: ISSUES });
}

export default function IssuesIndex() {
  const { user, issues } = useLoaderData<typeof loader>();
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
          eyebrow="Newsletter archive"
          title="Recent issues"
          description="Every issue lands in your inbox and stays in the archive. Members see the full back catalog; non-members see the lede."
          back={{ href: '/', label: 'Home' }}
        />

        <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 lg:px-10 pb-16">
          {issues.length === 0 ? (
            <EmptyState icon="📰" title="No issues yet" description="Publish your first issue and the archive will appear here." hint="draft → publish → archive" />
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {issues.map(issue => (
                <Link
                  key={issue.number}
                  to={`/issues/${issue.number}`}
                  className={`group grid gap-3 rounded-2xl p-5 sm:grid-cols-[120px_1fr_auto] sm:items-center transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
                >
                  <div className="flex flex-col">
                    <span className={`text-3xl font-semibold tracking-[-0.05em] ${theme.metricValue}`}>#{issue.number}</span>
                    <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{issue.date}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold tracking-tight sm:text-lg">{issue.title}</h2>
                    <p className={`mt-1 text-sm leading-relaxed ${theme.sectionText}`}>{issue.summary}</p>
                  </div>
                  <span className="self-start whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 transition group-hover:opacity-100">
                    {issue.minutes} min read →
                  </span>
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
