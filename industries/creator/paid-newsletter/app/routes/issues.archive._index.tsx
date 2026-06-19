import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Archive · ${SITE_CONFIG.appTitle}` },
];

const ISSUES = [
  {
    "number": "042",
    "title": "The quiet compounding edition",
    "date": "Oct 21, 2026",
    "minutes": 7,
    "summary": "Small systems beat large intentions. The four habits I run on autopilot.",
    "isNew": true,
    "isSaved": true,
    "readProgress": 62
  },
  {
    "number": "041",
    "title": "On paying for software you outgrow",
    "date": "Oct 14, 2026",
    "minutes": 6,
    "summary": "A simple rule for when to upgrade, downgrade, or churn.",
    "isNew": true,
    "isSaved": false,
    "readProgress": 0
  },
  {
    "number": "040",
    "title": "The renewal problem",
    "date": "Oct 7, 2026",
    "minutes": 8,
    "summary": "Why most renewals slip and what to do about it in week 8, not week 12.",
    "isNew": false,
    "isSaved": true,
    "readProgress": 100
  },
  {
    "number": "039",
    "title": "Ship before you polish",
    "date": "Sep 30, 2026",
    "minutes": 5,
    "summary": "The minimum amount of polish required to learn from the next 100 readers.",
    "isNew": false,
    "isSaved": true,
    "readProgress": 100
  },
  {
    "number": "038",
    "title": "On the cost of context switching",
    "date": "Sep 23, 2026",
    "minutes": 6,
    "summary": "What two week-long focus blocks bought me.",
    "isNew": false,
    "isSaved": false,
    "readProgress": 100
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const issues = ISSUES;
  return json({ user, issues });
}

interface Issue {
  number: string;
  title: string;
  date: string;
  minutes: number;
  summary: string;
}

export default function ArchiveTab() {
  const { issues } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const list = issues as unknown as Issue[];

  if (list.length === 0) {
    return <EmptyState icon="📰" title="No issues yet" description="Once new issues ship, the archive will populate here." />;
  }

  return (
    <ul className="grid gap-3">
      {list.map((issue) => (
        <li key={issue.number}>
          <Link
            to={`/issues/${issue.number}`}
            className={`group grid gap-3 rounded-2xl p-5 sm:grid-cols-[120px_1fr_auto] sm:items-center transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
          >
            <div className="flex flex-col">
              <span className={`text-3xl font-semibold tracking-[-0.05em] ${theme.metricValue}`}>#{issue.number}</span>
              <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{issue.date}</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight sm:text-lg">{issue.title}</h3>
              <p className={`mt-1 text-sm leading-relaxed ${theme.sectionText}`}>{issue.summary}</p>
            </div>
            <span className="self-start whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 transition group-hover:opacity-100">
              {issue.minutes} min read →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
