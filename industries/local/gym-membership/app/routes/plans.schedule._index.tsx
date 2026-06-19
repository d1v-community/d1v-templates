import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Schedule · ${SITE_CONFIG.appTitle}` },
];

const SCHEDULE = [
  { day: "Mon", items: [{ id: "s-1", name: "Strength 101", when: "18:00", coach: "Avery" }, { id: "s-2", name: "Open gym", when: "06:00 – 22:00" }] },
  { day: "Tue", items: [{ id: "s-3", name: "Mobility flow", when: "07:30", coach: "Ren" }, { id: "s-4", name: "Open gym", when: "06:00 – 22:00" }] },
  { day: "Wed", items: [{ id: "s-5", name: "HIIT 30", when: "19:00", coach: "Mika" }] },
  { day: "Thu", items: [{ id: "s-6", name: "Reformer pilates", when: "12:00", coach: "Sage" }] },
  { day: "Fri", items: [{ id: "s-7", name: "Recovery flow", when: "17:30", coach: "Ren" }] },
  { day: "Sat", items: [{ id: "s-8", name: "Run club", when: "09:00", coach: "Avery" }] },
  { day: "Sun", items: [{ id: "s-9", name: "Open gym", when: "08:00 – 18:00" }] },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, schedule: SCHEDULE });
}

export default function ScheduleTab() {
  const { schedule } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (schedule.length === 0) {
    return <EmptyState icon="📅" title="No schedule yet" description="Add weekly classes to populate the schedule grid." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {schedule.map((day) => (
        <article key={day.day} className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.metricShell}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.subEyebrow}`}>{day.day}</p>
          <ul className="flex flex-col gap-1.5">
            {day.items.map((item: any) => (
              <li key={item.id} className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                <span className={`text-[11px] ${theme.sectionText}`}>{item.when}{item.coach ? ` · ${item.coach}` : ""}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
