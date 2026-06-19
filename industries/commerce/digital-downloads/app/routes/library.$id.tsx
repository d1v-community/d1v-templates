import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';
import { db } from '~/db/db.server';
import { ugcAnswers, ugcQuestions, ugcReviews } from '~/db/schema';
import { ReviewStars } from '~/components/ugc/ReviewStars';
import { Composer } from '~/components/ugc/Composer';

export const meta: MetaFunction = ({ params }) => [
  { title: `${params.id ?? 'bundle'} · ${APP_TITLE}` },
  { name: 'description', content: 'Single bundle detail.' },
];

const DETAILS: Record<string, { title: string; price: string; files: string[]; license: string; updated: string }> = {
  'creator-kit': { title: 'Creator kit', price: '$48', files: ['brief-template.pdf', 'launch-checklist.zip', 'research-board.notion', 'social-stills.zip'], license: 'Commercial · single team', updated: '1d ago' },
  'launch-bundle': { title: 'Launch bundle', price: '$84', files: ['launch-os.zip', 'pricing-spreadsheet.xlsx', 'nps-survey.notion'], license: 'Commercial · single team', updated: '4d ago' },
  'analyst-pack': { title: 'Analyst pack', price: '$36', files: ['interview-grid.pdf', 'synthesis-sheet.xlsx'], license: 'Single team', updated: '2w ago' },
  'founder-toolkit': { title: 'Founder toolkit', price: '$120', files: ['investor-update.notion', 'one-pager.zip', 'cap-table.xlsx'], license: 'Commercial · single team', updated: '3w ago' },
};

const SEED_REVIEWS: Array<{
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  body: string;
  daysAgo: number;
}> = [
  { id: 'seed-rev-1', authorName: 'Lena Park', authorInitials: 'LP', rating: 5, body: 'Saved me a full week on the launch brief. The templates are tight and the examples actually match real client work.', daysAgo: 4 },
  { id: 'seed-rev-2', authorName: 'Marcus Reed', authorInitials: 'MR', rating: 4, body: 'Solid pack. Wish there were more Notion templates, but the spreadsheets alone are worth the price.', daysAgo: 12 },
];

const SEED_QUESTIONS: Array<{
  id: string;
  askerName: string;
  askerInitials: string;
  body: string;
  daysAgo: number;
  answers: Array<{ authorName: string; authorInitials: string; body: string; daysAgo: number }>;
}> = [
  {
    id: 'seed-q-1',
    askerName: 'Priya Shah',
    askerInitials: 'PS',
    body: 'Does the launch checklist include pricing experiments or is it strictly sequencing?',
    daysAgo: 6,
    answers: [
      { authorName: 'Team DownloadPort', authorInitials: 'DP', body: 'It includes a pricing-variant section near the bottom — three experiment templates plus a guardrail sheet.', daysAgo: 5 },
    ],
  },
  {
    id: 'seed-q-2',
    askerName: 'Diego Alvarez',
    askerInitials: 'DA',
    body: 'Is this licensed for agency use across multiple client teams?',
    daysAgo: 14,
    answers: [],
  },
];

function getDetail(slug: string) {
  return DETAILS[slug] ?? { title: slug, price: '—', files: ['Replace with your real files.'], license: 'Replace with your license terms.', updated: '—' };
}

function relTime(daysAgo: number): string {
  const now = Date.now();
  const t = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(t).toISOString();
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? 'unknown';

  let reviewRows: Array<{
    id: string;
    authorName: string;
    authorInitials: string;
    rating: number;
    body: string;
    createdAt: Date | null;
  }> = [];
  let questionRows: Array<{
    id: string;
    askerName: string;
    askerInitials: string;
    body: string;
    createdAt: Date | null;
  }> = [];

  try {
    reviewRows = await db
      .select({
        id: ugcReviews.id,
        authorName: ugcReviews.authorName,
        authorInitials: ugcReviews.authorInitials,
        rating: ugcReviews.rating,
        body: ugcReviews.body,
        createdAt: ugcReviews.createdAt,
      })
      .from(ugcReviews)
      .where(and(eq(ugcReviews.contextKind, 'bundle'), eq(ugcReviews.contextSlug, id)))
      .orderBy(desc(ugcReviews.createdAt));
  } catch {
    reviewRows = [];
  }

  try {
    questionRows = await db
      .select({
        id: ugcQuestions.id,
        askerName: ugcQuestions.askerName,
        askerInitials: ugcQuestions.askerInitials,
        body: ugcQuestions.body,
        createdAt: ugcQuestions.createdAt,
      })
      .from(ugcQuestions)
      .where(eq(ugcQuestions.courseSlug, id))
      .orderBy(asc(ugcQuestions.createdAt));
  } catch {
    questionRows = [];
  }

  const questionIds = questionRows.map(q => q.id);
  let answerRows: Array<{ id: string; questionId: string; authorName: string; authorInitials: string; body: string; createdAt: Date | null }> = [];
  if (questionIds.length > 0) {
    try {
      answerRows = await db
        .select({
          id: ugcAnswers.id,
          questionId: ugcAnswers.questionId,
          authorName: ugcAnswers.authorName,
          authorInitials: ugcAnswers.authorInitials,
          body: ugcAnswers.body,
          createdAt: ugcAnswers.createdAt,
        })
        .from(ugcAnswers)
        .where(inArray(ugcAnswers.questionId, questionIds))
        .orderBy(asc(ugcAnswers.createdAt));
    } catch {
      answerRows = [];
    }
  }

  const hasReviews = reviewRows.length > 0;
  const hasQuestions = questionRows.length > 0;

  const reviews = hasReviews
    ? reviewRows.map(r => ({
        id: r.id,
        authorName: r.authorName,
        authorInitials: r.authorInitials,
        rating: r.rating,
        body: r.body,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
      }))
    : SEED_REVIEWS.map(s => ({
        id: s.id,
        authorName: s.authorName,
        authorInitials: s.authorInitials,
        rating: s.rating,
        body: s.body,
        createdAt: relTime(s.daysAgo),
      }));

  const questions = hasQuestions
    ? questionRows.map(q => {
        const ans = answerRows
          .filter(a => a.questionId === q.id)
          .map(a => ({
            id: a.id,
            authorName: a.authorName,
            authorInitials: a.authorInitials,
            body: a.body,
            createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
          }));
        return {
          id: q.id,
          askerName: q.askerName,
          askerInitials: q.askerInitials,
          body: q.body,
          createdAt: q.createdAt ? q.createdAt.toISOString() : new Date().toISOString(),
          answers: ans,
        };
      })
    : SEED_QUESTIONS.map(s => ({
        id: s.id,
        askerName: s.askerName,
        askerInitials: s.askerInitials,
        body: s.body,
        createdAt: relTime(s.daysAgo),
        answers: s.answers.map((a, i) => ({
          id: `${s.id}-seed-a-${i}`,
          authorName: a.authorName,
          authorInitials: a.authorInitials,
          body: a.body,
          createdAt: relTime(a.daysAgo),
        })),
      }));

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return json({
    user,
    id,
    ...getDetail(id),
    reviews,
    questions,
    avgRating,
  });
}

