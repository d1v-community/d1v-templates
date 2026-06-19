import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { PageHeader } from "~/components/sections/PageHeader";
import { db } from "~/db/db.server";
import { ugcPackSubmissions } from "~/db/schema";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Submit a pack · ${SITE_CONFIG.appTitle}` },
  { name: "description", content: "Submit a new prompt pack for review." },
];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, { status: 405 });
  }
  const user = await requireUserOrRedirect(request);
  const formData = await request.formData();
  const name = (formData.get("name") ?? "").toString().trim();
  const workflow = (formData.get("workflow") ?? "").toString().trim();
  const content = (formData.get("content") ?? "").toString().trim().slice(0, 4000);

  if (!name) {
    return json({ ok: false, error: "name is required" }, { status: 400 });
  }
  if (!workflow) {
    return json({ ok: false, error: "workflow is required" }, { status: 400 });
  }
  if (!content) {
    return json({ ok: false, error: "content is required" }, { status: 400 });
  }

  const authorName = user.displayName || user.username || "Member";
  const id = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await db.insert(ugcPackSubmissions).values({
    id,
    appUserId: user.id,
    authorName,
    authorInitials: initialsFromName(authorName),
    name,
    workflow,
    content,
    status: "pending",
  });

  return redirect("/catalog");
}

export default function SubmitPackRoute() {
  const { user } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Submit"
          title="Submit a new pack"
          description="Send a draft workflow to the team. Approved packs go into the member catalog."
          back={{ href: "/catalog", label: "Catalog" }}
        />

        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8 lg:px-10 pb-16">
          <Form method="post" className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Pack name</span>
              <input
                name="name"
                required
                maxLength={120}
                placeholder="e.g. Investor Update Kit"
                className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Workflow</span>
              <input
                name="workflow"
                required
                maxLength={60}
                placeholder="Sales / Research / Content…"
                className={`rounded-2xl border px-4 py-2 text-sm outline-none transition ${theme.assistantInput}`}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">Pack content</span>
              <textarea
                name="content"
                required
                rows={10}
                placeholder="Paste your prompts, instructions, and example outputs here."
                className={`rounded-2xl border px-4 py-3 text-sm outline-none transition ${theme.assistantInput}`}
              />
            </label>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-xs font-semibold transition ${theme.primaryButton}`}
              >
                Submit for review
              </button>
            </div>
          </Form>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}