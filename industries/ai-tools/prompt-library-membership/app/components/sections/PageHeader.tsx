import type { ReactNode } from "react";

import { Link } from "@remix-run/react";

import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  back?: { href: string; label?: string };
  trailing?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, back, trailing }: PageHeaderProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-10 sm:px-8 lg:px-10">
      {back ? (
        <Link
          to={back.href}
          className={`inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}
        >
          <span aria-hidden>←</span> {back.label ?? "Back"}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-3xl flex-col gap-3">
          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}`}
          >
            {eyebrow}
          </span>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h1>
          {description ? (
            <p className={`text-sm leading-relaxed sm:text-base ${theme.body}`}>{description}</p>
          ) : null}
        </div>
        {trailing ? <div className="flex flex-wrap items-center gap-2">{trailing}</div> : null}
      </div>
    </div>
  );
}
