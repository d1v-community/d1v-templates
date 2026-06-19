interface EmptyStateIllustrationProps {
  /** Visual variant — different scenes per industry feel. */
  variant?: "feed" | "reviews" | "qa" | "messages" | "log" | "generic";
  className?: string;
}

const VARIANT_DEFS: Record<NonNullable<EmptyStateIllustrationProps["variant"]>, {
  primary: string;
  secondary: string;
  accent: string;
  icon: string;
}> = {
  feed: {
    primary: "M 16 28 H 64 V 64 H 16 Z",
    secondary: "M 32 38 H 48 M 32 48 H 56 M 32 58 H 44",
    accent: "M 70 50 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0",
    icon: "M 50 16 l 4 8 l 8 1 l -6 6 l 1 8 l -7 -4 l -7 4 l 1 -8 l -6 -6 l 8 -1 z",
  },
  reviews: {
    primary: "M 24 40 l 8 16 l 18 -2 l -14 -12 l 4 -18 l -16 8 l -16 -8 l 4 18 l -14 12 l 18 2 z",
    secondary: "",
    accent: "M 70 30 l 4 8 l 8 1 l -6 6 l 1 8 l -7 -4 l -7 4 l 1 -8 l -6 -6 l 8 -1 z",
    icon: "M 60 60 m 8 0 a 8 8 0 1 0 -16 0 a 8 8 0 1 0 16 0",
  },
  qa: {
    primary: "M 20 22 H 60 V 52 H 36 L 26 62 V 52 H 20 Z",
    secondary: "M 28 32 H 52 M 28 42 H 48",
    accent: "M 68 36 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0",
    icon: "M 36 36 l 2 4 l 4 0 l -3 3 l 1 4 l -4 -2 l -4 2 l 1 -4 l -3 -3 l 4 0 z",
  },
  messages: {
    primary: "M 14 26 H 70 V 58 H 50 L 42 66 V 58 H 14 Z",
    secondary: "M 22 36 H 50 M 22 44 H 44",
    accent: "M 78 32 l 4 6 l 6 0 l -4 4 l 1 6 l -7 -4 l -7 4 l 1 -6 l -4 -4 l 6 0 z",
    icon: "M 26 50 l 3 3 l 6 -6",
  },
  log: {
    primary: "M 22 18 H 62 V 76 H 22 Z",
    secondary: "M 28 32 H 56 M 28 42 H 56 M 28 52 H 50 M 28 62 H 44",
    accent: "M 70 50 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0",
    icon: "M 50 16 l 3 6 l 6 1 l -4 4 l 1 6 l -6 -3 l -6 3 l 1 -6 l -4 -4 l 6 -1 z",
  },
  generic: {
    primary: "M 20 20 H 64 V 64 H 20 Z",
    secondary: "M 28 32 H 56 M 28 42 H 56 M 28 52 H 50 M 28 62 H 44",
    accent: "M 72 28 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0",
    icon: "M 50 14 l 3 6 l 6 1 l -4 4 l 1 6 l -6 -3 l -6 3 l 1 -6 l -4 -4 l 6 -1 z",
  },
};

export function EmptyStateIllustration({ variant = "generic", className }: EmptyStateIllustrationProps) {
  const v = VARIANT_DEFS[variant];
  return (
    <svg
      viewBox="0 0 100 90"
      className={className ?? "h-24 w-32"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Soft backdrop */}
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      {/* Main shape */}
      <path d={v.primary} strokeOpacity="0.4" />
      {/* Content lines */}
      {v.secondary && <path d={v.secondary} strokeOpacity="0.25" strokeWidth="1.2" />}
      {/* Accent dot/circle */}
      <circle cx="76" cy="30" r="6" strokeOpacity="0.5" />
      {/* Floating accent shape */}
      <path d={v.icon} strokeOpacity="0.6" fill="currentColor" fillOpacity="0.04" />
      {/* Sparkle dots */}
      <circle cx="18" cy="22" r="1.2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="84" cy="64" r="1.2" fill="currentColor" fillOpacity="0.4" />
      <circle cx="22" cy="76" r="1.2" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}
