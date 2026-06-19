import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { asc, eq } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { PageHeader } from "~/components/sections/PageHeader";
import { CommentThread, type CommentEntry } from "~/components/ugc/CommentThread";
import { db } from "~/db/db.server";
import { ugcAnswers, ugcQuestions } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Question · ${APP_TITLE}` },
  { name: "description", content: "Single Q&A thread." },
];

interface QuestionDetail {
  id: string;
  courseSlug: string;
  askerName: string;
  askerInitials: string;
  body: string;
  createdAt: string;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? "";

  let question: QuestionDetail | null = null;
  let answers: CommentEntry[] = [];
  try {
    const qRows = await db
      .select()
      .from(ugcQuestions)
      .where(eq(ugcQuestions.id, id))
      .limit(1);
    if (qRows[0]) {
      const q = qRows[0];
      question = {
        id: q.id,
        courseSlug: q.courseSlug,
        askerName: q.askerName,
        askerInitials: q.askerInitials,
        body: q.body,
        createdAt: q.createdAt instanceof Date ? q.createdAt.toISOString() : String(q.createdAt ?? ""),
      };

      const aRows = await db
        .select()
        .from(ugcAnswers)
        .where(eq(ugcAnswers.questionId, id))
        .orderBy(asc(ugcAnswers.createdAt));
      answers = aRows.map(a => ({
        id: a.id,
        authorName: a.authorName,
        authorInitials: a.authorInitials,
        body: a.body,
        createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt ?? ""),
      }));
    }
  } catch (error) {
    console.error("Failed to load question:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    question,
    answers,
  });
}

export default function QuestionDetailRoute() {
  const { user, question, answers } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
        <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
        <main className="flex-1 mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 py-16">
          <PageHeader eyebrow="Q&A" title="Question not found" description="This question may have been removed." />
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Q&A · ${question.courseSlug}`}
          title="Question"
          back={{ href: `/courses/${question.courseSlug}/qa`, label: "Q&A" }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <article className={`flex flex-col gap-3 rounded-3xl p-6 ${theme.sectionShell}`}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}
              >
                {question.askerInitials}
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight">{question.askerName}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">Asked</p>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{question.body}</p>
          </article>

          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
              {answers.length} {answers.length === 1 ? "answer" : "answers"}
            </h2>
            <CommentThread
              comments={answers}
              action="/api/ugc/answer"
              hidden={{ questionId: question.id }}
              placeholder="Write an answer…"
            />
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}