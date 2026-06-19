import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Syllabus · ${SITE_CONFIG.appTitle}` },
];

const WEEKS = [
  {
    "n": 1,
    "title": "Why now",
    "outcome": "Name the constraint and the bet",
    "deliverable": "One-page problem framing",
    "userAction": "delivered"
  },
  {
    "n": 2,
    "title": "Audience and offer",
    "outcome": "Pick the buyer and the shape of value",
    "deliverable": "Offer canvas",
    "userAction": "delivered"
  },
  {
    "n": 3,
    "title": "Build the v0",
    "outcome": "Ship the smallest thing that proves the bet",
    "deliverable": "V0 demo + debrief",
    "userAction": "this-week"
  },
  {
    "n": 4,
    "title": "Pricing and packaging",
    "outcome": "Set the price with intent",
    "deliverable": "Pricing card + rationale",
    "userAction": "upcoming"
  },
  {
    "n": 5,
    "title": "First 10 buyers",
    "outcome": "Hand-sell the first cohort",
    "deliverable": "Outreach log",
    "userAction": "upcoming"
  },
  {
    "n": 6,
    "title": "Operations and onboarding",
    "outcome": "Move buyers into the product without a queue",
    "deliverable": "Onboarding flow",
    "userAction": "upcoming"
  },
  {
    "n": 7,
    "title": "Retention loops",
    "outcome": "Make the second purchase obvious",
    "deliverable": "Renewal script",
    "userAction": "upcoming"
  },
  {
    "n": 8,
    "title": "Scale or stop",
    "outcome": "Decide the next 90 days with evidence",
    "deliverable": "Decision memo",
    "userAction": "upcoming"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const weeks = WEEKS;
  return json({ user, weeks });
}

interface Week {
  n: number;
  title: string;
  outcome: string;
  deliverable: string;
  userAction: string;
}

export default function SyllabusTab() {
  const { weeks } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const list = weeks as unknown as Week[];

  if (list.length === 0) {
    return <EmptyState icon="🎓" title="Nothing here yet" description="Once a week is delivered it will appear here." />;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((week) => (
        <li key={week.n}>
          <Link
            to={`/weeks/${week.n}`}
            className={`group flex flex-col gap-3 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}>W{week.n}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{week.userAction}</span>
            </div>
            <h3 className="text-base font-semibold tracking-tight sm:text-lg">{week.title}</h3>
            <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{week.outcome}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Deliverable · {week.deliverable}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
