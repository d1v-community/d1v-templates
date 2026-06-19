import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { requireUserOrRedirect } from '~/lib/auth-flow';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { SITE_CONFIG } from '~/constants/site';

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserOrRedirect(request);
  return json({
    metrics: [
      { label: 'Tokens burned', value: '1.42M', trend: '+8.4%', tone: 'up' as const },
      { label: 'Active seats', value: '41 / 60', trend: '+3', tone: 'up' as const },
      { label: 'Avg first response', value: '1.8s', trend: '-0.3s', tone: 'down' as const },
      { label: 'Escalations', value: '4', trend: '-2', tone: 'down' as const },
    ],
  });
}

export default function ConsoleOverview() {
  const { metrics } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const display = (user: { displayName: string | null; username: string | null; email: string | null } | null) =>
    user?.displayName || user?.username || user?.email || 'there';

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(metric => (
          <div key={metric.label} className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.metricShell}`}>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] opacity-60">{metric.label}</span>
            <span className={`text-2xl font-semibold tracking-[-0.05em] ${theme.metricValue}`}>{metric.value}</span>
            <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${metric.tone === 'up' ? theme.subEyebrow : 'opacity-60'}`}>
              {metric.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/console/threads"
          className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
        >
          <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
            Live queue
          </span>
          <h3 className="text-base font-semibold tracking-tight sm:text-lg">4 active threads</h3>
          <p className={`text-sm leading-relaxed ${theme.sectionText}`}>
            Threads waiting for follow-up or automation review.
          </p>
          <span className="mt-1 self-end text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 transition group-hover:opacity-100">
            Open threads →
          </span>
        </Link>

        <Link
          to="/console/prompts"
          className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
        >
          <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
            Prompt ops
          </span>
          <h3 className="text-base font-semibold tracking-tight sm:text-lg">1 prompt needs review</h3>
          <p className={`text-sm leading-relaxed ${theme.sectionText}`}>
            Reusable scripts, versioned for the workspace. Replace with the prompts your team actually uses.
          </p>
          <span className="mt-1 self-end text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 transition group-hover:opacity-100">
            Open prompts →
          </span>
        </Link>
      </div>
    </div>
  );
}
