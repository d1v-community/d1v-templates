import { json, type ActionFunctionArgs } from "@remix-run/node";
import { eq, sql } from "drizzle-orm";

import { db } from "~/db/db.server";
import { ugcAnswers, ugcQuestions } from "~/db/schema";
import { requireUserOrRedirect } from "~/lib/auth-flow";

const MAX_BODY = 1000;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }

  const user = await requireUserOrRedirect(request);

  const formData = await request.formData();
  const questionId = (formData.get("questionId") ?? "").toString().trim();
  const rawBody = (formData.get("body") ?? "").toString();

  const body = rawBody.trim().slice(0, MAX_BODY);

  if (!questionId) {
    return json({ ok: false, error: "questionId is required" }, { status: 400 });
  }
  if (!body) {
    return json({ ok: false, error: "body is required" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcAnswers).values({
    id,
    questionId,
    authorName,
    authorInitials: initialsFromName(authorName),
    body,
    upvotes: 0,
    isAccepted: "false",
  });

  await db
    .update(ugcQuestions)
    .set({ answerCount: sql`${ugcQuestions.answerCount} + 1` })
    .where(eq(ugcQuestions.id, questionId));

  return json({ ok: true, id });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcAnswerBundleRoute = true;
