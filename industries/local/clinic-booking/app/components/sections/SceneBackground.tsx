import type { CSSProperties } from "react";

import { getSiteThemeClasses, type SiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

type SceneKind = "console" | "catalog" | "kanban" | "metrics" | "storefront" | "countdown" | "club" | "issue" | "cohort" | "library" | "schedule" | "fitness";

export interface SceneBackgroundProps {
  kind: SceneKind;
  className?: string;
  style?: CSSProperties;
}

const SCENE_PRESETS: Record<SceneKind, (theme: SiteThemeClasses) => string> = {
  console: () =>
    "bg-[linear-gradient(120deg,rgba(34,211,238,0.18),rgba(14,165,233,0.06)_40%,rgba(15,23,42,0)_70%),radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.16),transparent_24%)]",
  catalog: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(20,184,166,0.18),transparent_24%),linear-gradient(180deg,rgba(255,251,235,0.4),rgba(255,255,255,0))]",
  kanban: () =>
    "bg-[linear-gradient(135deg,rgba(100,116,139,0.18),rgba(15,23,42,0)_60%),radial-gradient(circle_at_20%_10%,rgba(148,163,184,0.24),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(71,85,105,0.18),transparent_24%)]",
  metrics: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0)),repeating-linear-gradient(0deg,rgba(15,23,42,0.04)_0,rgba(15,23,42,0.04)_1px,transparent_1px,transparent_32px),repeating-linear-gradient(90deg,rgba(15,23,42,0.04)_0,rgba(15,23,42,0.04)_1px,transparent_1px,transparent_32px)]",
  storefront: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(217,119,6,0.18),transparent_24%),linear-gradient(180deg,rgba(255,251,235,0.5),rgba(255,255,255,0))]",
  countdown: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.22),transparent_30%),linear-gradient(135deg,rgba(127,29,29,0.18),rgba(15,23,42,0)_60%),radial-gradient(circle_at_85%_15%,rgba(251,113,133,0.18),transparent_24%)]",
  club: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.22),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(244,114,182,0.18),transparent_22%),linear-gradient(180deg,rgba(255,241,242,0.4),rgba(255,255,255,0))]",
  issue: () =>
    "bg-[linear-gradient(180deg,rgba(255,251,235,0.6),rgba(255,255,255,0)),radial-gradient(circle_at_top_left,rgba(180,83,9,0.18),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(217,119,6,0.14),transparent_22%)]",
  cohort: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_28%),linear-gradient(180deg,rgba(236,253,245,0.5),rgba(255,255,255,0))]",
  library: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_88%_20%,rgba(2,132,199,0.16),transparent_24%),linear-gradient(180deg,rgba(239,246,255,0.4),rgba(255,255,255,0))]",
  schedule: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_28%),linear-gradient(180deg,rgba(239,246,255,0.5),rgba(255,255,255,0))]",
  fitness: () =>
    "bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.22),transparent_28%),linear-gradient(135deg,rgba(124,45,18,0.16),rgba(15,23,42,0)_60%)]",
};

