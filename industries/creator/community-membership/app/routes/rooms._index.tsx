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
  { title: `Rooms · ${APP_TITLE}` },
  { name: 'description', content: 'Active member rooms for the community.' },
];

const ROOMS = [
  { id: 'room-week-42', title: 'Week 42 cohort room', when: 'Tue 19:00', members: 64, status: 'Live this week', topic: 'Shipping the next drop without burning out' },
  { id: 'room-amas', title: 'Monthly AMA', when: 'First Friday', members: 88, status: 'Open', topic: 'Submit your question by Thursday' },
  { id: 'room-craft', title: 'Craft crit circle', when: 'Wednesdays', members: 22, status: 'Open', topic: 'Small group, weekly critique' },
  { id: 'room-orientation', title: 'New member orientation', when: 'Mondays', members: 12, status: 'Open', topic: 'Onboarding pass for new joiners' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, rooms: ROOMS });
}

export default function RoomsIndex() {
  const { user, rooms } = useLoaderData<typeof loader>();
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
          eyebrow="Member rooms"
          title="Where the club meets"
          description="Each room has a rhythm, a topic, and a host. Show up the way you can — recordings live in the same place."
          back={{ href: '/', label: 'Home' }}
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
          {rooms.length === 0 ? (
            <EmptyState icon="🌙" title="No rooms yet" description="Schedule your first room and members will see it here." hint="calendar → room" />
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {rooms.map(room => (
                <Link
                  key={room.id}
                  to={`/rooms/${room.id}`}
                  className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base font-semibold tracking-tight sm:text-lg">{room.title}</h2>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                      {room.status}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{room.topic}</p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] opacity-70">
                    <span>{room.when}</span>
                    <span className="opacity-30">/</span>
                    <span>{room.members} members</span>
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
