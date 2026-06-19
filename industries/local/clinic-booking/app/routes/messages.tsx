import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { EmptyState } from "~/components/sections/EmptyState";
import { PageHeader } from "~/components/sections/PageHeader";
import { db } from "~/db/db.server";
import { ugcMessages } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Messages · ${APP_TITLE}` },
  { name: "description", content: "Secure messages with providers." },
];

interface ThreadHead {
  doctorId: string;
  doctorName: string;
  lastBody: string;
  lastAuthor: string;
  lastInitials: string;
  lastAt: string;
  count: number;
}

const DOCTOR_NAMES: Record<string, string> = {
  "dr-okafor": "Dr. Okafor",
  "dr-lin": "Dr. Lin",
  "dr-park": "Dr. Park",
  "dr-singh": "Dr. Singh",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);

  let threads: ThreadHead[] = [];
  try {
    const rows = await db
      .select()
      .from(ugcMessages)
      .orderBy(desc(ugcMessages.createdAt));

    const byDoctor = new Map<string, ThreadHead>();
    let total = 0;
    for (const r of rows) {
      total += 1;
      const existing = byDoctor.get(r.doctorId);
      if (!existing) {
        byDoctor.set(r.doctorId, {
          doctorId: r.doctorId,
          doctorName: DOCTOR_NAMES[r.doctorId] ?? r.doctorId,
          lastBody: r.body,
          lastAuthor: r.authorName,
          lastInitials: r.authorInitials,
          lastAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt ?? ""),
          count: 1,
        });
      } else {
        existing.count += 1;
      }
    }
    threads = Array.from(byDoctor.values());
  } catch (error) {
    console.error("Failed to load message threads:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    threads,
  });
}

export default function MessagesIndex() {
  const { user, threads } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Inbox"
          title="Messages"
          description="Pick up a thread with one of your providers. Messages stay attached to your account."
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-3">
          {threads.length === 0 ? (
            <EmptyState
              icon="✉️"
              title="No conversations yet"
              description="Book an appointment and message your provider from the booking page."
              hint="book → message"
            />
          ) : (
            threads.map(t => (
              <Link
                key={t.doctorId}
                to={`/messages/${t.doctorId}`}
                className={`flex items-center gap-4 rounded-2xl p-4 transition hover:opacity-90 ${theme.metricShell}`}
              >
                <span
                  aria-hidden
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}
                >
                  {t.lastInitials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold tracking-tight">{t.doctorName}</p>
                  <p className="mt-0.5 truncate text-xs opacity-70">{t.lastBody}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">
                  {t.count} msg{t.count === 1 ? "" : "s"} →
                </span>
              </Link>
            ))
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}