import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { PageHeader } from "~/components/sections/PageHeader";
import { Composer } from "~/components/ugc/Composer";
import { db } from "~/db/db.server";
import { ugcSubmissions } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";
import { getUserFromRequest } from "~/utils/auth.server";

export const meta: MetaFunction = ({ params }) => [
  { title: `Submit week ${params.n ?? ""} · ${APP_TITLE}` },
  { name: "description", content: "Submit your weekly deliverable for peer review." },
];

const MAX_BODY = 1000;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const n = Number.parseInt(params.n ?? "0", 10);
  if (!Number.isFinite(n) || n < 1 || n > 8) {
    throw new Response("Invalid week", { status: 404 });
  }
  return json({ user, n });
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
  const n = Number.parseInt(params.n ?? "0", 10);
  if (!Number.isFinite(n) || n < 1 || n > 8) {
    return json({ fieldErrors: { body: "Invalid week" } }, { status: 404 });
  }

  const formData = await request.formData();
  const rawBody = (formData.get("body") ?? "").toString();
  const body = rawBody.trim().slice(0, MAX_BODY);

  if (!body) {
    return json({ fieldErrors: { body: "Notes are required" } }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `s-${Date.now()}`;

  await db.insert(ugcSubmissions).values({
    id,
    weekN: n,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    body,
    status: "submitted",
    reviewCount: 0,
  });

  return redirect(`/weeks/${n}`);
}

export default function SubmitWeekRoute() {
  const { user, n } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);

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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Week ${n} · Submit deliverable`}
          title={`Submit week ${n}`}
          description="Share your deliverable notes. After you submit, peers will be able to review and rate your work."
          back={{ href: `/weeks/${n}`, label: `Back to week ${n}` }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-5">
          <Composer
            action={`/weeks/${n}/submit`}
            placeholder="Write your deliverable notes (markdown ok, max 1000 chars)…"
            submitLabel="Submit deliverable"
            minRows={6}
          />
          {actionData?.fieldErrors?.body ? (
            <p className="text-xs text-rose-500">{actionData.fieldErrors.body}</p>
          ) : null}
          <p className={`text-xs leading-relaxed ${theme.sectionText} opacity-70`}>
            Submissions are plain text. File uploads are not supported in this view — link out to your repo or doc instead.
          </p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
