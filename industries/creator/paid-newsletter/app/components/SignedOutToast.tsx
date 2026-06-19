import { useEffect, useState } from "react";

interface SignedOutToastProps {
  active: boolean;
  message?: string;
  /** Auto-dismiss after this many ms. Default 3000. */
  duration?: number;
}

export function SignedOutToast({
  active,
  message = "You've been signed out. See you next time.",
  duration = 3000,
}: SignedOutToastProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      setExiting(false);
      return;
    }
    setVisible(true);
    setExiting(false);
    const exitTimer = window.setTimeout(() => setExiting(true), duration);
    const hideTimer = window.setTimeout(() => setVisible(false), duration + 200);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [active, duration]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-200 ${
        exiting ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
          ✓
        </span>
        {message}
      </div>
    </div>
  );
}
