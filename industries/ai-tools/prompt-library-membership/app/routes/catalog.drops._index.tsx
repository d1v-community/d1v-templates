import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Drops · ${SITE_CONFIG.appTitle}` },
];

const DROPS = [
  {
    "id": "d-2026-w42",
    "title": "Drop · week 42",
    "when": "Now",
    "summary": "Three packs on launching a v1 in 7 days."
  },
  {
    "id": "d-2026-w43",
    "title": "Drop · week 43",
    "when": "In 7d",
    "summary": "Three packs on closing your first 10 buyers."
  },
  {
    "id": "d-2026-w44",
    "title": "Drop · week 44",
    "when": "In 14d",
    "summary": "Three packs on retention loops."
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, drops: DROPS });
}

export default function DropsTab() {
  const { drops } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (drops.length === 0) {
    return <EmptyState icon="🚀" title="No drops scheduled" description="Schedule your first drop and the catalog will populate here." />;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {drops.map((drop) => (
        <li key={drop.id} className={`flex flex-col gap-2 rounded-2xl p-5 ${theme.metricShell}`}>
          <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
            {drop.when}
          </span>
          <h3 className="text-base font-semibold tracking-tight sm:text-lg">{drop.title}</h3>
          <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{drop.summary}</p>
        </li>
      ))}
    </ul>
  );
}
