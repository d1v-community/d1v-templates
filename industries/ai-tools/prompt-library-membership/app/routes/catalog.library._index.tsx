import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `My library · ${SITE_CONFIG.appTitle}` },
];

const SEED = [
  {
    "slug": "launch-os",
    "name": "Launch OS",
    "workflow": "Launch",
    "outcome": "Ship a v1 in 7 days",
    "role": "Founders",
    "difficulty": "Beginner",
    "saved": true,
    "progress": 62,
    "lastReadAt": "2d ago"
  },
  {
    "slug": "research-radar",
    "name": "Research Radar",
    "workflow": "Research",
    "outcome": "Pre-decision scan",
    "role": "Analysts",
    "difficulty": "Intermediate",
    "saved": true,
    "progress": 100,
    "lastReadAt": "1w ago"
  },
  {
    "slug": "cold-outreach-kit",
    "name": "Cold Outreach Kit",
    "workflow": "Sales",
    "outcome": "First 100 warm replies",
    "role": "SDRs",
    "difficulty": "Beginner",
    "saved": true,
    "progress": 28,
    "lastReadAt": "4d ago"
  },
  {
    "slug": "content-engine",
    "name": "Content Engine",
    "workflow": "Content",
    "outcome": "30 days of long-form",
    "role": "Creators",
    "difficulty": "Intermediate",
    "saved": true,
    "progress": 0,
    "lastReadAt": "—"
  },
  {
    "slug": "product-discovery",
    "name": "Product Discovery",
    "workflow": "Product",
    "outcome": "Insight to spec",
    "role": "PMs",
    "difficulty": "Advanced",
    "saved": false,
    "progress": 0,
    "lastReadAt": "—"
  },
  {
    "slug": "support-triage",
    "name": "Support Triage",
    "workflow": "Support",
    "outcome": "Faster tier-1",
    "role": "CX leads",
    "difficulty": "Beginner",
    "saved": false,
    "progress": 0,
    "lastReadAt": "—"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const items = SEED;
  return json({ user, items });
}

interface ListItem {
  id?: string;
  slug?: string;
  number?: string;
  n?: number;
  title?: string;
  name?: string;
  status?: string;
  summary?: string;
  topic?: string;
  detail?: string;
  client?: string;
  owner?: string;
  coach?: string;
  workflow?: string;
  role?: string;
  level?: string;
  updated?: string;
  when?: string;
  members?: number;
  spots?: number;
  lastReadAt?: string;
  lastOpenedAt?: string;
  lastTouchedAt?: string;
  date?: string;
  minutes?: number;
  format?: string;
  license?: string;
  price?: string;
  difficulty?: string;
  outcome?: string;
  preorders?: number;
}

function itemHref(item: ListItem): string {
  if (item.slug) return `/catalog/${item.slug}`;
  if (item.number) return `/catalog/${item.number}`;
  if (item.n != null) return `/catalog/${item.n}`;
  if (item.id) return `/catalog/${item.id}`;
  return `/catalog`;
}

function itemKey(item: ListItem): string {
  return (item.id ?? item.slug ?? item.number ?? String(item.n ?? Math.random())) as string;
}

function itemTitle(item: ListItem): string {
  return (item.title ?? item.name ?? "Untitled") as string;
}

function itemSummary(item: ListItem): string {
  return (item.summary ?? item.topic ?? item.detail ?? "") as string;
}

export default function LibraryTab() {
  const { items } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const list = items as unknown as ListItem[];

  if (list.length === 0) {
    return (
      <EmptyState
        icon="✶"
        title="Nothing here yet"
        description="Once new data lands, the filtered items will show up here automatically."
      />
    );
  }

  return (
    <ul className="grid gap-3">
      {list.map((item) => (
        <li key={itemKey(item)}>
          <Link
            to={itemHref(item)}
            className={`group flex flex-col gap-2 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-0.5 ${theme.metricShell}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold tracking-tight sm:text-lg">{itemTitle(item)}</h3>
              {item.status ? (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                  {item.status}
                </span>
              ) : null}
            </div>
            {itemSummary(item) ? (
              <p className={`text-sm leading-relaxed ${theme.sectionText}`}>
                {itemSummary(item)}
              </p>
            ) : null}
            <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] opacity-70">
              {item.client ? <span>{item.client}</span> : null}
              {item.owner ? <span>Owner · {item.owner}</span> : null}
              {item.coach ? <span>Coach · {item.coach}</span> : null}
              {item.workflow ? <span>{item.workflow}</span> : null}
              {item.role ? <span>{item.role}</span> : null}
              {item.level ? <span>{item.level}</span> : null}
              {item.updated ? <span>Updated {item.updated}</span> : null}
              {item.when ? <span>{item.when}</span> : null}
              {item.members ? <span>{item.members} members</span> : null}
              {item.spots ? <span>{item.spots} spots</span> : null}
              {item.lastReadAt ? <span>Last read {item.lastReadAt}</span> : null}
              {item.lastOpenedAt ? <span>Last opened {item.lastOpenedAt}</span> : null}
              {item.lastTouchedAt ? <span>Last touched {item.lastTouchedAt}</span> : null}
              {item.date ? <span>{item.date}</span> : null}
              {item.minutes ? <span>{item.minutes} min read</span> : null}
              {item.format ? <span>{item.format}</span> : null}
              {item.license ? <span>{item.license}</span> : null}
              {item.price ? <span className="text-base font-semibold tracking-tight">{item.price}</span> : null}
              {item.difficulty ? <span>{item.difficulty}</span> : null}
              {item.outcome ? <span>{item.outcome}</span> : null}
              {item.preorders ? <span>{item.preorders} pre-orders</span> : null}
              <span className="ml-auto opacity-60 transition group-hover:opacity-100">Open →</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
