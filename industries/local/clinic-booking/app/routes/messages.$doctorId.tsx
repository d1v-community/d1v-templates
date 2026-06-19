import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { asc, eq } from "drizzle-orm";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { PageHeader } from "~/components/sections/PageHeader";
import { CommentThread, type CommentEntry } from "~/components/ugc/CommentThread";
import { db } from "~/db/db.server";
import { ugcMessages } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = ({ params }) => [
  { title: `Messages · ${params.doctorId ?? ""} · ${APP_TITLE}` },
  { name: "description", content: "Single message thread." },
];

const DOCTOR_NAMES: Record<string, string> = {
  "dr-okafor": "Dr. Okafor",
  "dr-lin": "Dr. Lin",
  "dr-park": "Dr. Park",
  "dr-singh": "Dr. Singh",
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const doctorId = params.doctorId ?? "";

  let messages: CommentEntry[] = [];
  try {
    const rows = await db
      .select()
      .from(ugcMessages)
      .where(eq(ugcMessages.doctorId, doctorId))
      .orderBy(asc(ugcMessages.createdAt));
    messages = rows.map(r => ({
      id: r.id,
      authorName: r.authorName,
      authorInitials: r.authorInitials,
      body: r.body,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt ?? ""),
    }));
  } catch (error) {
    console.error("Failed to load messages:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    doctorId,
    doctorName: DOCTOR_NAMES[doctorId] ?? doctorId,
    messages,
  });
}

export default function MessageThreadRoute() {
  const { user, doctorId, doctorName, messages } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user as AppHeaderUser} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Messages"
          title={doctorName}
          description={`Direct thread with ${doctorName}.`}
          back={{ href: "/messages", label: "Inbox" }}
        />

        <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <CommentThread
            comments={messages}
            action="/api/ugc/message-doctor"
            hidden={{ doctorId }}
            placeholder={`Message ${doctorName}…`}
          />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}