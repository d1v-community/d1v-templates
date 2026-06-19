import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `New booking · ${SITE_CONFIG.appTitle}` },
];

const DOCTORS = [
  {
    "id": "dr-okafor",
    "name": "Dr. Okafor",
    "specialty": "General medicine",
    "next": "Today 14:30",
    "rating": 4.9
  },
  {
    "id": "dr-lin",
    "name": "Dr. Lin",
    "specialty": "Pediatrics",
    "next": "Today 16:00",
    "rating": 4.8
  },
  {
    "id": "dr-park",
    "name": "Dr. Park",
    "specialty": "Dermatology",
    "next": "Tomorrow 09:15",
    "rating": 4.7
  },
  {
    "id": "dr-singh",
    "name": "Dr. Singh",
    "specialty": "Family care",
    "next": "Tomorrow 11:00",
    "rating": 4.9
  }
];
const SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "14:30",
  "16:00",
  "17:30"
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, doctors: DOCTORS, slots: SLOTS });
}

export default function NewBookingTab() {
  const { doctors, slots } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  if (doctors.length === 0) {
    return <EmptyState icon="🩺" title="No providers on duty" description="Add provider schedules to open booking." />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            type="button"
            onClick={() => setSelected((prev) => (prev === doctor.id ? null : doctor.id))}
            className={`flex flex-col gap-2 rounded-2xl p-5 text-left transition duration-300 motion-safe:hover:-translate-y-1 ${
              selected === doctor.id ? theme.assistantShell : theme.metricShell
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

      {selected ? (
        <div className={`rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.subEyebrow}`}>Open slots</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Choose a time</h2>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {slots.map((slot) => (
              <Link
                key={slot}
                to={`/book/${selected}?slot=${slot}`}
                className={`flex items-center justify-center rounded-2xl px-3 py-3 text-sm font-semibold tracking-tight transition ${theme.listItemShell} hover:opacity-90`}
              >
                {slot}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
