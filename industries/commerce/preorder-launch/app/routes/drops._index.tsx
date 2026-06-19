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
  { title: `Drops · ${APP_TITLE}` },
  { name: 'description', content: 'Timed release drops and tier ladder.' },
];

const DROPS = [
  { slug: 'first-drop', title: 'First drop — Issue 1', tier: 1, status: 'Live', preorders: 318, when: 'Now' },
  { slug: 'volume-2', title: 'Volume 2 — Issue 2', tier: 2, status: 'Pre-launch', preorders: 96, when: 'In 7d' },
  { slug: 'volume-3', title: 'Volume 3 — Issue 3', tier: 3, status: 'Announced', preorders: 0, when: 'In 21d' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, drops: DROPS });
}

export default function DropsIndex() {
  const { user, drops } = useLoaderData<typeof loader>();
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
          eyebrow="Drop calendar"
          title="Tier ladder for the next release"
          description="Three tiers unlock in sequence. The first tier is the cheapest; the last tier is the most complete. Lock in early without guessing."
          back={{ href: '/', label: 'Home' }}
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
          {drops.length === 0 ? (
            <EmptyState icon="🚀" title="No drops scheduled" description="Schedule the next drop and tiers will appear here." hint="calendar → drop" />
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
              {drops.map(drop => (
                <Link
                  key={drop.slug}
                  to={`/drops/${drop.slug}`}
                  className={`group flex flex-col gap-3 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${drop.tier === 1 ? theme.assistantShell : theme.metricShell}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                      Tier {drop.tier}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{drop.when}</span>
                  </div>
                  <h2 className="text-base font-semibold tracking-tight sm:text-lg">{drop.title}</h2>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
                    <span>{drop.status}</span>
                    <span>{drop.preorders} pre-orders</span>
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
