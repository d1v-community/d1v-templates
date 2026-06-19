import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Classes · ${SITE_CONFIG.appTitle}` },
];

const CLASSES = [
  {
    "id": "strength",
    "name": "Strength 101",
    "when": "Mon · 18:00",
    "coach": "Avery",
    "spots": 6
  },
  {
    "id": "mobility",
    "name": "Mobility flow",
    "when": "Tue · 07:30",
    "coach": "Ren",
    "spots": 12
  },
  {
    "id": "hiit",
    "name": "HIIT 30",
    "when": "Wed · 19:00",
    "coach": "Mika",
    "spots": 4
  },
  {
    "id": "pilates",
    "name": "Reformer pilates",
    "when": "Thu · 12:00",
    "coach": "Sage",
    "spots": 8
  },
  {
    "id": "run-club",
    "name": "Run club",
    "when": "Sat · 09:00",
    "coach": "Avery",
    "spots": 20
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, classes: CLASSES });
}

export default function ClassesTab() {
  const { classes } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (classes.length === 0) {
    return <EmptyState icon="💪" title="No classes scheduled" description="Add the weekly class grid to populate this tab." />;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {classes.map((cls) => (
        <li key={cls.id} className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${theme.listItemShell}`}>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">{cls.name}</p>
            <p className={`mt-0.5 text-xs ${theme.sectionText}`}>{cls.when} · {cls.coach}</p>
          </div>
          <Link
            to={`/classes/${cls.id}`}
            className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.secondaryButton}`}
          >
            {cls.spots} spots
          </Link>
        </li>
      ))}
    </ul>
  );
}
