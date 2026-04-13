import type { SiteThemeFamily } from "~/constants/site";

export type SiteThemeClasses = {
  headerShell: string;
  logo: string;
  navLink: string;
  heroShell: string;
  heroGlow: string;
  heroGrid: string;
  eyebrow: string;
  subEyebrow: string;
  body: string;
  primaryButton: string;
  secondaryButton: string;
  metricShell: string;
  metricValue: string;
  showcaseShell: string;
  sectionShell: string;
  sectionLabel: string;
  sectionText: string;
  emphasis: string;
  listItemShell: string;
  faqShell: string;
  closingShell: string;
  assistantSection: string;
  assistantBadge: string;
  assistantShell: string;
  assistantUserBubble: string;
  assistantAction: string;
  assistantInput: string;
};

const SITE_THEME_CLASSES: Record<SiteThemeFamily, SiteThemeClasses> = {
  ai: {
    headerShell:
      "border-b border-cyan-400/20 bg-slate-950/88 text-white backdrop-blur supports-[backdrop-filter]:bg-slate-950/70",
    logo: "text-cyan-100 hover:text-white",
    navLink: "text-slate-300 hover:text-cyan-100",
    heroShell: "bg-slate-950 text-white",
    heroGlow:
      "bg-[radial-gradient(circle_at_18%_18%,_rgba(34,211,238,0.24),_transparent_28%),radial-gradient(circle_at_82%_22%,_rgba(14,165,233,0.16),_transparent_24%),linear-gradient(180deg,_rgba(15,23,42,0.5),_rgba(2,6,23,0.96))]",
    heroGrid: "lg:grid-cols-[0.94fr_1.06fr]",
    eyebrow:
      "border border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
    subEyebrow: "text-cyan-200",
    body: "text-slate-300",
    primaryButton:
      "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
    secondaryButton:
      "border border-white/15 bg-white/5 text-white hover:bg-white/10",
    metricShell: "border border-white/10 bg-white/5",
    metricValue: "text-cyan-100",
    showcaseShell:
      "border border-white/12 bg-white/6 shadow-[0_32px_120px_rgba(14,165,233,0.16)] backdrop-blur",
    sectionShell: "border border-white/10 bg-white/5",
    sectionLabel: "text-cyan-200",
    sectionText: "text-slate-300",
    emphasis: "text-white",
    listItemShell: "border border-white/10 bg-slate-950/60",
    faqShell: "border border-white/10 bg-slate-950/70",
    closingShell:
      "border border-cyan-300/16 bg-[linear-gradient(135deg,_rgba(8,47,73,0.88),_rgba(15,23,42,0.92))]",
    assistantSection:
      "border-t border-cyan-400/10 bg-[linear-gradient(180deg,_#06131f,_#020617)]",
    assistantBadge:
      "border border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
    assistantShell:
      "border border-cyan-400/12 bg-slate-950/92 shadow-[0_24px_100px_rgba(8,145,178,0.18)]",
    assistantUserBubble: "bg-cyan-300 text-slate-950",
    assistantAction: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
    assistantInput:
      "border-slate-700 bg-slate-950 text-slate-100 focus:border-cyan-400 focus:bg-slate-900 focus:ring-cyan-500/20",
  },
  business: {
    headerShell:
      "border-b border-slate-200 bg-white/92 text-slate-950 backdrop-blur supports-[backdrop-filter]:bg-white/72 dark:border-slate-800 dark:bg-slate-950/84 dark:text-white",
    logo: "text-slate-950 hover:text-slate-700 dark:text-slate-100 dark:hover:text-white",
    navLink: "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
    heroShell: "bg-stone-100 text-slate-950 dark:bg-slate-950 dark:text-white",
    heroGlow:
      "bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(241,245,249,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(71,85,105,0.24),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.9),_rgba(2,6,23,0.98))]",
    heroGrid: "lg:grid-cols-[0.9fr_1.1fr]",
    eyebrow:
      "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
    subEyebrow: "text-slate-600 dark:text-slate-300",
    body: "text-slate-600 dark:text-slate-300",
    primaryButton:
      "bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white",
    secondaryButton:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    metricShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    metricValue: "text-slate-950 dark:text-white",
    showcaseShell:
      "border border-slate-200 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900",
    sectionShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    sectionLabel: "text-slate-500 dark:text-slate-400",
    sectionText: "text-slate-600 dark:text-slate-300",
    emphasis: "text-slate-950 dark:text-white",
    listItemShell:
      "border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950",
    faqShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    closingShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    assistantSection:
      "border-t border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950",
    assistantBadge:
      "border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
    assistantShell:
      "border border-slate-200 bg-white shadow-[0_16px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900",
    assistantUserBubble:
      "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950",
    assistantAction:
      "bg-slate-950 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white",
    assistantInput:
      "border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-400 focus:bg-white focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-900 dark:focus:ring-slate-500/20",
  },
  commerce: {
    headerShell:
      "border-b border-amber-200/60 bg-[#f7f1e6]/92 text-stone-900 backdrop-blur supports-[backdrop-filter]:bg-[#f7f1e6]/74 dark:border-stone-800 dark:bg-stone-950/86 dark:text-white",
    logo: "text-stone-950 hover:text-stone-700 dark:text-stone-100 dark:hover:text-white",
    navLink: "text-stone-600 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white",
    heroShell: "bg-[#f7f1e6] text-stone-950 dark:bg-stone-950 dark:text-white",
    heroGlow:
      "bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_30%),radial-gradient(circle_at_88%_20%,_rgba(217,119,6,0.12),_transparent_26%),linear-gradient(180deg,_rgba(247,241,230,1),_rgba(255,251,245,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(180,83,9,0.24),_transparent_30%),linear-gradient(180deg,_rgba(41,37,36,0.9),_rgba(17,24,39,0.98))]",
    heroGrid: "lg:grid-cols-[1fr_1fr]",
    eyebrow:
      "border border-amber-300/60 bg-white/80 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100",
    subEyebrow: "text-amber-800 dark:text-amber-200",
    body: "text-stone-600 dark:text-stone-300",
    primaryButton:
      "bg-stone-950 text-white hover:bg-stone-800 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200",
    secondaryButton:
      "border border-stone-300 bg-white/70 text-stone-700 hover:bg-white dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800",
    metricShell:
      "border border-stone-300/60 bg-white/70 dark:border-stone-800 dark:bg-stone-900",
    metricValue: "text-stone-950 dark:text-white",
    showcaseShell:
      "border border-stone-300/50 bg-[rgba(255,252,247,0.86)] shadow-[0_28px_110px_rgba(120,53,15,0.12)] dark:border-stone-800 dark:bg-stone-900/95",
    sectionShell:
      "border border-stone-300/60 bg-white/70 dark:border-stone-800 dark:bg-stone-900",
    sectionLabel: "text-amber-700 dark:text-amber-200",
    sectionText: "text-stone-600 dark:text-stone-300",
    emphasis: "text-stone-950 dark:text-white",
    listItemShell:
      "border border-stone-300/50 bg-[rgba(255,255,255,0.72)] dark:border-stone-800 dark:bg-stone-950",
    faqShell:
      "border border-stone-300/60 bg-white/80 dark:border-stone-800 dark:bg-stone-900",
    closingShell:
      "border border-amber-300/50 bg-[linear-gradient(135deg,_rgba(255,247,237,0.96),_rgba(254,243,199,0.8))] dark:border-amber-500/20 dark:bg-[linear-gradient(135deg,_rgba(68,64,60,0.94),_rgba(41,37,36,0.98))]",
    assistantSection:
      "border-t border-amber-200/60 bg-[#f9f4ec] dark:border-stone-800 dark:bg-stone-950",
    assistantBadge:
      "border border-amber-300/60 bg-white text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100",
    assistantShell:
      "border border-stone-300/60 bg-white shadow-[0_18px_70px_rgba(120,53,15,0.10)] dark:border-stone-800 dark:bg-stone-900",
    assistantUserBubble:
      "bg-stone-950 text-white dark:bg-amber-300 dark:text-stone-950",
    assistantAction:
      "bg-stone-950 text-white hover:bg-stone-800 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200",
    assistantInput:
      "border-stone-300 bg-[#faf7f2] text-stone-900 focus:border-amber-500 focus:bg-white focus:ring-amber-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-amber-500 dark:focus:bg-stone-900 dark:focus:ring-amber-500/20",
  },
  creator: {
    headerShell:
      "border-b border-rose-200/60 bg-[#fff8f4]/92 text-stone-950 backdrop-blur supports-[backdrop-filter]:bg-[#fff8f4]/76 dark:border-stone-800 dark:bg-stone-950/86 dark:text-white",
    logo: "text-stone-950 hover:text-rose-700 dark:text-stone-100 dark:hover:text-white",
    navLink: "text-stone-600 hover:text-rose-700 dark:text-stone-300 dark:hover:text-rose-200",
    heroShell: "bg-[#fff8f4] text-stone-950 dark:bg-stone-950 dark:text-white",
    heroGlow:
      "bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.16),_transparent_28%),radial-gradient(circle_at_88%_14%,_rgba(251,146,60,0.14),_transparent_24%),linear-gradient(180deg,_rgba(255,248,244,1),_rgba(255,252,248,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(190,24,93,0.22),_transparent_28%),linear-gradient(180deg,_rgba(41,37,36,0.92),_rgba(17,24,39,0.98))]",
    heroGrid: "lg:grid-cols-[1fr_1fr]",
    eyebrow:
      "border border-rose-300/50 bg-white text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100",
    subEyebrow: "text-rose-700 dark:text-rose-200",
    body: "text-stone-600 dark:text-stone-300",
    primaryButton:
      "bg-rose-600 text-white hover:bg-rose-500 dark:bg-rose-400 dark:text-stone-950 dark:hover:bg-rose-300",
    secondaryButton:
      "border border-stone-300 bg-white/70 text-stone-700 hover:bg-white dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800",
    metricShell:
      "border border-stone-300/50 bg-white/75 dark:border-stone-800 dark:bg-stone-900",
    metricValue: "text-stone-950 dark:text-white",
    showcaseShell:
      "border border-stone-300/50 bg-[rgba(255,255,255,0.86)] shadow-[0_28px_110px_rgba(190,24,93,0.12)] dark:border-stone-800 dark:bg-stone-900/95",
    sectionShell:
      "border border-stone-300/60 bg-white/80 dark:border-stone-800 dark:bg-stone-900",
    sectionLabel: "text-rose-700 dark:text-rose-200",
    sectionText: "text-stone-600 dark:text-stone-300",
    emphasis: "text-stone-950 dark:text-white",
    listItemShell:
      "border border-stone-300/50 bg-[rgba(255,255,255,0.82)] dark:border-stone-800 dark:bg-stone-950",
    faqShell:
      "border border-stone-300/60 bg-white/85 dark:border-stone-800 dark:bg-stone-900",
    closingShell:
      "border border-rose-300/40 bg-[linear-gradient(135deg,_rgba(255,241,242,0.94),_rgba(255,247,237,0.86))] dark:border-rose-500/20 dark:bg-[linear-gradient(135deg,_rgba(68,64,60,0.94),_rgba(41,37,36,0.98))]",
    assistantSection:
      "border-t border-rose-200/60 bg-[#fff7f5] dark:border-stone-800 dark:bg-stone-950",
    assistantBadge:
      "border border-rose-300/50 bg-white text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100",
    assistantShell:
      "border border-stone-300/60 bg-white shadow-[0_18px_70px_rgba(190,24,93,0.10)] dark:border-stone-800 dark:bg-stone-900",
    assistantUserBubble:
      "bg-rose-600 text-white dark:bg-rose-400 dark:text-stone-950",
    assistantAction:
      "bg-rose-600 text-white hover:bg-rose-500 dark:bg-rose-400 dark:text-stone-950 dark:hover:bg-rose-300",
    assistantInput:
      "border-stone-300 bg-[#fff8f5] text-stone-900 focus:border-rose-500 focus:bg-white focus:ring-rose-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-rose-500 dark:focus:bg-stone-900 dark:focus:ring-rose-500/20",
  },
  education: {
    headerShell:
      "border-b border-emerald-200/60 bg-[#f4fbf6]/92 text-slate-950 backdrop-blur supports-[backdrop-filter]:bg-[#f4fbf6]/76 dark:border-slate-800 dark:bg-slate-950/86 dark:text-white",
    logo: "text-slate-950 hover:text-emerald-700 dark:text-slate-100 dark:hover:text-white",
    navLink: "text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-200",
    heroShell: "bg-[#f4fbf6] text-slate-950 dark:bg-slate-950 dark:text-white",
    heroGlow:
      "bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_82%_20%,_rgba(20,184,166,0.14),_transparent_24%),linear-gradient(180deg,_rgba(244,251,246,1),_rgba(248,250,252,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(5,150,105,0.24),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.9),_rgba(2,6,23,0.98))]",
    heroGrid: "lg:grid-cols-[0.95fr_1.05fr]",
    eyebrow:
      "border border-emerald-300/50 bg-white text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100",
    subEyebrow: "text-emerald-700 dark:text-emerald-200",
    body: "text-slate-600 dark:text-slate-300",
    primaryButton:
      "bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300",
    secondaryButton:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    metricShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    metricValue: "text-slate-950 dark:text-white",
    showcaseShell:
      "border border-slate-200 bg-white shadow-[0_24px_90px_rgba(16,185,129,0.10)] dark:border-slate-800 dark:bg-slate-900",
    sectionShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    sectionLabel: "text-emerald-700 dark:text-emerald-200",
    sectionText: "text-slate-600 dark:text-slate-300",
    emphasis: "text-slate-950 dark:text-white",
    listItemShell:
      "border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950",
    faqShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    closingShell:
      "border border-emerald-300/40 bg-[linear-gradient(135deg,_rgba(236,253,245,0.98),_rgba(240,253,250,0.9))] dark:border-emerald-500/20 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(5,46,22,0.96))]",
    assistantSection:
      "border-t border-emerald-200/60 bg-[#f4fbf6] dark:border-slate-800 dark:bg-slate-950",
    assistantBadge:
      "border border-emerald-300/50 bg-white text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100",
    assistantShell:
      "border border-slate-200 bg-white shadow-[0_18px_70px_rgba(16,185,129,0.10)] dark:border-slate-800 dark:bg-slate-900",
    assistantUserBubble:
      "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950",
    assistantAction:
      "bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300",
    assistantInput:
      "border-slate-200 bg-slate-50 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:bg-slate-900 dark:focus:ring-emerald-500/20",
  },
  local: {
    headerShell:
      "border-b border-sky-200/60 bg-[#f7fbff]/92 text-slate-950 backdrop-blur supports-[backdrop-filter]:bg-[#f7fbff]/76 dark:border-slate-800 dark:bg-slate-950/86 dark:text-white",
    logo: "text-slate-950 hover:text-sky-700 dark:text-slate-100 dark:hover:text-white",
    navLink: "text-slate-600 hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-200",
    heroShell: "bg-[#f7fbff] text-slate-950 dark:bg-slate-950 dark:text-white",
    heroGlow:
      "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_82%_20%,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,_rgba(247,251,255,1),_rgba(248,250,252,0.98))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(2,132,199,0.24),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.9),_rgba(2,6,23,0.98))]",
    heroGrid: "lg:grid-cols-[0.98fr_1.02fr]",
    eyebrow:
      "border border-sky-300/50 bg-white text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-100",
    subEyebrow: "text-sky-700 dark:text-sky-200",
    body: "text-slate-600 dark:text-slate-300",
    primaryButton:
      "bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300",
    secondaryButton:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    metricShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    metricValue: "text-slate-950 dark:text-white",
    showcaseShell:
      "border border-slate-200 bg-white shadow-[0_24px_90px_rgba(14,165,233,0.10)] dark:border-slate-800 dark:bg-slate-900",
    sectionShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    sectionLabel: "text-sky-700 dark:text-sky-200",
    sectionText: "text-slate-600 dark:text-slate-300",
    emphasis: "text-slate-950 dark:text-white",
    listItemShell:
      "border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950",
    faqShell:
      "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
    closingShell:
      "border border-sky-300/40 bg-[linear-gradient(135deg,_rgba(239,246,255,0.98),_rgba(224,242,254,0.84))] dark:border-sky-500/20 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.92),_rgba(12,74,110,0.96))]",
    assistantSection:
      "border-t border-sky-200/60 bg-[#f7fbff] dark:border-slate-800 dark:bg-slate-950",
    assistantBadge:
      "border border-sky-300/50 bg-white text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-100",
    assistantShell:
      "border border-slate-200 bg-white shadow-[0_18px_70px_rgba(14,165,233,0.10)] dark:border-slate-800 dark:bg-slate-900",
    assistantUserBubble:
      "bg-sky-600 text-white dark:bg-sky-400 dark:text-slate-950",
    assistantAction:
      "bg-sky-600 text-white hover:bg-sky-500 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300",
    assistantInput:
      "border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-500 focus:bg-white focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:bg-slate-900 dark:focus:ring-sky-500/20",
  },
};

export function getSiteThemeClasses(themeFamily: SiteThemeFamily): SiteThemeClasses {
  return SITE_THEME_CLASSES[themeFamily];
}
