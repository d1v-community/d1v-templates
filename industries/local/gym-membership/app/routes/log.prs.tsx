import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { EmptyState } from "~/components/sections/EmptyState";
import { PageHeader } from "~/components/sections/PageHeader";
import { db } from "~/db/db.server";
import { ugcPrs } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `PR board · ${APP_TITLE}` },
  { name: "description", content: "Personal records board." },
];

interface PrRow {
  id: string;
  movement: string;
  weightKg: number;
  reps: number;
  note: string;
  achievedAt: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);

  let prs: PrRow[] = [];
  try {
    const rows = await db
      .select()
      .from(ugcPrs)
      .where(eq(ugcPrs.appUserId, user.id))
      .orderBy(desc(ugcPrs.createdAt));
    prs = rows.map(r => ({
      id: r.id,
      movement: r.movement,
      weightKg: r.weightKg,
      reps: r.reps,
      note: r.note,
      achievedAt: r.achievedAt,
    }));
  } catch (error) {
    console.error("Failed to load PRs:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    prs,
  });
}

export default function PrBoardRoute() {
  const { user, prs } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow="PRs"
          title="Personal records"
          description="Every PR you've logged, newest first."
          back={{ href: "/log", label: "Workout log" }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-3">
          {prs.length === 0 ? (
            <EmptyState
              icon="🏆"
              title="No PRs yet"
              description="Log a workout and add a PR — they show up here automatically."
              hint="log → PR"
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {prs.map(pr => (
                <li key={pr.id} className={`flex flex-col gap-1 rounded-2xl p-4 ${theme.metricShell}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold tracking-tight">{pr.movement}</p>
                    <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">{pr.achievedAt}</span>
                  </div>
                  <p className="text-sm">
                    {pr.weightKg} kg × {pr.reps}
                  </p>
                  {pr.note ? <p className="text-xs opacity-70">{pr.note}</p> : null}
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/log"
            className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}
          >
            <span aria-hidden>←</span> Back to log
          </Link>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}