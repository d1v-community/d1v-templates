import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import type { AppHeaderUser } from '~/components/AppHeader';
import { requireUserOrRedirect } from '~/lib/auth-flow';

export const meta: MetaFunction = ({ params }) => [
  { title: `Thread · ${params.id ?? 'detail'} · ${APP_TITLE}` },
  { name: 'description', content: 'Single conversation thread detail view.' },
];

interface ThreadMessage {
  id: string;
  role: 'user' | 'assistant' | 'ops';
  author: string;
  body: string;
  meta: string;
}

const SEED_DETAIL: Record<string, { title: string; owner: string; status: string; messages: ThreadMessage[] }> = {
  'thread-onboarding-runbook': {
    title: 'Onboarding runbook for new operator',
    owner: 'Avery', status: 'In review',
    messages: [
      { id: 'm1', role: 'user', author: 'Operator', body: 'Need a 5-prompt runbook for new paid members.', meta: 'Day 1 · 09:14' },
      { id: 'm2', role: 'assistant', author: 'SignalDesk Copilot', body: 'Drafted 5 prompts: scope → seats → credits → escalation → renewal.', meta: 'Day 1 · 09:14' },
      { id: 'm3', role: 'ops', author: 'Avery', body: 'Hold on prompt 3. We need to clarify the credit burn before renewal.', meta: 'Day 1 · 11:02' },
      { id: 'm4', role: 'assistant', author: 'SignalDesk Copilot', body: 'Updated prompt 3 with a credit-burn explainer.', meta: 'Day 1 · 11:04' },
    ],
  },
  'thread-credit-recharge': {
    title: 'Credit recharge for launch campaign',
    owner: 'Mika', status: 'Awaiting response',
    messages: [
      { id: 'm1', role: 'user', author: 'Mika', body: 'We launched the campaign. 4 seats burned through their credits.', meta: 'Yesterday · 18:21' },
      { id: 'm2', role: 'assistant', author: 'SignalDesk Copilot', body: 'Topped up 4k credits, flagged seat 12 to upgrade.', meta: 'Yesterday · 18:22' },
    ],
  },
  'thread-tool-handoff': {
    title: 'Tool handoff to human support',
    owner: 'Ren', status: 'Escalated',
    messages: [
      { id: 'm1', role: 'user', author: 'Ren', body: 'Three retries later the assistant is still not sure. Hand to ops.', meta: 'Yesterday · 16:00' },
      { id: 'm2', role: 'assistant', author: 'SignalDesk Copilot', body: 'Acknowledged. Routing to ops queue #42.', meta: 'Yesterday · 16:00' },
    ],
  },
  'thread-week-recap': {
    title: 'Weekly recap and renewal prompt',
    owner: 'Avery', status: 'Drafted',
    messages: [
      { id: 'm1', role: 'user', author: 'Avery', body: 'Pull the week-3 metrics and draft the renewal email for cohort B.', meta: '2d ago · 10:00' },
      { id: 'm2', role: 'assistant', author: 'SignalDesk Copilot', body: 'Drafted. 12 of 18 seats in cohort B are still active.', meta: '2d ago · 10:01' },
    ],
  },
};

function getDetail(id: string) {
  return SEED_DETAIL[id] ?? {
    title: 'Thread detail', owner: 'Operator', status: 'Open',
    messages: [{ id: 'm1', role: 'user', author: 'Operator', body: 'Open this thread once the assistant is wired in.', meta: '—' }],
  };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? 'unknown';
  return json({ user, id, ...getDetail(id) });
}

export default function ThreadDetail() {
  const { user, id, title, owner, status, messages } = useLoaderData<typeof loader>();
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
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Thread · ${id}`}
        title={title}
        description={`Owner ${owner} · ${status}`}
        back={{ href: '/console/threads', label: 'All threads' }}
      />
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
        <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-60" />
        <div className="relative flex flex-col gap-3">
          {messages.map(message => (
            <article
              key={message.id}
              className={`flex flex-col gap-1.5 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === 'user'
                  ? theme.assistantUserBubble
                  : message.role === 'ops'
                    ? theme.listItemShell
                    : theme.assistantShell
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
                <span>{message.author}</span>
                <span>{message.meta}</span>
              </div>
              <p className="text-[14px] sm:text-[15px]">{message.body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/console/threads" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
          <span aria-hidden>←</span> All threads
        </Link>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">
          Logged in as {effectiveUser?.email ?? effectiveUser?.username ?? 'guest'}
        </span>
      </div>
    </div>
  );
}
