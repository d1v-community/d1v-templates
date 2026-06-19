import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Live now · ${SITE_CONFIG.appTitle}` },
];

const ROOMS = [
  {
    "id": "room-week-42",
    "title": "Week 42 cohort room",
    "when": "Tue 19:00",
    "members": 64,
    "status": "Live this week",
    "topic": "Shipping the next drop without burning out"
  },
  {
    "id": "room-amas",
    "title": "Monthly AMA",
    "when": "First Friday",
    "members": 88,
    "status": "Open",
    "topic": "Submit your question by Thursday"
  },
  {
    "id": "room-craft",
    "title": "Craft crit circle",
    "when": "Wednesdays",
    "members": 22,
    "status": "Open",
    "topic": "Small group, weekly critique"
  },
  {
    "id": "room-orientation",
    "title": "New member orientation",
    "when": "Mondays",
    "members": 12,
    "status": "Open",
    "topic": "Onboarding pass for new joiners"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, rooms: ROOMS });
}

export default function LiveTab() {
  const { rooms } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (rooms.length === 0) {
    return <EmptyState icon="🌙" title="No rooms here" description="Once new rooms are scheduled, they will appear in this tab." />;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link
            to={`/rooms/${room.id}`}
            className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold tracking-tight sm:text-lg">{room.title}</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>{room.status}</span>
            </div>
            <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{room.topic}</p>
            <div className="mt-1 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] opacity-70">
              <span>{room.when}</span>
              <span className="opacity-30">/</span>
              <span>{room.members} members</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
