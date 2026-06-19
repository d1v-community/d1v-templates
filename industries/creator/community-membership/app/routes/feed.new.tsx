import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Composer } from "~/components/ugc/Composer";
import { db } from "~/db/db.server";
import { ugcPosts } from "~/db/schema";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `New post · Feed · ${APP_TITLE}` },
  { name: "description", content: "Share an update with the member feed." },
];

function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "M";
  return trimmed.charAt(0).toUpperCase();
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
  const user = await requireUserOrRedirect(request);
  const formData = await request.formData();
  const rawBody = formData.get("body");
  const body = typeof rawBody === "string" ? rawBody.trim() : "";

  if (body.length === 0) {
    return json({ ok: false, error: "Body is required" }, { status: 400 });
  }
  if (body.length > 1000) {
    return json({ ok: false, error: "Body exceeds 1000 characters" }, { status: 400 });
  }

  const authorName = user.displayName ?? user.username ?? user.email ?? "Member";
  const authorInitials = initialsFromName(authorName);
  const postId = `p-${Date.now()}`;

  try {
    await db.insert(ugcPosts).values({
      id: postId,
      appUserId: user.id,
      authorName,
      authorInitials,
      body,
      contextKind: "feed",
      reactions: "{}",
      commentCount: 0,
    });
  } catch (error) {
    console.error("Failed to insert feed post:", error);
    return json({ ok: false, error: "Failed to save post" }, { status: 500 });
  }

  return redirect("/feed");
}

export default function FeedNew() {
  useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}`}
        >
          New post
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Share with the circle</h2>
        <p className={`text-sm leading-relaxed ${theme.body}`}>
          Plain text only. Posts land in the member feed and are visible to anyone with access.
        </p>
      </div>

      <Composer
        action="/feed/new"
        submitLabel="Post to feed"
        placeholder="What's on your mind this week?"
      />
    </div>
  );
}