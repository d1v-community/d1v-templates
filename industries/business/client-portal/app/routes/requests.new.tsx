import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { PageHeader } from "~/components/sections/PageHeader";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";
import { getUserFromRequest } from "~/utils/auth.server";

export const meta: MetaFunction = () => [
  { title: `New request · ${APP_TITLE}` },
  { name: "description", content: "Open a new client service request." },
];

const URGENCY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "med", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

type Urgency = (typeof URGENCY_OPTIONS)[number]["value"];

const MAX_SUMMARY = 1000;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUserOrRedirect(request);

  const formData = await request.formData();
  const title = (formData.get("title") ?? "").toString().trim();
  const summary = (formData.get("summary") ?? "").toString().trim().slice(0, MAX_SUMMARY);
  const urgencyRaw = (formData.get("urgency") ?? "med").toString();
  const urgency: Urgency = (URGENCY_OPTIONS.find(o => o.value === urgencyRaw)?.value ?? "med");

  const fieldErrors: { title?: string; summary?: string } = {};
  if (!title) fieldErrors.title = "Title is required";
  if (!summary) fieldErrors.summary = "Summary is required";

  if (Object.keys(fieldErrors).length > 0) {
    return json({ fieldErrors, values: { title, summary, urgency } }, { status: 400 });
  }

  // No DB-backed requests table; mint an id and route to a static detail page.
  const id = `req-${Date.now().toString(36)}`;
  void user;
  return redirect(`/requests/${id}`);
}

export default function NewRequestRoute() {
  const { user } = useLoaderData<typeof loader>();
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
  const initial = actionData?.values;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Service desk"
          title="New request"
          description="Open a new service request. The team will pick it up from the shared board."
          back={{ href: "/requests", label: "All requests" }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16">
          <Form method="post" className={`flex flex-col gap-5 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Title</span>
              <input
                name="title"
                required
                maxLength={120}
                defaultValue={initial?.title ?? ""}
                placeholder="Quarterly onboarding pass"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme.assistantInput}`}
              />
              {actionData?.fieldErrors?.title ? (
                <span className="text-xs text-rose-500">{actionData.fieldErrors.title}</span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Summary</span>
              <textarea
                name="summary"
                required
                rows={4}
                maxLength={MAX_SUMMARY}
                defaultValue={initial?.summary ?? ""}
                placeholder="What needs to happen, who is involved, and any blockers."
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme.assistantInput}`}
              />
              {actionData?.fieldErrors?.summary ? (
                <span className="text-xs text-rose-500">{actionData.fieldErrors.summary}</span>
              ) : null}
            </label>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Urgency</legend>
              <div className="flex flex-wrap gap-2">
                {URGENCY_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold cursor-pointer transition ${
                      (initial?.urgency ?? "med") === opt.value
                        ? `${theme.eyebrow} border-current`
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.value}
                      defaultChecked={(initial?.urgency ?? "med") === opt.value}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>

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
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}
              >
                Open request
              </button>
            </div>
          </Form>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