export default function BundleDetail() {
  const data = useLoaderData<typeof loader>();
  const { user, id, title, price, files, license, updated, reviews, questions, avgRating } = data;
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d?.authenticated ? setClientUser(d.user) : setClientUser(null)))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } finally { navigate('/?signedOut=1', { replace: true }); }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Bundle · ${id}`}
          title={title}
          description={`${license} · updated ${updated}`}
          back={{ href: '/library', label: 'All bundles' }}
          trailing={<span className={`text-3xl font-semibold tracking-[-0.04em] ${theme.metricValue}`}>{price}</span>}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-2">
              {files.map((file, i) => (
                <article key={file} className={`flex items-center justify-between gap-3 rounded-2xl p-4 ${i === 0 ? theme.assistantShell : theme.listItemShell}`}>
                  <span className="truncate text-sm font-semibold tracking-tight">{file}</span>
                  <button
                    type="button"
                    className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.secondaryButton}`}
                  >
                    Download
                  </button>
                </article>
              ))}
            </div>
          </div>

          {/* Reviews + Q&A sections */}
          <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <header className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
                <p className="text-xs uppercase tracking-[0.2em] opacity-60">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  {avgRating > 0 ? ` · avg ${avgRating.toFixed(1)} / 5` : ''}
                </p>
              </div>
              {avgRating > 0 ? (
                <ReviewStars value={Math.round(avgRating)} showValue />
              ) : null}
            </header>

            <Composer
              action="/api/ugc/review-bundle"
              hidden={{ bundleSlug: id, rating: '5' }}
              submitLabel="Post review"
              placeholder="What did you think of this bundle?"
            />

            <div className="flex flex-col gap-3">
              {reviews.map(r => (
                <article key={r.id} className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.listItemShell}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                      >
                        {r.authorInitials}
                      </span>
                      <span className="text-sm font-semibold tracking-tight">{r.authorName}</span>
                    </div>
                    <ReviewStars value={r.rating} size="sm" />
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{r.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <header className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight">Questions & answers</h2>
              <p className="text-xs uppercase tracking-[0.2em] opacity-60">
                {questions.length} {questions.length === 1 ? 'question' : 'questions'}
              </p>
            </header>

            <Composer
              action="/api/ugc/question-bundle"
              hidden={{ bundleSlug: id }}
              submitLabel="Ask question"
              placeholder="Ask the team a question…"
            />

            <div className="flex flex-col gap-3">
              {questions.map(q => (
                <article key={q.id} className={`flex flex-col gap-3 rounded-2xl p-4 ${theme.listItemShell}`}>
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                    >
                      {q.askerInitials}
                    </span>
                    <span className="text-sm font-semibold tracking-tight">{q.askerName}</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">asked</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{q.body}</p>

                  {q.answers.length > 0 ? (
                    <ul className="flex flex-col gap-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                      {q.answers.map(a => (
                        <li key={a.id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              aria-hidden
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                            >
                              {a.authorInitials}
                            </span>
                            <span className="text-xs font-semibold tracking-tight">{a.authorName}</span>
                            <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">replied</span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{a.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <Composer
                    action="/api/ugc/answer-bundle"
                    hidden={{ questionId: q.id }}
                    submitLabel="Post answer"
                    placeholder="Share what you know…"
                    minRows={2}
                  />
                </article>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/library" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> All bundles
            </Link>
            <Link to="/pricing" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Open pricing
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
