import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

export const REACTION_EMOJIS = ["👍", "❤️", "🎯", "🔥", "💡"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

interface ReactionsProps {
  postId: string;
  reactions: Record<string, number>;
  reactedByCurrentUser?: string[];
  /** Action endpoint for toggling a reaction. Defaults to /api/ugc/react. */
  action?: string;
}

export function Reactions({
  postId,
  reactions,
  reactedByCurrentUser = [],
  action = "/api/ugc/react",
}: ReactionsProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const fetcher = useFetcher<{ ok: boolean; reactions: Record<string, number> }>();

  // Optimistic counts while the fetcher is submitting
  const optimistic = fetcher.formData
    ? Object.fromEntries(
        REACTION_EMOJIS.map(emoji => [
          emoji,
          (reactions[emoji] ?? 0) + (reactedByCurrentUser.includes(emoji) ? -1 : 1),
        ]),
      )
    : (fetcher.data?.reactions ?? reactions);
  const optimisticActive: string[] = fetcher.formData
    ? (() => {
        const clicked = String(fetcher.formData.get("emoji") ?? "");
        return reactedByCurrentUser.includes(clicked)
          ? reactedByCurrentUser.filter(e => e !== clicked)
          : [...reactedByCurrentUser, clicked];
      })()
    : reactedByCurrentUser;

  // Pop animation key — increments each click; re-keys the count element to retrigger animation
  const [popKey, setPopKey] = useState(0);
  useEffect(() => {
    if (fetcher.state === "submitting") setPopKey(k => k + 1);
  }, [fetcher.state]);

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Reactions">
      {REACTION_EMOJIS.map(emoji => {
        const count = optimistic[emoji] ?? 0;
        const active = optimisticActive.includes(emoji);
        return (
          <fetcher.Form
            method="post"
            action={action}
            key={emoji}
            className="contents"
          >
            <input type="hidden" name="postId" value={postId} />
            <input type="hidden" name="emoji" value={emoji} />
            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className={`group/emoji inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-all duration-150 motion-safe:active:scale-95 motion-safe:hover:scale-105 disabled:cursor-wait ${
                active
                  ? `${theme.eyebrow} border-current motion-safe:animate-[ugc-pulse-soft_0.4s_ease-out]`
                  : `border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60`
              }`}
              aria-pressed={active}
              aria-label={`React with ${emoji}`}
            >
              <span className="transition-transform duration-200 motion-safe:group-hover/emoji:scale-110">{emoji}</span>
              <span
                key={popKey}
                className="min-w-[0.6rem] text-center text-[11px] font-semibold tabular-nums motion-safe:animate-[ugc-count-bounce_0.3s_ease-out]"
              >
                {count > 0 ? count : " "}
              </span>
              {active ? (
                <span aria-hidden className="-ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
              ) : null}
            </button>
          </fetcher.Form>
        );
      })}
    </div>
  );
}
