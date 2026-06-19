import { Link } from "@remix-run/react";

import { SectionShell } from "~/components/sections/SectionShell";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";

export function ClosingCtaSection() {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const home = SITE_CONFIG.home;

  return (
    <SectionShell id="closing" tone="deep" align="center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl lg:text-4xl">
          One command surface. Three real revenue levers.
        </h2>
        <p className={`max-w-xl text-sm leading-relaxed sm:text-base ${theme.sectionText}`}>
          Seats, credits, and premium tool access — wired into the same paid workspace from
          the first commit.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={home.primaryCtaHref}
            className={`inline-flex min-w-[10rem] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition motion-safe:hover:-translate-y-0.5 ${theme.primaryButton}`}
          >
            {home.primaryCtaLabel}
          </Link>
          <Link
            to={home.secondaryCtaHref}
            className={`inline-flex min-w-[10rem] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition motion-safe:hover:-translate-y-0.5 ${theme.secondaryButton}`}
          >
            {home.secondaryCtaLabel}
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
