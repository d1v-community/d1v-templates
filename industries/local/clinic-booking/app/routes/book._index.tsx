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
  { title: `Book a slot · ${APP_TITLE}` },
  { name: 'description', content: 'Booking surface for the clinic.' },
];

const DOCTORS = [
  { id: 'dr-okafor', name: 'Dr. Okafor', specialty: 'General medicine', next: 'Today 14:30', rating: 4.9 },
  { id: 'dr-lin', name: 'Dr. Lin', specialty: 'Pediatrics', next: 'Today 16:00', rating: 4.8 },
  { id: 'dr-park', name: 'Dr. Park', specialty: 'Dermatology', next: 'Tomorrow 09:15', rating: 4.7 },
  { id: 'dr-singh', name: 'Dr. Singh', specialty: 'Family care', next: 'Tomorrow 11:00', rating: 4.9 },
];

const SLOTS = ['09:00', '10:30', '12:00', '14:30', '16:00', '17:30'];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, doctors: DOCTORS, slots: SLOTS });
}

export default function BookIndex() {
  const { user, doctors, slots } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

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
          eyebrow="Booking"
          title="Book a slot"
          description="Pick a doctor, then a slot. The booking attaches to the same account so you can review history any time."
          back={{ href: '/', label: 'Home' }}
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6 sm:space-y-8">
          {doctors.length === 0 ? (
            <EmptyState icon="🩺" title="No providers on duty" description="Add provider schedules to open booking." hint="schedule → booking" />
          ) : (
            <>
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {doctors.map(doctor => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => setSelectedDoctor(prev => (prev === doctor.id ? null : doctor.id))}
                    className={`flex flex-col gap-2 rounded-2xl p-5 text-left transition duration-300 motion-safe:hover:-translate-y-1 ${
                      selectedDoctor === doctor.id ? theme.assistantShell : theme.metricShell
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold tracking-tight">{doctor.name}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">★ {doctor.rating}</span>
                    </div>
                    <p className={`text-sm ${theme.sectionText}`}>{doctor.specialty}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Next · {doctor.next}</p>
                  </button>
                ))}
              </div>

              {selectedDoctor ? (
                <div className={`rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.subEyebrow}`}>Open slots</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Choose a time</h2>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {slots.map(slot => (
                      <Link
                        key={slot}
                        to={`/book/${selectedDoctor}?slot=${slot}`}
                        className={`flex items-center justify-center rounded-2xl px-3 py-3 text-sm font-semibold tracking-tight transition ${theme.listItemShell} hover:opacity-90`}
                      >
                        {slot}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