const SCENE_PATTERN: Record<SceneKind, JSX.Element> = {
  console: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.5">
      <path d="M0 60 H1200 M0 120 H1200 M0 180 H1200 M0 240 H1200 M0 300 H1200 M0 360 H1200 M0 420 H1200" />
      <path d="M60 0 V480 M180 0 V480 M300 0 V480 M420 0 V480 M540 0 V480 M660 0 V480 M780 0 V480 M900 0 V480 M1020 0 V480 M1140 0 V480" />
    </g>
  ),
  catalog: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.45">
      <rect x="40" y="40" width="160" height="220" rx="14" />
      <rect x="220" y="40" width="160" height="220" rx="14" />
      <rect x="400" y="40" width="160" height="220" rx="14" />
      <rect x="580" y="40" width="160" height="220" rx="14" />
      <rect x="760" y="40" width="160" height="220" rx="14" />
      <rect x="940" y="40" width="160" height="220" rx="14" />
    </g>
  ),
  kanban: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4">
      <rect x="40" y="40" width="260" height="400" rx="14" />
      <rect x="320" y="40" width="260" height="400" rx="14" />
      <rect x="600" y="40" width="260" height="400" rx="14" />
      <rect x="880" y="40" width="260" height="400" rx="14" />
      <path d="M40 180 H300 M320 180 H580 M600 240 H860 M880 240 H1140" />
    </g>
  ),
  metrics: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5">
      <path d="M0 320 L120 280 L240 220 L360 240 L480 160 L600 200 L720 120 L840 160 L960 100 L1080 140 L1200 80" />
      <path d="M0 380 L120 360 L240 320 L360 300 L480 280 L600 240 L720 220 L840 200 L960 180 L1080 160 L1200 120" opacity="0.6" />
    </g>
  ),
  storefront: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.45">
      <path d="M0 120 L120 120 L120 0 L260 0 L260 200 L400 200" />
      <path d="M520 0 L640 0 L640 180 L780 180" />
      <path d="M880 60 L1020 60 L1020 240 L1160 240" />
    </g>
  ),
  countdown: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.55">
      <circle cx="600" cy="240" r="180" />
      <circle cx="600" cy="240" r="120" />
      <circle cx="600" cy="240" r="60" />
      <path d="M600 60 V420 M420 240 H780" />
    </g>
  ),
  club: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.45">
      <circle cx="200" cy="240" r="80" />
      <circle cx="360" cy="240" r="80" />
      <circle cx="520" cy="240" r="80" />
      <circle cx="680" cy="240" r="80" />
      <circle cx="840" cy="240" r="80" />
      <circle cx="1000" cy="240" r="80" />
    </g>
  ),
  issue: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5">
      <path d="M80 0 V480 M620 0 V480" />
      <path d="M120 80 H580 M120 140 H580 M120 200 H580 M120 260 H580 M120 320 H580" />
      <path d="M660 80 H1120 M660 140 H1120 M660 200 H1120" />
    </g>
  ),
  cohort: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5">
      <path d="M60 240 H1140" />
      <circle cx="100" cy="240" r="14" />
      <circle cx="240" cy="240" r="14" />
      <circle cx="380" cy="240" r="14" />
      <circle cx="520" cy="240" r="14" />
      <circle cx="660" cy="240" r="14" />
      <circle cx="800" cy="240" r="14" />
      <circle cx="940" cy="240" r="14" />
      <circle cx="1080" cy="240" r="14" />
    </g>
  ),
  library: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4">
      <path d="M0 60 H1200 M0 120 H1200 M0 180 H1200 M0 240 H1200 M0 300 H1200 M0 360 H1200 M0 420 H1200" />
      <rect x="80" y="100" width="60" height="200" rx="6" />
      <rect x="160" y="60" width="60" height="280" rx="6" />
      <rect x="240" y="120" width="60" height="160" rx="6" />
      <rect x="320" y="80" width="60" height="240" rx="6" />
      <rect x="400" y="100" width="60" height="200" rx="6" />
      <rect x="480" y="40" width="60" height="320" rx="6" />
    </g>
  ),
  schedule: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.45">
      <rect x="40" y="40" width="1120" height="400" rx="14" />
      <path d="M40 140 H1160 M40 220 H1160 M40 300 H1160 M40 380 H1160" />
      <path d="M200 40 V440 M360 40 V440 M520 40 V440 M680 40 V440 M840 40 V440 M1000 40 V440" />
    </g>
  ),
  fitness: (
    <g aria-hidden="true" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5">
      <path d="M0 320 L100 200 L200 280 L300 180 L400 260 L500 160 L600 240 L700 140 L800 220 L900 120 L1000 200 L1100 100 L1200 180" />
    </g>
  ),
};

export function SceneBackground({ kind, className, style }: SceneBackgroundProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const preset = SCENE_PRESETS[kind](theme);
  const pattern = SCENE_PATTERN[kind];

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute inset-0 -z-10",
        preset,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <svg
        className="absolute inset-0 h-full w-full text-slate-900/40 dark:text-white/10"
        viewBox="0 0 1200 480"
        preserveAspectRatio="none"
      >
        {pattern}
      </svg>
      <div className="absolute inset-x-0 top-0 h-40 bg-white/10 blur-3xl motion-safe:animate-pulse dark:bg-white/5" />
    </div>
  );
}
