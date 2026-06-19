import type { CSSProperties, ReactNode } from "react";

import { getSiteThemeClasses, type SiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

type SectionTone = "panel" | "canvas" | "deep" | "outline";

const TONE_CLASSES: Record<SectionTone, (theme: SiteThemeClasses) => string> = {
  panel: theme => theme.sectionShell,
  canvas: theme => theme.assistantSection,
  deep: theme => theme.closingShell,
  outline: () => "border border-slate-200/60 bg-white/40 dark:border-white/10 dark:bg-white/[0.03]",
};

export interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  align?: "start" | "center";
  tone?: SectionTone;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  containerClassName?: string;
  style?: CSSProperties;
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  align = "start",
  tone = "panel",
  children,
  className,
  contentClassName,
  containerClassName,
  style,
}: SectionShellProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const toneClass = TONE_CLASSES[tone](theme);
  const headingAlign = align === "center" ? "text-center" : "text-left";
  const containerAlign = align === "center" ? "items-center text-center" : "items-start";

  return (
    <section
      id={id}
      style={style}
      className={[
        "relative w-full overflow-hidden rounded-[2rem]",
        toneClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16",
          containerAlign,
          containerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {eyebrow || title || description ? (
          <header className={["flex max-w-3xl flex-col gap-3", headingAlign].join(" ")}>
            {eyebrow ? (
              <span
                className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${
                  align === "center" ? "self-center" : ""
                } ${theme.eyebrow}`}
              >
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl lg:text-[2.5rem] lg:leading-[1.05]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className={`text-sm leading-relaxed sm:text-base ${theme.sectionText}`}>
                {description}
              </p>
            ) : null}
          </header>
        ) : null}
        <div className={["w-full", contentClassName].filter(Boolean).join(" ")}>{children}</div>
      </div>
    </section>
  );
}
