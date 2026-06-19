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
  { title: `Requests · ${APP_TITLE}` },
  { name: 'description', content: 'Open service requests for the client portal.' },
];

const REQUESTS = [
  { id: 'req-onboarding', title: 'Quarterly onboarding pass', client: 'Northwind', status: 'In progress', updated: '2h ago', summary: 'Schedule onboarding, share workspace access, send welcome doc.' },
  { id: 'req-renewal', title: 'Annual renewal paperwork', client: 'Heliograph', status: 'Awaiting client', updated: 'Today', summary: 'Send contract v2, await countersign, file in portal.' },
  { id: 'req-bug-triage', title: 'Triage last week reports', client: 'Vellum Co.', status: 'Triaging', updated: 'Yesterday', summary: 'Three reports linked to the same export endpoint.' },
  { id: 'req-migration', title: 'Migrate from legacy CRM', client: 'Forge Studio', status: 'Scoped', updated: '3d ago', summary: 'Migration scope ready. Awaiting kickoff window.' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, requests: REQUESTS });
}

export default function RequestsIndex() {
  const { user, requests } = useLoaderData<typeof loader>();
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
          eyebrow="Service desk"
          title="Open requests"
          description="Every client request on one quiet board. Status changes propagate to the client view without extra steps."
          back={{ href: '/', label: 'Home' }}
          trailing={
            <Link
              to="/requests/new"
              className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${theme.primaryButton}`}
            >
              New request
            </Link>
          }
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
          {requests.length === 0 ? (
            <EmptyState icon="📋" title="No requests" description="New requests show up here once clients open tickets." hint="ticket → request" />
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {requests.map(req => (
                <Link
                  key={req.id}
                  to={`/requests/${req.id}`}
                  className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold tracking-tight sm:text-lg">{req.title}</h2>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{req.summary}</p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] opacity-70">
                    <span>{req.client}</span>
                    <span className="opacity-30">/</span>
                    <span>Updated {req.updated}</span>
                    <span className="ml-auto opacity-60 transition group-hover:opacity-100">Open →</span>
                  </div>
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
