import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

export interface CommentEntry {
  id: string;
  authorName: string;
  authorInitials: string;
  body: string;
  createdAt: string;
}

interface CommentThreadProps {
  comments: CommentEntry[];
  /** Action endpoint for posting a new comment. Defaults to /api/ugc/comment. */
  action?: string;
  /** Hidden fields injected into the new-comment form (e.g. {postId, requestId}). */
  hidden?: Record<string, string>;
  /** Optional prompt placeholder text. */
  placeholder?: string;
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function CommentThread({ comments, action = "/api/ugc/comment", hidden = {}, placeholder = "Reply with markdown…" }: CommentThreadProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const [body, setBody] = useState("");

  useEffect(() => {
    const formData = navigation.formData;
    if (navigation.state === "idle" && formData && formData.get("body")) {
      // Submission finished; clear the field with a small delay so the user sees the value reset
      const t = window.setTimeout(() => {
        setBody("");
        formRef.current?.reset();
      }, 50);
      return () => window.clearTimeout(t);
    }
  }, [navigation.state, navigation.formData]);

  const isSubmitting = navigation.state === "submitting";
  const count = body.length;
  const countTone = count >= 950 ? "text-rose-600" : count >= 800 ? "text-amber-600" : "opacity-60";

  return (
    <div className="flex flex-col gap-3">
      {comments.length > 0 ? (
        <ul className="flex flex-col gap-2" aria-live="polite">
          {comments.map((comment, index) => (
            <li
              key={comment.id}
              className={`flex flex-col gap-1.5 rounded-2xl p-4 motion-safe:animate-[ugc-slide-up_0.25s_ease-out_both] ${theme.listItemShell}`}
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.2em] opacity-70">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                  >
                    {comment.authorInitials}
                  </span>
                  <span className="text-xs font-semibold tracking-tight normal-case opacity-100">
                    {comment.authorName}
                  </span>
                </span>
                <span title={comment.createdAt}>{formatRelative(comment.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{comment.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 text-sm leading-relaxed opacity-60 motion-safe:animate-[ugc-fade-in_0.4s_ease-out]">
          <span aria-hidden>💬</span> Be the first to reply.
        </p>
      )}

      <Form
        ref={formRef}
        method="post"
        action={action}
        className="flex flex-col gap-2"
        aria-label="Post a reply"
      >
        {Object.entries(hidden).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <textarea
          name="body"
          required
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
            }
          }}
          maxLength={1000}
          rows={3}
          placeholder={placeholder}
          aria-label="Reply body"
          className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 motion-safe:focus-within:shadow-sm ${theme.assistantInput}`}
        />
        <div className={`flex items-center justify-between text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 ${countTone}`}>
          <span><kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600">⌘</kbd> + <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600">Enter</kbd> to post · {count}/1000</span>
          <button
            type="submit"
            disabled={isSubmitting || body.trim().length === 0}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 motion-safe:active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${theme.primaryButton}`}
          >
            {isSubmitting ? (
              <>
                <span aria-hidden className="inline-block h-3 w-3 motion-safe:animate-[ugc-spin_0.8s_linear_infinite] rounded-full border-2 border-current border-r-transparent" />
                Posting…
              </>
            ) : (
              "Post reply"
            )}
          </button>
        </div>
      </Form>
    </div>
  );
}
