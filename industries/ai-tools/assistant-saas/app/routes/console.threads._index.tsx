import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { EmptyState } from '~/components/sections/EmptyState';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { SITE_CONFIG } from '~/constants/site';
import type { AppHeaderUser } from '~/components/AppHeader';
import { requireUserOrRedirect } from '~/lib/auth-flow';

export const meta: MetaFunction = () => [
  { title: `Threads · ${SITE_CONFIG.appTitle}` },
  { name: 'description', content: 'Active conversation threads for paid workspace members.' },
];

const SEED_THREADS = [
  { id: 'thread-onboarding-runbook', title: 'Onboarding runbook for new operator', owner: 'Avery', status: 'In review', updated: '2h ago', summary: 'Sequenced the 5 first-run prompts and assigned a credit budget.' },
  { id: 'thread-credit-recharge', title: 'Credit recharge for launch campaign', owner: 'Mika', status: 'Awaiting response', updated: '5h ago', summary: 'Topped up 4k credits and flagged seat 12 to upgrade to Pro.' },
  { id: 'thread-tool-handoff', title: 'Tool handoff to human support', owner: 'Ren', status: 'Escalated', updated: 'Yesterday', summary: 'Edge case the assistant should hand back to ops after the third retry.' },
  { id: 'thread-week-recap', title: 'Weekly recap and renewal prompt', owner: 'Avery', status: 'Drafted', updated: '2d ago', summary: 'Pulled thread metrics, drafted the renewal email for cohort B.' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, threads: SEED_THREADS });
}

export default function ThreadsIndex() {
  const { user, threads } = useLoaderData<typeof loader>();
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`text-sm ${theme.body}`}>Signed in as {effectiveUser?.email ?? effectiveUser?.username ?? 'guest'}</p>
        <button
          type="button"
          onClick={handleLogout}
          className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}
        >
          Logout
        </button>
      </div>

      {threads.length === 0 ? (
        <EmptyState icon="💬" title="No threads yet" description="Paid workspaces accumulate threads once the assistant goes live." hint="Connect events → threads" />
      ) : (
        <div className="grid gap-3">
          {threads.map(thread => (
            <Link
              key={thread.id}
              to={`/console/threads/${thread.id}`}
              className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold tracking-tight sm:text-lg">{thread.title}</h2>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                  {thread.status}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{thread.summary}</p>
              <div className="mt-1 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] opacity-70">
                <span>Owner · {thread.owner}</span>
                <span className="opacity-30">/</span>
                <span>Updated {thread.updated}</span>
                <span className="ml-auto opacity-60 transition group-hover:opacity-100">Open →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
