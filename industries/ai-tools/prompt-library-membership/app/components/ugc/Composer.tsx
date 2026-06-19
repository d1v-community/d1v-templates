import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

interface ComposerProps {
  /** Action endpoint for posting new content. */
  action: string;
  /** Hidden fields injected into the form. */
  hidden?: Record<string, string>;
  /** Label shown next to the submit button. */
  submitLabel?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Optional minimum rows. */
  minRows?: number;
  /** Optional callback fired after a successful submit. */
  onPosted?: () => void;
}

export function Composer({ action, hidden = {}, submitLabel = "Post", placeholder = "Share an update…", minRows = 4, onPosted }: ComposerProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const [body, setBody] = useState("");
  // "Just posted" state — shows ✓ for 1.2s after a successful submit
  const [justPosted, setJustPosted] = useState(false);

  useEffect(() => {
    const formData = navigation.formData;
    if (navigation.state === "idle" && formData && formData.get("body")) {
      setJustPosted(true);
      const t = window.setTimeout(() => {
        setBody("");
        formRef.current?.reset();
        setJustPosted(false);
        onPosted?.();
      }, 1200);
      return () => window.clearTimeout(t);
    }
  }, [navigation.state, navigation.formData, onPosted]);

  const isSubmitting = navigation.state === "submitting";
  const count = body.length;
  const countTone = count >= 950 ? "text-rose-600" : count >= 800 ? "text-amber-600" : "opacity-60";
  const canSubmit = !isSubmitting && body.trim().length > 0;

  return (
    <Form
      ref={formRef}
      method="post"
      action={action}
      className={`flex flex-col gap-3 rounded-3xl p-5 sm:p-6 motion-safe:focus-within:shadow-md transition-all duration-300 ${theme.sectionShell} ${
        justPosted ? "motion-safe:animate-[ugc-success-pulse_1.2s_ease-out]" : ""
      }`}
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
        rows={minRows}
        placeholder={placeholder}
        aria-label="Post body"
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 motion-safe:focus-within:shadow-sm ${theme.assistantInput}`}
      />
      <div className={`flex items-center justify-between text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 ${countTone}`}>
        <span>
          <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600">⌘</kbd>
          {" + "}
          <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] dark:border-slate-600">Enter</kbd>
          {" to post · "}
          {count}/1000
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className={`inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 motion-safe:active:scale-95 motion-safe:hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:motion-safe:hover:shadow-none ${theme.primaryButton}`}
        >
          {justPosted ? (
            <>
              <span aria-hidden className="motion-safe:animate-[ugc-scale-pop_0.5s_ease-out]">✓</span>
              Posted!
            </>
          ) : isSubmitting ? (
            <>
              <span aria-hidden className="inline-block h-3 w-3 motion-safe:animate-[ugc-spin_0.8s_linear_infinite] rounded-full border-2 border-current border-r-transparent" />
              Posting…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </Form>
  );
}
