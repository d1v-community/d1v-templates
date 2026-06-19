import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "@remix-run/react";

import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

const SITE_CONFIG_FAMILY = SITE_CONFIG.theme.family;

export interface WorkspaceTab {
  label: string;
  to: string;
  end?: boolean;
  badgeHint?: string;
}

interface WorkspaceLayoutProps {
  tabs: WorkspaceTab[];
  eyebrow: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
  sidebarFooter?: ReactNode;
  children: ReactNode;
}

export function WorkspaceLayout({
  tabs,
  eyebrow,
  title,
  description,
  trailing,
  sidebarFooter,
  children,
}: WorkspaceLayoutProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG_FAMILY);
  const location = useLocation();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8 lg:py-10">
      <aside className="lg:w-64 lg:flex-none">
        <div className={`sticky top-20 rounded-2xl p-3 ${theme.sectionShell}`}>
          <p
            className={`px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.subEyebrow}`}
          >
            {eyebrow}
          </p>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                prefetch="intent"
                className={({ isActive }) =>
                  [
                    "group relative flex flex-none items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? `${theme.assistantShell} ${theme.emphasis}`
                      : `${theme.body} motion-safe:hover:bg-slate-100 dark:motion-safe:hover:bg-slate-800/50`,
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span
                        aria-hidden
                        className={`absolute inset-y-1 left-0 w-0.5 rounded-full ${theme.subEyebrow.replace(/^text-/, "bg-")}`}
                      />
                    ) : null}
                    <span className="truncate">{tab.label}</span>
                    {tab.badgeHint ? (
                      <span
                        className={`ml-auto hidden text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60 lg:inline ${
                          isActive ? "opacity-100" : ""
                        }`}
                      >
                        {tab.badgeHint}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          {sidebarFooter ? (
            <div className={`mt-3 rounded-xl p-3 text-[12px] leading-relaxed ${theme.metricShell}`}>
              {sidebarFooter}
            </div>
          ) : null}
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-2">
            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}`}
            >
              {eyebrow}
            </span>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{title}</h1>
            {description ? (
              <p className={`text-sm leading-relaxed ${theme.body}`}>{description}</p>
            ) : null}
          </div>
          {trailing ? <div className="flex flex-wrap items-center gap-2">{trailing}</div> : null}
        </header>
        <div className="min-w-0">{children}</div>
      </section>
    </div>
  );
}
