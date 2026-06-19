import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Alerts · ${SITE_CONFIG.appTitle}` },
];

const ALERTS = [
  {
    "id": "al-1",
    "severity": "info",
    "title": "Cache invalidation skipped after deploy",
    "when": "12m ago",
    "detail": "Synthetic monitor caught it. No customer-visible errors yet."
  },
  {
    "id": "al-2",
    "severity": "info",
    "title": "Top-of-hour latency spike",
    "when": "1h ago",
    "detail": "Resolved in 4 minutes. P95 back inside SLO."
  },
  {
    "id": "al-3",
    "severity": "warn",
    "title": "Renewal queue at 78% of cap",
    "when": "3h ago",
    "detail": "3 renewals past the 7-day soft window. Owner: Mika."
  },
  {
    "id": "al-4",
    "severity": "info",
    "title": "Friday deploy freeze",
    "when": "Today",
    "detail": "Freeze starts 17:00. Hold non-critical merges."
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, alerts: ALERTS });
}

const TONE: Record<string, string> = {
  info: "border-sky-200 bg-sky-50 dark:border-sky-900/60 dark:bg-sky-950/20",
  warn: "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20",
  crit: "border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20",
};

export default function AlertsTab() {
  const { alerts } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (alerts.length === 0) {
    return <EmptyState icon="✓" title="All clear" description="No on-call alerts in the last 24 hours." />;
  }

  return (
    <ul className="grid gap-3">
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className={`flex flex-col gap-1.5 rounded-2xl border p-4 ${TONE[alert.severity] ?? TONE.info}`}
        >
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
            <span className="inline-flex items-center gap-2">
              <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${theme.eyebrow}`}>
                {alert.severity === "warn" ? "!" : alert.severity === "crit" ? "!!" : "i"}
              </span>
              {alert.severity}
            </span>
            <span>{alert.when}</span>
          </div>
          <h3 className="text-sm font-semibold tracking-tight">{alert.title}</h3>
          <p className="text-sm leading-relaxed opacity-80">{alert.detail}</p>
        </li>
      ))}
    </ul>
  );
}
