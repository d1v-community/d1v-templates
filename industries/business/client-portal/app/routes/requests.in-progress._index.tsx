import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `In progress · ${SITE_CONFIG.appTitle}` },
];

const SEED = [
  {
    "id": "req-onboarding",
    "title": "Quarterly onboarding pass",
    "client": "Northwind",
    "status": "In progress",
    "updated": "2h ago",
    "summary": "Schedule onboarding, share workspace access, send welcome doc."
  },
  {
    "id": "req-renewal",
    "title": "Annual renewal paperwork",
    "client": "Heliograph",
    "status": "Awaiting client",
    "updated": "Today",
    "summary": "Send contract v2, await countersign, file in portal."
  },
  {
    "id": "req-bug-triage",
    "title": "Triage last week reports",
    "client": "Vellum Co.",
    "status": "Triaging",
    "updated": "Yesterday",
    "summary": "Three reports linked to the same export endpoint."
  },
  {
    "id": "req-migration",
    "title": "Migrate from legacy CRM",
    "client": "Forge Studio",
    "status": "Closed",
    "updated": "3d ago",
    "summary": "Migration scope ready. Awaiting kickoff window."
  },
  {
    "id": "req-archive",
    "title": "Q3 invoice pack",
    "client": "Helios",
    "status": "Closed",
    "updated": "2w ago",
    "summary": "Sent invoice pack, archived in portal."
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
  if (item.slug) return `/requests/${item.slug}`;
  if (item.number) return `/requests/${item.number}`;
  if (item.n != null) return `/requests/${item.n}`;
  if (item.id) return `/requests/${item.id}`;
  return `/requests`;
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

export default function InProgressTab() {
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
