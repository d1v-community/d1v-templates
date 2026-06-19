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
  { title: `Room · ${params.id ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single member room detail view.' },
];

const DETAILS: Record<string, { title: string; when: string; topic: string; agenda: string[]; host: string }> = {
  'room-week-42': { title: 'Week 42 cohort room', when: 'Tue 19:00', topic: 'Shipping the next drop without burning out', host: 'Avery', agenda: ['Quick share · what shipped this week', 'Topic deep dive', 'Pair-review in small groups', 'Open mic'] },
  'room-amas': { title: 'Monthly AMA', when: 'First Friday', topic: 'Submit your question by Thursday', host: 'Mika', agenda: ['Top 5 questions from members', 'Wildcard round', 'Closing note'] },
  'room-craft': { title: 'Craft crit circle', when: 'Wednesdays', topic: 'Small group, weekly critique', host: 'Ren', agenda: ['Two pieces per session', 'Tight feedback rules', 'Pair swaps monthly'] },
  'room-orientation': { title: 'New member orientation', when: 'Mondays', topic: 'Onboarding pass for new joiners', host: 'Sage', agenda: ['How the club works', 'Find your first room', 'Office hours'] },
};

function getDetail(id: string) {
  return DETAILS[id] ?? { title: 'Room', when: '—', topic: '—', host: 'Host', agenda: ['Add agenda items once the room is scheduled.'] };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? 'unknown';
  return json({ user, id, ...getDetail(id) });
}

export default function RoomDetail() {
  const { user, id, title, when, topic, host, agenda } = useLoaderData<typeof loader>();
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
          eyebrow={`Room · ${id}`}
          title={title}
          description={`${when} · hosted by ${host} · ${topic}`}
          back={{ href: '/rooms', label: 'All rooms' }}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-2">
              {agenda.map((line, i) => (
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
            <Link to="/rooms" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> All rooms
            </Link>
            <Link to="/pricing" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Enter the room
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
