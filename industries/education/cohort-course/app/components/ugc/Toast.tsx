import { useEffect, useState } from "react";

export type ToastKind = "success" | "error" | "info";

interface ToastProps {
  /** When true, the toast appears. */
  active: boolean;
  message: string;
  kind?: ToastKind;
  /** Auto-dismiss after this many ms. Default 3000. */
  duration?: number;
  /** Optional callback fired when the toast dismisses. */
  onDismiss?: () => void;
}

const KIND_CLASSES: Record<ToastKind, { bg: string; text: string; ring: string; icon: string }> = {
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60",
    text: "text-emerald-900 dark:text-emerald-100",
    ring: "focus-visible:ring-emerald-400",
    icon: "✓",
  },
  error: {
    bg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60",
    text: "text-rose-900 dark:text-rose-100",
    ring: "focus-visible:ring-rose-400",
    icon: "!",
  },
  info: {
    bg: "bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-900/60",
    text: "text-sky-900 dark:text-sky-100",
    ring: "focus-visible:ring-sky-400",
    icon: "i",
  },
};

export function Toast({ active, message, kind = "success", duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const classes = KIND_CLASSES[kind];

  useEffect(() => {
    if (!active) {
      setVisible(false);
      setExiting(false);
      return;
    }
    setVisible(true);
    setExiting(false);
    const exitTimer = window.setTimeout(() => setExiting(true), duration);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration + 200);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [active, duration, onDismiss]);

  if (!visible) return null;

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-200 ${
        exiting ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div
        className={`pointer-events-auto inline-flex max-w-sm items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur motion-safe:animate-[ugc-toast-in_0.25s_ease-out] ${classes.bg} ${classes.text} ${classes.ring}`}
      >
        <span
          aria-hidden
          className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-current/10 text-[12px] font-bold"
        >
          {classes.icon}
        </span>
        <span className="truncate">{message}</span>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            setExiting(true);
            window.setTimeout(() => {
              setVisible(false);
              onDismiss?.();
            }, 200);
          }}
          className="ml-1 rounded-full p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </div>
  );
}
