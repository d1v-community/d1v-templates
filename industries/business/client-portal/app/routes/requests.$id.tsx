import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { desc, eq } from 'drizzle-orm';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { CommentThread, type CommentEntry } from '~/components/ugc/CommentThread';
import { db } from '~/db/db.server';
import { ugcRequestMessages } from '~/db/schema';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = ({ params }) => [
  { title: `Request · ${params.id ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single client request detail.' },
];

const DETAILS: Record<string, { title: string; client: string; status: string; steps: Array<{ label: string; status: 'done' | 'active' | 'queued' }>; notes: string[] }> = {
  'req-onboarding': {
    title: 'Quarterly onboarding pass', client: 'Northwind', status: 'In progress',
    steps: [
      { label: 'Intake call recorded', status: 'done' },
      { label: 'Workspace provisioned', status: 'done' },
      { label: 'Send welcome doc', status: 'active' },
      { label: 'Schedule kickoff', status: 'queued' },
    ],
    notes: ['Client asked to push kickoff one day to align with finance close.'],
  },
  'req-renewal': {
    title: 'Annual renewal paperwork', client: 'Heliograph', status: 'Awaiting client',
    steps: [
      { label: 'Contract v2 drafted', status: 'done' },
      { label: 'Sent to client', status: 'active' },
      { label: 'Countersign received', status: 'queued' },
      { label: 'Filed in portal', status: 'queued' },
    ],
    notes: ['Final pricing locked. Awaiting legal review on the client side.'],
  },
  'req-bug-triage': {
    title: 'Triage last week reports', client: 'Vellum Co.', status: 'Triaging',
    steps: [
      { label: 'Reports collected', status: 'done' },
      { label: 'Linked to export endpoint', status: 'active' },
      { label: 'Owner assigned', status: 'queued' },
    ],
    notes: ['Three reports mention "stuck at 0%". Likely a single root cause.'],
  },
  'req-migration': {
    title: 'Migrate from legacy CRM', client: 'Forge Studio', status: 'Scoped',
    steps: [
      { label: 'Source audit done', status: 'done' },
      { label: 'Mapping approved', status: 'done' },
      { label: 'Kickoff window', status: 'active' },
      { label: 'Dry run', status: 'queued' },
      { label: 'Cutover', status: 'queued' },
    ],
    notes: ['Two-week window agreed. Engineer pair assigned.'],
  },
};

function getDetail(id: string) {
  return DETAILS[id] ?? { title: 'Request', client: 'Client', status: 'Open', steps: [{ label: 'Awaiting detail', status: 'active' as const }], notes: [] };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? 'unknown';
  const detail = getDetail(id);

  let messages: CommentEntry[] = [];
  try {
    const rows = await db
      .select()
      .from(ugcRequestMessages)
      .where(eq(ugcRequestMessages.requestId, id))
      .orderBy(desc(ugcRequestMessages.createdAt))
      .limit(50);
    messages = rows
      .map(row => ({
        id: row.id,
        authorName: row.authorName,
        authorInitials: row.authorInitials,
        body: row.body,
        createdAt:
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : new Date(row.createdAt as unknown as string).toISOString(),
      }))
      .reverse();
  } catch (error) {
    console.error("Failed to load request messages:", error);
  }

  return json({ user, id, ...detail, messages });
}

export default function RequestDetail() {
  const { user, id, title, client, status, steps, notes, messages } = useLoaderData<typeof loader>();
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
          eyebrow={`Request · ${id}`}
          title={title}
          description={`${client} · ${status}`}
          back={{ href: '/requests', label: 'All requests' }}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-3">
              {steps.map((step, i) => (
                <article
                  key={step.label}
                  className={`flex items-start gap-3 rounded-2xl p-4 ${i === 0 ? theme.assistantShell : theme.listItemShell}`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${
                      step.status === 'done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200' :
                      step.status === 'active' ? theme.eyebrow :
                      'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {step.status === 'done' ? '✓' : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed sm:text-[15px]">{step.label}</span>
                </article>
              ))}
            </div>
          </div>

          {notes.length > 0 ? (
            <div className={`rounded-2xl p-5 ${theme.metricShell}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Notes</p>
              <ul className="mt-2 flex flex-col gap-2">
                {notes.map((note, i) => (
                  <li key={i} className="text-sm leading-relaxed">{note}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Message thread</p>
              <span className="text-[11px] uppercase tracking-[0.2em] opacity-50">{messages.length} message{messages.length === 1 ? "" : "s"}</span>
            </div>
            <CommentThread
              comments={messages}
              action="/api/ugc/message"
              hidden={{ requestId: id }}
              placeholder="Reply to the team…"
            />
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/requests" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> All requests
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
