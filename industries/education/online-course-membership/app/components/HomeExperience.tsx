import { Link } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { SITE_CONFIG, type SiteExperiencePanel, type SiteMetric } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import type { TemplateSnapshot, TemplateSnapshotSection } from "~/services/template-data.server";
import type { AppHeaderUser } from "~/components/AppHeader";

function MetricRow({
  metrics,
  metricShell,
  metricValue,
}: {
  metrics: SiteMetric[];
  metricShell: string;
  metricValue: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div key={metric.label} className={`rounded-[1.75rem] p-4 ${metricShell}`}>
          <p className={`text-2xl font-semibold tracking-tight ${metricValue}`}>
            {metric.value}
          </p>
          <p className="mt-2 text-sm font-medium text-current">{metric.label}</p>
          <p className="mt-1 text-sm leading-6 text-current/70">{metric.detail}</p>
        </div>
      ))}
    </div>
  );
}

function renderShowcasePanels(layout: string, panels: SiteExperiencePanel[]) {
  const [leadPanel, ...restPanels] = panels;

  if (!leadPanel) return null;

    if (layout === "command") {
    return (
      <div className="space-y-4">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-white/12 dark:bg-slate-950/75">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200/80">
              {leadPanel.meta}
            </p>
            <div className="rounded-full border border-cyan-500/20 bg-cyan-100 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-100">
              {leadPanel.value}
            </div>
          </div>
          <h3 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {leadPanel.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {leadPanel.detail}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {restPanels.map((panel) => (
            <div
              key={panel.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/6"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                {panel.meta}
              </p>
              <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{panel.title}</p>
              <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-100">{panel.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{panel.detail}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "operations") {
    return (
      <div className="space-y-3">
        {panels.map((panel, index) => (
          <div
            key={panel.title}
            className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 md:grid-cols-[auto_1fr_auto] dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              0{index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {panel.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {panel.detail}
              </p>
            </div>
            <div className="space-y-2 text-left md:text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                {panel.meta}
              </p>
              <p className="text-sm font-medium text-slate-950 dark:text-white">
                {panel.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (layout === "academy") {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">
            {leadPanel.meta}
          </p>
          <h3 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {leadPanel.title}
          </h3>
          <p className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-200">
            {leadPanel.value}
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {leadPanel.detail}
          </p>
        </div>

        <div className="space-y-3">
          {restPanels.map((panel) => (
            <div
              key={panel.title}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {panel.title}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {panel.meta}
                </p>
              </div>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-200">
                {panel.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {panel.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "service") {
    return (
      <div className="space-y-3">
        {panels.map((panel) => (
          <div
            key={panel.title}
            className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 md:grid-cols-[0.9fr_1.1fr_auto] dark:border-slate-800 dark:bg-slate-950"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sky-700 dark:text-sky-200">
                {panel.meta}
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
                {panel.title}
              </p>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {panel.detail}
            </p>
            <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-100">
              {panel.value}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-stone-300/50 bg-white/80 p-6 dark:border-stone-800 dark:bg-stone-950">
        <p className="text-xs uppercase tracking-[0.22em] text-current/70">
          {leadPanel.meta}
        </p>
        <h3 className="mt-5 text-3xl font-semibold tracking-tight text-current">
          {leadPanel.title}
        </h3>
        <p className="mt-3 text-sm font-medium text-current/80">{leadPanel.value}</p>
        <p className="mt-4 text-sm leading-7 text-current/70">{leadPanel.detail}</p>
      </div>

      <div className="space-y-3">
        {restPanels.map((panel) => (
          <div
            key={panel.title}
            className="rounded-[1.5rem] border border-stone-300/50 bg-white/70 p-4 dark:border-stone-800 dark:bg-stone-950"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-current">{panel.title}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-current/60">
                {panel.meta}
              </p>
            </div>
            <p className="mt-2 text-sm font-medium text-current/85">{panel.value}</p>
            <p className="mt-3 text-sm leading-6 text-current/70">{panel.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatGeneratedAt(generatedAt: string) {
  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) {
    return generatedAt;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function publicSectionItems(section: TemplateSnapshotSection) {
  return section.items.slice(0, 2);
}

function SectionTabs({
  sections,
  activeKey,
  onChange,
  layout,
  authenticated,
}: {
  sections: TemplateSnapshotSection[];
  activeKey: string;
  onChange: (key: string) => void;
  layout: string;
  authenticated: boolean;
}) {
  const activeClasses =
    layout === "command"
      ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
      : layout === "operations"
        ? "border-slate-300 bg-white text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        : layout === "academy"
          ? "border-emerald-300 bg-white text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100"
          : layout === "service"
            ? "border-sky-300 bg-white text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-100"
            : "border-stone-300 bg-white text-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-white";
  const idleClasses =
    layout === "command"
      ? "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/20 hover:text-cyan-100"
      : "border-current/10 bg-white/60 text-current/70 hover:border-current/20 hover:text-current dark:bg-slate-950/50";

  return (
    <div className="flex flex-wrap gap-2">
      {sections.map((section) => {
        const isActive = section.key === activeKey;

        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onChange(section.key)}
            className={`rounded-full border px-4 py-2 text-left text-sm transition ${
              isActive ? activeClasses : idleClasses
            }`}
          >
            <div className="font-medium">{section.title}</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] opacity-70">
              {section.total} {authenticated ? section.totalLabel : "public preview"}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PublicSectionPreview({
  section,
  layout,
  sectionShell,
  listItemShell,
  sectionLabel,
  sectionText,
  emphasis,
}: {
  section: TemplateSnapshotSection;
  layout: string;
  sectionShell: string;
  listItemShell: string;
  sectionLabel: string;
  sectionText: string;
  emphasis: string;
}) {
  const items = publicSectionItems(section);

  if (layout === "command") {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className={`rounded-[2rem] p-6 ${sectionShell}`}>
          <p className={`text-xs uppercase tracking-[0.24em] ${sectionLabel}`}>
            Public preview
          </p>
          <h3 className={`mt-4 text-3xl font-semibold tracking-tight ${emphasis}`}>
            {section.title}
          </h3>
          <p className={`mt-4 max-w-xl text-sm leading-7 ${sectionText}`}>
            {section.description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className={`rounded-[1.5rem] p-4 ${listItemShell}`}>
              <p className={`text-3xl font-semibold tracking-tight ${emphasis}`}>
                {section.total}
              </p>
              <p className={`mt-2 text-sm leading-6 ${sectionText}`}>
                Live records already seeded for this module.
              </p>
            </div>
            <div className={`rounded-[1.5rem] p-4 ${listItemShell}`}>
              <p className={`text-sm font-semibold ${emphasis}`}>What unlocks after login</p>
              <p className={`mt-2 text-sm leading-6 ${sectionText}`}>
                Full record detail, operational context, and the rest of the workspace state.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${section.key}-${item.title}`} className={`rounded-[1.5rem] p-4 ${listItemShell}`}>
              <p className={`text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
              <p className={`mt-3 text-lg font-semibold ${emphasis}`}>{item.title}</p>
              <p className={`mt-3 text-sm leading-6 ${sectionText}`}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "operations") {
    return (
      <div className={`rounded-[2rem] p-4 ${sectionShell}`}>
        <div className="grid gap-3">
          {items.map((item, index) => (
            <div
              key={`${section.key}-${item.title}`}
              className={`grid gap-4 rounded-[1.4rem] p-4 md:grid-cols-[auto_1fr_auto] ${listItemShell}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current/10 text-xs font-semibold opacity-70">
                0{index + 1}
              </div>
              <div>
                <p className={`text-base font-semibold ${emphasis}`}>{item.title}</p>
                <p className={`mt-2 text-sm leading-6 ${sectionText}`}>{item.detail}</p>
              </div>
              <p className={`text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "academy") {
    return (
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className={`rounded-[2rem] p-6 ${sectionShell}`}>
          <p className={`text-xs uppercase tracking-[0.24em] ${sectionLabel}`}>Preview module</p>
          <h3 className={`mt-4 text-3xl font-semibold tracking-tight ${emphasis}`}>{section.title}</h3>
          <p className={`mt-4 text-sm leading-7 ${sectionText}`}>{section.description}</p>
          <div className={`mt-8 rounded-[1.5rem] p-4 ${listItemShell}`}>
            <p className={`text-sm font-semibold ${emphasis}`}>Visible before login</p>
            <p className={`mt-2 text-sm leading-6 ${sectionText}`}>
              Learners can inspect totals and a few public records before they enter the full course workspace.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${section.key}-${item.title}`} className={`rounded-[1.5rem] p-4 ${listItemShell}`}>
              <p className={`text-sm font-semibold ${emphasis}`}>{item.title}</p>
              <p className={`mt-2 text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
              <p className={`mt-3 text-sm leading-6 ${sectionText}`}>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "service") {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${section.key}-${item.title}`}
            className={`grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-[0.95fr_1.05fr] ${listItemShell}`}
          >
            <div>
              <p className={`text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
              <p className={`mt-3 text-lg font-semibold ${emphasis}`}>{item.title}</p>
            </div>
            <p className={`text-sm leading-6 ${sectionText}`}>{item.detail}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={`${section.key}-${item.title}`} className={`rounded-[1.5rem] p-4 ${listItemShell}`}>
          <p className={`text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
          <p className={`mt-3 text-lg font-semibold ${emphasis}`}>{item.title}</p>
          <p className={`mt-3 text-sm leading-6 ${sectionText}`}>{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

function SignedInWorkspace({
  sections,
  activeSection,
  activeKey,
  onChange,
  generatedAt,
  layout,
  viewerLabel,
  sectionShell,
  listItemShell,
  sectionLabel,
  sectionText,
  emphasis,
}: {
  sections: TemplateSnapshotSection[];
  activeSection: TemplateSnapshotSection;
  activeKey: string;
  onChange: (key: string) => void;
  generatedAt: string;
  layout: string;
  viewerLabel: string;
  sectionShell: string;
  listItemShell: string;
  sectionLabel: string;
  sectionText: string;
  emphasis: string;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <aside className={`rounded-[2rem] p-5 ${sectionShell}`}>
        <p className={`text-xs uppercase tracking-[0.24em] ${sectionLabel}`}>Signed-in workspace</p>
        <h3 className={`mt-4 text-2xl font-semibold tracking-tight ${emphasis}`}>{viewerLabel}</h3>
        <p className={`mt-3 text-sm leading-6 ${sectionText}`}>
          Switch between seeded product modules and inspect the real records already flowing through this starter.
        </p>

        <div className="mt-6 space-y-3">
          {sections.map((section) => {
            const isActive = section.key === activeKey;

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => onChange(section.key)}
                className={`w-full rounded-[1.35rem] border p-4 text-left transition ${
                  isActive
                    ? "border-current/20 bg-white/80 text-current dark:bg-slate-900"
                    : "border-current/10 bg-transparent text-current/75 hover:border-current/20 hover:text-current"
                }`}
              >
                <p className="text-sm font-semibold">{section.title}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] opacity-70">
                  {section.total} {section.totalLabel}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className={`rounded-[2rem] p-6 lg:p-8 ${sectionShell}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className={`text-xs uppercase tracking-[0.24em] ${sectionLabel}`}>{activeSection.title}</p>
            <h3 className={`mt-4 text-3xl font-semibold tracking-tight ${emphasis}`}>{activeSection.total}</h3>
            <p className={`mt-2 text-sm leading-6 ${sectionText}`}>{activeSection.description}</p>
          </div>
          <div className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] ${listItemShell}`}>
            Refreshed {generatedAt}
          </div>
        </div>

        <div className="mt-8">
          {layout === "operations" ? (
            <div className="space-y-3">
              {activeSection.items.map((item, index) => (
                <div
                  key={`${activeSection.key}-${item.title}-${index}`}
                  className={`grid gap-4 rounded-[1.4rem] p-4 md:grid-cols-[auto_1fr_auto] ${listItemShell}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current/10 text-xs font-semibold opacity-70">
                    0{index + 1}
                  </div>
                  <div>
                    <p className={`text-base font-semibold ${emphasis}`}>{item.title}</p>
                    <p className={`mt-2 text-sm leading-6 ${sectionText}`}>{item.detail}</p>
                  </div>
                  <p className={`text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
                </div>
              ))}
            </div>
          ) : layout === "command" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {activeSection.items.map((item, index) => (
                <div
                  key={`${activeSection.key}-${item.title}-${index}`}
                  className={`rounded-[1.5rem] p-5 ${listItemShell}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
                      <p className={`mt-3 text-xl font-semibold ${emphasis}`}>{item.title}</p>
                    </div>
                    <div className="rounded-full border border-current/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] opacity-70">
                      {index + 1}
                    </div>
                  </div>
                  <p className={`mt-4 text-sm leading-6 ${sectionText}`}>{item.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeSection.items.map((item, index) => (
                <div
                  key={`${activeSection.key}-${item.title}-${index}`}
                  className={`rounded-[1.5rem] p-5 ${listItemShell}`}
                >
                  <p className={`text-xs uppercase tracking-[0.22em] ${sectionLabel}`}>{item.meta}</p>
                  <p className={`mt-3 text-xl font-semibold ${emphasis}`}>{item.title}</p>
                  <p className={`mt-4 text-sm leading-6 ${sectionText}`}>{item.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function HomeExperience({
  snapshot,
  user,
}: {
  snapshot?: TemplateSnapshot | null;
  user?: AppHeaderUser;
}) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const surface = SITE_CONFIG.templateSurface;
  const fulfillmentSteps = SITE_CONFIG.paymentSuccess.nextSteps.slice(0, 3);
  const modules = SITE_CONFIG.featureSections;
  const sectionKeyList = useMemo(
    () => snapshot?.sections.map((section) => section.key) ?? [],
    [snapshot],
  );
  const [activeSectionKey, setActiveSectionKey] = useState<string>(sectionKeyList[0] ?? "");
  const [activeModuleTitle, setActiveModuleTitle] = useState<string>(
    modules[0]?.title ?? "",
  );

  useEffect(() => {
    if (!sectionKeyList.length) {
      setActiveSectionKey("");
      return;
    }

    if (!sectionKeyList.includes(activeSectionKey)) {
      setActiveSectionKey(sectionKeyList[0]);
    }
  }, [activeSectionKey, sectionKeyList]);

  useEffect(() => {
    if (!modules.length) {
      setActiveModuleTitle("");
      return;
    }

    const titles = modules.map((module) => module.title);
    if (!titles.includes(activeModuleTitle)) {
      setActiveModuleTitle(titles[0]);
    }
  }, [activeModuleTitle, modules]);

  const activeSection =
    snapshot?.sections.find((section) => section.key === activeSectionKey) ??
    snapshot?.sections[0] ??
    null;
  const activeModule =
    modules.find((module) => module.title === activeModuleTitle) ?? modules[0] ?? null;
  const displayName = user?.displayName || user?.username || user?.email || "Workspace";
  const isAuthenticated = Boolean(user);

  return (
    <section
      data-template={surface.templateId}
      className={`relative isolate overflow-hidden ${theme.heroShell}`}
    >
      <div className={`absolute inset-0 ${theme.heroGlow}`} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className={`grid gap-14 ${theme.heroGrid}`}>
          <div className="flex flex-col justify-center">
            <div
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] ${theme.eyebrow}`}
            >
              {SITE_CONFIG.home.badge}
            </div>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl ${theme.emphasis}`}>
              {SITE_CONFIG.home.headline}
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg ${theme.body}`}>
              {SITE_CONFIG.home.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={SITE_CONFIG.home.primaryCtaHref}
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${theme.primaryButton}`}
              >
                {SITE_CONFIG.home.primaryCtaLabel}
              </Link>
              <Link
                to={SITE_CONFIG.home.secondaryCtaHref}
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${theme.secondaryButton}`}
              >
                {SITE_CONFIG.home.secondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-10">
              <MetricRow
                metrics={SITE_CONFIG.heroMetrics}
                metricShell={theme.metricShell}
                metricValue={theme.metricValue}
              />
            </div>
          </div>

          <div className={`rounded-[2.4rem] p-6 lg:p-8 ${theme.showcaseShell}`}>
            <p className={`text-xs uppercase tracking-[0.26em] ${theme.subEyebrow}`}>
              {SITE_CONFIG.showcase.eyebrow}
            </p>
            <h2 className={`mt-4 text-3xl font-semibold tracking-tight sm:text-[2.5rem] ${theme.emphasis}`}>
              {SITE_CONFIG.showcase.title}
            </h2>
            <p className={`mt-4 max-w-2xl text-sm leading-7 ${theme.body}`}>
              {SITE_CONFIG.showcase.description}
            </p>

            <div className="mt-8">
              {renderShowcasePanels(
                SITE_CONFIG.theme.layout,
                SITE_CONFIG.showcase.panels,
              )}
            </div>
          </div>
        </div>

        {snapshot && activeSection ? (
          <section id="workspace" className={`mt-16 rounded-[2rem] p-6 lg:p-8 ${theme.sectionShell}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className={`text-xs uppercase tracking-[0.24em] ${theme.sectionLabel}`}>
                  {isAuthenticated ? "Product workspace" : "Public feature preview"}
                </p>
                <h2 className={`mt-4 text-3xl font-semibold tracking-tight ${theme.emphasis}`}>
                  {snapshot.title}
                </h2>
                <p className={`mt-4 text-sm leading-7 ${theme.sectionText}`}>
                  {snapshot.description}
                </p>
              </div>
              <div className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] ${theme.eyebrow}`}>
                {isAuthenticated ? "Signed in" : "Public mode"}
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="mt-8 space-y-6">
                <SectionTabs
                  sections={snapshot.sections}
                  activeKey={activeSection.key}
                  onChange={setActiveSectionKey}
                  layout={SITE_CONFIG.theme.layout}
                  authenticated={false}
                />
                <PublicSectionPreview
                  section={activeSection}
                  layout={SITE_CONFIG.theme.layout}
                  sectionShell={theme.sectionShell}
                  listItemShell={theme.listItemShell}
                  sectionLabel={theme.sectionLabel}
                  sectionText={theme.sectionText}
                  emphasis={theme.emphasis}
                />
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/login"
                    className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${theme.primaryButton}`}
                  >
                    Unlock full workspace
                  </Link>
                  <Link
                    to="/pricing"
                    className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${theme.secondaryButton}`}
                  >
                    View pricing
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <SignedInWorkspace
                  sections={snapshot.sections}
                  activeSection={activeSection}
                  activeKey={activeSection.key}
                  onChange={setActiveSectionKey}
                  generatedAt={formatGeneratedAt(snapshot.generatedAt)}
                  layout={SITE_CONFIG.theme.layout}
                  viewerLabel={displayName}
                  sectionShell={theme.sectionShell}
                  listItemShell={theme.listItemShell}
                  sectionLabel={theme.sectionLabel}
                  sectionText={theme.sectionText}
                  emphasis={theme.emphasis}
                />
              </div>
            )}
          </section>
        ) : null}

        <div id="modules" className="mt-16 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className={`rounded-[2rem] p-6 lg:p-8 ${theme.sectionShell}`}>
            <p className={`text-xs uppercase tracking-[0.24em] ${theme.sectionLabel}`}>
              {SITE_CONFIG.workflow.eyebrow}
            </p>
            <h2 className={`mt-4 text-3xl font-semibold tracking-tight ${theme.emphasis}`}>
              {SITE_CONFIG.workflow.title}
            </h2>
            <p className={`mt-4 max-w-xl text-sm leading-7 ${theme.sectionText}`}>
              {SITE_CONFIG.workflow.description}
            </p>

            <div className="mt-8 space-y-4">
              {SITE_CONFIG.workflow.steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`grid gap-4 rounded-[1.5rem] p-4 md:grid-cols-[auto_1fr] ${theme.listItemShell}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current/10 text-xs font-semibold text-current/70">
                    0{index + 1}
                  </div>
                  <div>
                    <p className={`text-base font-semibold ${theme.emphasis}`}>{step.title}</p>
                    <p className={`mt-2 text-sm leading-6 ${theme.sectionText}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {activeModule ? (
            <section className={`rounded-[2rem] p-6 lg:p-8 ${theme.sectionShell}`}>
              <div className="flex flex-wrap gap-2">
                {modules.map((module) => (
                  <button
                    key={module.title}
                    type="button"
                    onClick={() => setActiveModuleTitle(module.title)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      module.title === activeModule.title
                        ? theme.eyebrow
                        : "border-current/10 bg-transparent text-current/70 hover:border-current/20 hover:text-current"
                    }`}
                  >
                    {module.eyebrow}
                  </button>
                ))}
              </div>

              <h2 className={`mt-6 text-3xl font-semibold tracking-tight ${theme.emphasis}`}>
                {activeModule.title}
              </h2>
              <p className={`mt-4 max-w-2xl text-sm leading-7 ${theme.sectionText}`}>
                {activeModule.description}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {activeModule.items.map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-[1.5rem] p-4 ${theme.listItemShell}`}
                  >
                    {item.meta ? (
                      <p className={`text-xs uppercase tracking-[0.22em] ${theme.sectionLabel}`}>
                        {item.meta}
                      </p>
                    ) : null}
                    <p className={`mt-3 text-base font-semibold ${theme.emphasis}`}>
                      {item.title}
                    </p>
                    <p className={`mt-3 text-sm leading-6 ${theme.sectionText}`}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className={`rounded-[2rem] p-6 lg:p-8 ${theme.faqShell}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className={`text-xs uppercase tracking-[0.24em] ${theme.sectionLabel}`}>
                  {surface.badge}
                </p>
                <h2 className={`mt-4 text-3xl font-semibold tracking-tight ${theme.emphasis}`}>
                  {surface.headline}
                </h2>
                <p className={`mt-4 max-w-xl text-sm leading-7 ${theme.sectionText}`}>
                  {surface.description}
                </p>
              </div>
              <div className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] ${theme.eyebrow}`}>
                {surface.templateId}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {surface.bullets.map((item) => (
                <div
                  key={item}
                  className={`rounded-[1.5rem] p-4 ${theme.listItemShell}`}
                >
                  <p className={`text-sm leading-6 ${theme.sectionText}`}>{item}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className={`rounded-[2rem] p-6 lg:p-8 ${theme.sectionShell}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${theme.sectionLabel}`}>
                Fulfillment path
              </p>
              <div className="mt-6 space-y-3">
                {fulfillmentSteps.map((item) => (
                  <div
                    key={item}
                    className={`rounded-[1.5rem] p-4 ${theme.listItemShell}`}
                  >
                    <p className={`text-sm leading-6 ${theme.sectionText}`}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-[2rem] p-6 lg:p-8 ${theme.sectionShell}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${theme.sectionLabel}`}>
                FAQ
              </p>
              <div className="mt-6 space-y-4">
                {SITE_CONFIG.faq.map((item) => (
                  <div key={item.question} className="border-t border-current/10 pt-4 first:border-t-0 first:pt-0">
                    <p className={`text-base font-semibold ${theme.emphasis}`}>
                      {item.question}
                    </p>
                    <p className={`mt-2 text-sm leading-6 ${theme.sectionText}`}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className={`mt-16 rounded-[2.2rem] p-6 lg:p-8 ${theme.closingShell}`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className={`text-xs uppercase tracking-[0.24em] ${theme.sectionLabel}`}>
                Final CTA
              </p>
              <h2 className={`mt-4 text-3xl font-semibold tracking-tight ${theme.emphasis}`}>
                {SITE_CONFIG.pricing.headline}
              </h2>
              <p className={`mt-4 text-sm leading-7 ${theme.sectionText}`}>
                {SITE_CONFIG.pricing.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/pricing"
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${theme.primaryButton}`}
              >
                {SITE_CONFIG.pricing.buyButtonLabel}
              </Link>
              <Link
                to="/login"
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition ${theme.secondaryButton}`}
              >
                {SITE_CONFIG.navigation.loginLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
