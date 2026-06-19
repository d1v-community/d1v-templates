import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { EmptyState } from "~/components/sections/EmptyState";
import { PageHeader } from "~/components/sections/PageHeader";
import { db } from "~/db/db.server";
import { ugcPrs, ugcWorkouts } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Log · ${APP_TITLE}` },
  { name: "description", content: "Personal workout log and PR board." },
];

interface WorkoutRow {
  id: string;
  type: string;
  durationMin: number;
  notes: string;
  pr: string;
  createdAt: string;
}

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

  let workouts: WorkoutRow[] = [];
  let prs: PrRow[] = [];
  try {
    const wRows = await db
      .select()
      .from(ugcWorkouts)
      .where(eq(ugcWorkouts.appUserId, user.id))
      .orderBy(desc(ugcWorkouts.createdAt));
    workouts = wRows.map(r => ({
      id: r.id,
      type: r.type,
      durationMin: r.durationMin,
      notes: r.notes,
      pr: r.pr,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt ?? ""),
    }));

    const pRows = await db
      .select()
      .from(ugcPrs)
      .where(eq(ugcPrs.appUserId, user.id))
      .orderBy(desc(ugcPrs.createdAt));
    prs = pRows.map(r => ({
      id: r.id,
      movement: r.movement,
      weightKg: r.weightKg,
      reps: r.reps,
      note: r.note,
      achievedAt: r.achievedAt,
    }));
  } catch (error) {
    console.error("Failed to load workouts:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    workouts,
    prs,
  });
}

export default function LogRoute() {
  const { user, workouts, prs } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Training"
          title="Workout log"
          description="Track sessions and PRs. Everything is attached to your account."
          trailing={
            <Link
              to="/log/prs"
              className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold transition ${theme.primaryButton}`}
            >
              PR board
            </Link>
          }
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-8">
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Log a workout</h2>
            <form method="post" action="/api/ugc/workout" className={`flex flex-col gap-3 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Type</span>
                  <input
                    name="type"
                    required
                    placeholder="Strength, HIIT, mobility…"
                    className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Duration (min)</span>
                  <input
                    type="number"
                    name="durationMin"
                    min={1}
                    max={600}
                    required
                    placeholder="45"
                    className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Notes</span>
                <textarea
                  name="notes"
                  maxLength={1000}
                  rows={3}
                  placeholder="What did you work on?"
                  className={`rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme.assistantInput}`}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">PR (optional)</span>
                <input
                  name="pr"
                  maxLength={120}
                  placeholder="e.g. Deadlift 140kg × 3"
                  className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold transition ${theme.primaryButton}`}
                >
                  Log workout
                </button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Recent sessions</h2>
            {workouts.length === 0 ? (
              <EmptyState
                icon="🏋️"
                title="No workouts logged yet"
                description="Log your first session above and start tracking PRs."
                hint="form → submit"
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {workouts.map(w => (
                  <li key={w.id} className={`flex flex-col gap-1.5 rounded-2xl p-4 ${theme.metricShell}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold tracking-tight">{w.type}</p>
                      <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">{w.durationMin} min</span>
                    </div>
                    {w.notes ? <p className="whitespace-pre-wrap text-sm leading-relaxed">{w.notes}</p> : null}
                    {w.pr ? (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">PR · {w.pr}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Quick PR (yours)</h2>
            <form method="post" action="/api/ugc/pr" className={`flex flex-col gap-3 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Movement</span>
                  <input
                    name="movement"
                    required
                    placeholder="Back squat"
                    className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Weight (kg)</span>
                  <input
                    type="number"
                    name="weightKg"
                    min={0}
                    required
                    className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Reps</span>
                  <input
                    type="number"
                    name="reps"
                    min={1}
                    required
                    className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Achieved</span>
                  <input
                    name="achievedAt"
                    required
                    placeholder="2026-06-19"
                    className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Note</span>
                <input
                  name="note"
                  maxLength={120}
                  placeholder="Optional context"
                  className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold transition ${theme.primaryButton}`}
                >
                  Save PR
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}