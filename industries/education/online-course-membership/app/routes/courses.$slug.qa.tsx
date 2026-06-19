import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { desc, eq } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { EmptyState } from "~/components/sections/EmptyState";
import { PageHeader } from "~/components/sections/PageHeader";
import { Composer } from "~/components/ugc/Composer";
import { db } from "~/db/db.server";
import { ugcQuestions } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = ({ params }) => [
  { title: `Q&A · ${params.slug ?? ""} · ${APP_TITLE}` },
  { name: "description", content: "Course Q&A thread." },
];

interface QuestionRow {
  id: string;
  askerName: string;
  askerInitials: string;
  body: string;
  answerCount: number;
  createdAt: string;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const slug = params.slug ?? "";

  let questions: QuestionRow[] = [];
  try {
    const rows = await db
      .select()
      .from(ugcQuestions)
      .where(eq(ugcQuestions.courseSlug, slug))
      .orderBy(desc(ugcQuestions.createdAt));
    questions = rows.map(r => ({
      id: r.id,
      askerName: r.askerName,
      askerInitials: r.askerInitials,
      body: r.body,
      answerCount: r.answerCount,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt ?? ""),
    }));
  } catch (error) {
    console.error("Failed to load Q&A questions:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    slug,
    questions,
  });
}

export default function CourseQaRoute() {
  const { user, slug, questions } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Q&A · ${slug}`}
          title="Course questions"
          description="Ask anything about this course. Other students and the instructor will reply below."
          back={{ href: `/courses/${slug}`, label: "Course" }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <Composer
            action="/api/ugc/question"
            hidden={{ courseSlug: slug }}
            placeholder="Ask a question about this course…"
            submitLabel="Post question"
          />

          {questions.length === 0 ? (
            <EmptyState
              icon="❓"
              title="No questions yet"
              description="Be the first to ask. Anyone taking the course can reply."
              hint="composer → ask"
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {questions.map(q => (
                <li key={q.id}>
                  <Link
                    to={`/qa/${q.id}`}
                    className={`flex flex-col gap-2 rounded-2xl p-5 transition hover:opacity-90 ${theme.metricShell}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}
                      >
                        {q.askerInitials}
                      </span>
                      <p className="text-sm font-semibold tracking-tight">{q.askerName}</p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{q.body}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">
                      {q.answerCount > 0 ? `${q.answerCount} ${q.answerCount === 1 ? "answer" : "answers"}` : "No answers yet"} →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}