import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { getSiteThemeClasses } from '~/constants/site-theme';
import { SITE_CONFIG } from '~/constants/site';
import { requireUserOrRedirect } from '~/lib/auth-flow';

export const meta: MetaFunction = () => [
  { title: `Billing · ${SITE_CONFIG.appTitle}` },
  { name: 'description', content: 'Plan, seat usage, and renewal.' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({
    user,
    plan: {
      name: 'Pro Assistant',
      price: '$59 / month',
      renewal: 'Feb 14, 2027',
      seats: '41 / 60',
      credits: '18,500 / 25,000',
    },
  });
}

export default function BillingIndex() {
  const { plan } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="space-y-4">
      <div className={`rounded-3xl p-6 sm:p-8 ${theme.sectionShell}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.subEyebrow}`}>Current plan</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{plan.name}</h2>
        <p className={`mt-1 text-sm ${theme.body}`}>Renews {plan.renewal}</p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className={`rounded-2xl p-4 ${theme.metricShell}`}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Price</dt>
            <dd className={`mt-1 text-xl font-semibold ${theme.metricValue}`}>{plan.price}</dd>
          </div>
          <div className={`rounded-2xl p-4 ${theme.metricShell}`}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Seats</dt>
            <dd className={`mt-1 text-xl font-semibold ${theme.metricValue}`}>{plan.seats}</dd>
          </div>
          <div className={`rounded-2xl p-4 sm:col-span-2 ${theme.metricShell}`}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Credits</dt>
            <dd className={`mt-1 text-xl font-semibold ${theme.metricValue}`}>{plan.credits}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/pricing"
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}
          >
            Manage plan
          </Link>
          <Link
            to="/pay.success"
            className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.secondaryButton}`}
          >
            View payment history
          </Link>
        </div>
      </div>
    </div>
  );
}
