import { json, type ActionFunctionArgs } from "@remix-run/node";

import { db } from "~/db/db.server";
import { ugcQuestions } from "~/db/schema";
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
  const courseSlug = (formData.get("courseSlug") ?? "").toString().trim();
  const lessonId = (formData.get("lessonId") ?? "").toString().trim();
  const rawBody = (formData.get("body") ?? "").toString();
  const body = rawBody.trim().slice(0, MAX_BODY);

  if (!courseSlug) {
    return json({ ok: false, error: "courseSlug is required" }, { status: 400 });
  }
  if (!body) {
    return json({ ok: false, error: "body is required" }, { status: 400 });
  }

  const askerName = user.displayName || user.username || "Student";
  const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcQuestions).values({
    id,
    courseSlug,
    lessonId: lessonId || null,
    askerName,
    askerInitials: initialsFromName(askerName),
    body,
    answerCount: 0,
  });

  return json({ ok: true, id });
}

export async function loader() {
  return json({ ok: false, error: "POST only" }, { status: 405 });
}

export const __ugcQuestionRoute = true;