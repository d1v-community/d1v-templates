import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Reports · ${SITE_CONFIG.appTitle}` },
];

const REPORTS = [
  {
    "id": "weekly-pipeline",
    "title": "Weekly pipeline review",
    "owner": "Ren",
    "status": "Live",
    "period": "Week 42 · 2026"
  },
  {
    "id": "queue-load",
    "title": "Queue load by team",
    "owner": "Mika",
    "status": "Live",
    "period": "Week 42 · 2026"
  },
  {
    "id": "incident-postmortem",
    "title": "On-call postmortem (W42)",
    "owner": "Avery",
    "status": "Draft",
    "period": "Week 42 · 2026"
  },
  {
    "id": "forecast-q4",
    "title": "Q4 forecast model",
    "owner": "Sage",
    "status": "Review",
    "period": "Q4 · 2026"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, reports: REPORTS });
}

export default function ReportsTab() {
  const { reports } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (reports.length === 0) {
    return <EmptyState icon="📊" title="No reports yet" description="Connect the data warehouse to populate reports here." />;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {reports.map((report) => (
        <li key={report.id}>
          <Link
            to={`/dashboard/reports/${report.id}`}
            className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{report.period}</p>
            <h3 className="text-base font-semibold tracking-tight sm:text-lg">{report.title}</h3>
            <div className="mt-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
              <span>Owner · {report.owner}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                {report.status}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
