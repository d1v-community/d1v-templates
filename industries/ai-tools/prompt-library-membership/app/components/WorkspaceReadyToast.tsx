import { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { Link } from "@remix-run/react";

import { SITE_CONFIG } from "~/constants/site";

interface WorkspaceReadyToastProps {
  /** Default auto-dismiss duration in ms. */
  duration?: number;
}

/**
 * One-shot toast that fires when a user lands on a page with `?ready=1` in the URL.
 * Cleans up the `ready` param from the URL after the toast exits so deep-links stay
 * canonical. The CTA points at the configured industry home (the workspace the
 * onboarding flow just finished wiring up).
 */
export function WorkspaceReadyToast({ duration = 3000 }: WorkspaceReadyToastProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("ready") === "1";
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const workspaceName = SITE_CONFIG.home.industry.workspaceName;
  const industryHome = SITE_CONFIG.home.industry.homeHref;

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
      // Clean the URL so the toast doesn't re-fire on refresh.
      const next = new URLSearchParams(searchParams);
      next.delete("ready");
      setSearchParams(next, { replace: true });
    }, duration + 200);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [active, duration, searchParams, setSearchParams]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-200 ${
        exiting ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 pl-2 pr-1 py-1.5 text-sm font-medium text-slate-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-100">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[12px] font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
          ✓
        </span>
        <span>Your {workspaceName.toLowerCase()} is ready.</span>
        <Link
          to={industryHome}
          className="ml-1 inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
        >
          Open {workspaceName.toLowerCase()} →
        </Link>
      </div>
    </div>
  );
}
