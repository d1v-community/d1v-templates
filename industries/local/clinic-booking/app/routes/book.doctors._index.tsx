import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Doctors · ${SITE_CONFIG.appTitle}` },
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

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, doctors: DOCTORS });
}

export default function DoctorsTab() {
  const { doctors } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (doctors.length === 0) {
    return <EmptyState icon="🩺" title="No providers yet" description="Add provider profiles so patients can pick a doctor." />;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {doctors.map((doctor) => (
        <li key={doctor.id} className={`flex flex-col gap-2 rounded-2xl p-5 ${theme.metricShell}`}>
          <span className="text-lg font-semibold tracking-tight">{doctor.name}</span>
          <p className={`text-sm ${theme.sectionText}`}>{doctor.specialty}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Next · {doctor.next}</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">★ {doctor.rating}</p>
        </li>
      ))}
    </ul>
  );
}
