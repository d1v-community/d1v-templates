import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { eq, sql } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { PageHeader } from "~/components/sections/PageHeader";
import { db } from "~/db/db.server";
import { ugcPeerReviews, ugcSubmissions } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";
import { getUserFromRequest } from "~/utils/auth.server";

export const meta: MetaFunction = ({ params }) => [
  { title: `Review submission · ${APP_TITLE}` },
  { name: "description", content: "Peer review a cohort submission." },
];

const MAX_BODY = 1000;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const id = params.id ?? "";

  let submission:
    | {
        id: string;
        weekN: number;
        authorName: string;
        authorInitials: string;
        body: string;
        reviewCount: number;
        createdAt: string;
      }
    | null = null;

  try {
    const rows = await db
      .select()
      .from(ugcSubmissions)
      .where(eq(ugcSubmissions.id, id))
      .limit(1);
    if (rows[0]) {
      const row = rows[0];
      submission = {
        id: row.id,
        weekN: row.weekN,
        authorName: row.authorName,
        authorInitials: row.authorInitials,
        body: row.body,
        reviewCount: row.reviewCount,
        createdAt:
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : new Date(row.createdAt as unknown as string).toISOString(),
      };
    }
  } catch (error) {
    console.error("Failed to load submission:", error);
  }

  return json({ user, submission });
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const submissionId = params.id ?? "";

  if (!submissionId) {
    return json({ fieldErrors: { body: "Invalid submission", rating: undefined }, values: { body: "", rating: 0 } }, { status: 404 });
  }

  const formData = await request.formData();
  const rawBody = (formData.get("body") ?? "").toString();
  const body = rawBody.trim().slice(0, MAX_BODY);
  const rating = Math.max(1, Math.min(5, Number.parseInt((formData.get("rating") ?? "0").toString(), 10) || 0));

  const fieldErrors: { body?: string; rating?: string } = {};
  if (!body) fieldErrors.body = "Review body is required";
  if (rating < 1) fieldErrors.rating = "Pick a rating 1-5";
  if (Object.keys(fieldErrors).length > 0) {
    return json({ fieldErrors: { body: fieldErrors.body, rating: fieldErrors.rating }, values: { body, rating } }, { status: 400 });
  }

  // Look up weekN for redirect
  let weekN: number | null = null;
  try {
    const rows = await db
      .select({ weekN: ugcSubmissions.weekN })
      .from(ugcSubmissions)
      .where(eq(ugcSubmissions.id, submissionId))
      .limit(1);
    weekN = rows[0]?.weekN ?? null;
  } catch {
    // ignore; fallback redirect to syllabus
  }

  const reviewerName = user.displayName || user.username || "Reviewer";
  const id = `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcPeerReviews).values({
    id,
    submissionId,
    reviewerName,
    reviewerInitials: initialsFromName(reviewerName),
    rating,
    body,
  });

  await db
    .update(ugcSubmissions)
    .set({ reviewCount: sql`${ugcSubmissions.reviewCount} + 1`, updatedAt: new Date() })
    .where(eq(ugcSubmissions.id, submissionId));

  return redirect(weekN ? `/weeks/${weekN}` : "/syllabus");
}

export default function ReviewSubmissionRoute() {
  const { user, submission } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);
  const [body, setBody] = useState(actionData?.values?.body ?? "");
  const [rating, setRating] = useState<number>(actionData?.values?.rating ?? 0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d?.authenticated ? setClientUser(d.user) : setClientUser(null)))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } finally { navigate("/?signedOut=1", { replace: true }); }
  };

  const effectiveUser = clientUser ?? user;
  const isSubmitting = navigation.state === "submitting";

  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
        <AppHeader user={effectiveUser} onLogout={handleLogout} />
        <main className="flex-1">
          <PageHeader
            eyebrow="Peer review"
            title="Submission not found"
            description="This submission may have been removed or never existed."
            back={{ href: "/syllabus", label: "Syllabus" }}
          />
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Week ${submission.weekN} · Peer review`}
          title={`Review ${submission.authorName}'s submission`}
          description="Share what worked, what to push on, and a 1-5 rating."
          back={{ href: `/weeks/${submission.weekN}`, label: `Back to week ${submission.weekN}` }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-5">
          <article className={`flex flex-col gap-3 rounded-2xl p-5 ${theme.metricShell}`}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}
              >
                {submission.authorInitials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight">{submission.authorName}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">
                  Week {submission.weekN} · {submission.reviewCount} review{submission.reviewCount === 1 ? "" : "s"} so far
                </p>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{submission.body}</p>
          </article>

          <Form method="post" className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <fieldset className="flex flex-col gap-2">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Rating</legend>
              <div className="flex items-center gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`Rate ${n} out of 5`}
                    className="transition hover:scale-110"
                  >
                    <span
                      aria-hidden
                      className={n <= rating ? "text-amber-500" : "text-slate-300 dark:text-slate-700"}
                    >
                      ★
                    </span>
                  </button>
                ))}
                {rating > 0 ? (
                  <span className="ml-2 text-xs font-semibold opacity-70">{rating} / 5</span>
                ) : null}
              </div>
              <input type="hidden" name="rating" value={rating} />
              {actionData?.fieldErrors?.rating ? (
                <span className="text-xs text-rose-500">{actionData.fieldErrors.rating}</span>
              ) : null}
            </fieldset>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Review notes</span>
              <textarea
                name="body"
                required
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={6}
                maxLength={MAX_BODY}
                placeholder="What worked? What would you push on?"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme.assistantInput}`}
              />
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] opacity-60">
                {actionData?.fieldErrors?.body ? (
                  <span className="text-rose-500 normal-case tracking-normal">{actionData.fieldErrors.body}</span>
                ) : <span />}
                <span>{body.length}/1000</span>
              </div>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || body.trim().length === 0 || rating < 1}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.primaryButton}`}
              >
                {isSubmitting ? "Posting…" : "Post review"}
              </button>
            </div>
          </Form>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
