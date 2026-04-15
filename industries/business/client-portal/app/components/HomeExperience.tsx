import { Link } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot, TemplateSnapshotSection } from "~/services/template-data.server";

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

function SuiteTabs({
  sections,
  activeKey,
  onChange,
  authenticated,
}: {
  sections: TemplateSnapshotSection[];
  activeKey: string;
  onChange: (key: string) => void;
  authenticated: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {sections.map((section) => {
        const isActive = section.key === activeKey;

        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onChange(section.key)}
            className={`rounded-full border px-4 py-2.5 text-sm transition ${
              isActive
                ? "border-[#b79d71] bg-[#b79d71] text-[#0f1728]"
                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:border-white/14 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/24 dark:hover:text-white"
            }`}
          >
            <span className="font-medium">{section.title}</span>
            <span className="ml-2 text-[11px] uppercase tracking-[0.18em] opacity-70">
              {section.total} {authenticated ? section.totalLabel : "preview"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PublicPreviewDeck({ section }: { section: TemplateSnapshotSection }) {
  const items = publicSectionItems(section);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.96fr_1.04fr]">
      <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,40,0.96),rgba(9,14,28,0.96))] dark:text-white dark:shadow-[0_24px_80px_rgba(2,6,23,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#b79d71]">
            Preview deck
          </p>
          <div className="rounded-full border border-slate-200 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600 dark:border-white/15 dark:text-slate-300">
            {section.total} live records
          </div>
        </div>

        <h3 className="mt-6 max-w-lg text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {section.title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          {section.description}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.6rem] border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Visible before login
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{items.length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Enough client-facing data to prove structure, cadence, and delivery quality.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Unlocked inside suite
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {Math.max(section.total - items.length, 0)}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Full records, ongoing delivery state, and deeper account visibility stay gated.
            </p>
          </div>
        </div>
      </article>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <article
            key={`${section.key}-${item.title}-${index}`}
            className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {item.meta}
                </p>
                <h4 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {item.title}
                </h4>
              </div>
              <div className="rounded-full border border-slate-200 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Item {index + 1}
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {item.detail}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function workspaceTabNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function SignedInWorkspace({
  sections,
  activeSection,
  activeKey,
  onChange,
  generatedAt,
  viewerLabel,
}: {
  sections: TemplateSnapshotSection[];
  activeSection: TemplateSnapshotSection;
  activeKey: string;
  onChange: (key: string) => void;
  generatedAt: string;
  viewerLabel: string;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Workspace desk
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {viewerLabel}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Move across clients, projects, and uploads from one structured service view.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
          Refreshed {generatedAt}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Workspace datasets"
        className="mt-8 grid gap-3 lg:grid-cols-3"
      >
        {sections.map((section, index) => {
          const isActive = section.key === activeKey;

          return (
            <button
              key={section.key}
              id={`workspace-tab-${section.key}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`workspace-panel-${section.key}`}
              onClick={() => onChange(section.key)}
              className={`rounded-[1.5rem] border p-4 text-left transition ${
                isActive
                  ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{section.title}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] opacity-70">
                    {section.total} {section.totalLabel}
                  </p>
                </div>
                <div className="rounded-full border border-current/15 px-3 py-1 text-[11px] uppercase tracking-[0.18em] opacity-70">
                  {workspaceTabNumber(index)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <section
        id={`workspace-panel-${activeSection.key}`}
        role="tabpanel"
        aria-labelledby={`workspace-tab-${activeSection.key}`}
        className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900 lg:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Active dataset
            </p>
            <h4 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {activeSection.title}
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {activeSection.description}
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
            {activeSection.total} {activeSection.totalLabel}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="grid grid-cols-[88px_minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4 border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-5">
            <div>Record</div>
            <div>Name</div>
            <div>Context</div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {activeSection.items.map((item, index) => (
              <article
                key={`${activeSection.key}-${item.title}-${index}`}
                className="grid gap-4 px-4 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-900/80 sm:grid-cols-[88px_minmax(0,1.2fr)_minmax(0,0.8fr)] sm:px-5"
              >
                <div className="flex items-start">
                  <div className="rounded-full border border-slate-200 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {workspaceTabNumber(index)}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    {item.meta}
                  </p>
                  <h5 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                    {item.title}
                  </h5>
                </div>

                <div className="min-w-0">
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

export function HomeExperience({
  snapshot,
  user,
}: {
  snapshot?: TemplateSnapshot | null;
  user?: AppHeaderUser;
}) {
  const surface = SITE_CONFIG.templateSurface;
  const fulfillmentSteps = SITE_CONFIG.paymentSuccess.nextSteps.slice(0, 3);
  const modules = SITE_CONFIG.featureSections;
  const sectionKeyList = useMemo(
    () => snapshot?.sections.map((section) => section.key) ?? [],
    [snapshot],
  );
  const [activeSectionKey, setActiveSectionKey] = useState<string>(sectionKeyList[0] ?? "");
  const [activeModuleTitle, setActiveModuleTitle] = useState<string>(modules[0]?.title ?? "");

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
  const displayName = user?.displayName || user?.username || user?.email || "Client account";
  const isAuthenticated = Boolean(user);
  const [leadPanel, ...supportPanels] = SITE_CONFIG.showcase.panels;

  return (
    <section
      data-template={surface.templateId}
      className="relative isolate overflow-hidden bg-slate-50 dark:bg-[#09111f]"
    >
      <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_top_left,_rgba(183,157,113,0.20),_transparent_28%),radial-gradient(circle_at_82%_14%,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(180deg,_rgba(9,17,31,1),_rgba(5,10,20,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:88px_88px] opacity-40 dark:opacity-25" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#b79d71] dark:border-white/14 dark:bg-white/5">
              {SITE_CONFIG.home.badge}
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
              {SITE_CONFIG.home.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              {SITE_CONFIG.home.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={SITE_CONFIG.home.primaryCtaHref}
                className="inline-flex items-center justify-center rounded-full bg-[#b79d71] px-6 py-3 text-sm font-medium text-[#0f1728] transition hover:bg-[#c9b389]"
              >
                {SITE_CONFIG.home.primaryCtaLabel}
              </Link>
              <Link
                to={SITE_CONFIG.home.secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/14 dark:bg-white/5 dark:text-white dark:hover:border-white/24 dark:hover:bg-white/10"
              >
                {SITE_CONFIG.home.secondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {SITE_CONFIG.heroMetrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[1.7rem] border border-slate-200 bg-white/70 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_50px_rgba(2,6,23,0.20)]"
                >
                  <p className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{metric.value}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{metric.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{metric.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <section className="overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white p-6 shadow-[0_26px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,40,0.94),rgba(9,14,28,0.92))] dark:shadow-[0_30px_100px_rgba(2,6,23,0.35)] lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#b79d71]">
                  {SITE_CONFIG.showcase.eyebrow}
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[2.45rem]">
                  {SITE_CONFIG.showcase.title}
                </h2>
              </div>
              <div className="rounded-full border border-slate-200 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600 dark:border-white/12 dark:text-slate-300">
                Service visibility
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {SITE_CONFIG.showcase.description}
            </p>

            {leadPanel ? (
              <div className="mt-8 grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
                <article className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    {leadPanel.meta}
                  </p>
                  <h3 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {leadPanel.title}
                  </h3>
                  <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-[#b79d71]">
                    {leadPanel.value}
                  </p>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {leadPanel.detail}
                  </p>
                </article>

                <div className="space-y-3">
                  {supportPanels.map((panel) => (
                    <article
                      key={panel.title}
                      className="rounded-[1.55rem] border border-slate-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/20 dark:shadow-none"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">{panel.title}</p>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          {panel.meta}
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-[#b79d71]">
                        {panel.value}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {panel.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>

        {snapshot && activeSection ? (
          <section
            id="workspace"
            className="mt-16 rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,40,0.94),rgba(9,14,28,0.92))] dark:shadow-[0_24px_80px_rgba(2,6,23,0.30)] lg:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#b79d71]">
                  {isAuthenticated ? "Live account suite" : "Client preview"}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {snapshot.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {snapshot.description}
                </p>
              </div>
              <div className="rounded-full border border-slate-200 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-slate-600 dark:border-white/12 dark:text-slate-300">
                {isAuthenticated ? "Account open" : "Public mode"}
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="mt-8 space-y-6">
                <SuiteTabs
                  sections={snapshot.sections}
                  activeKey={activeSection.key}
                  onChange={setActiveSectionKey}
                  authenticated={isAuthenticated}
                />
                <PublicPreviewDeck section={activeSection} />
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-[#b79d71] px-6 py-3 text-sm font-medium text-[#0f1728] transition hover:bg-[#c9b389]"
                  >
                    Unlock client suite
                  </Link>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/14 dark:bg-white/5 dark:text-white dark:hover:border-white/24 dark:hover:bg-white/10"
                  >
                    View portal plan
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
                  viewerLabel={displayName}
                />
              </div>
            )}
          </section>
        ) : null}

        <div id="modules" className="mt-16 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,40,0.92),rgba(9,14,28,0.92))] dark:shadow-[0_18px_60px_rgba(2,6,23,0.28)] lg:p-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#b79d71]">
              {SITE_CONFIG.workflow.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {SITE_CONFIG.workflow.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {SITE_CONFIG.workflow.description}
            </p>

            <div className="mt-8 space-y-4">
              {SITE_CONFIG.workflow.steps.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-4 rounded-[1.55rem] border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-[auto_1fr]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-500 dark:border-white/14 dark:text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-950 dark:text-white">{step.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {activeModule ? (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950 lg:p-8">
              <div className="flex flex-wrap gap-3">
                {modules.map((module) => {
                  const isActive = module.title === activeModule.title;

                  return (
                    <button
                      key={module.title}
                      type="button"
                      onClick={() => setActiveModuleTitle(module.title)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                      }`}
                    >
                      {module.eyebrow}
                    </button>
                  );
                })}
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {activeModule.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                {activeModule.description}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {activeModule.items.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    {item.meta ? (
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                        {item.meta}
                      </p>
                    ) : null}
                    <p className="mt-3 text-base font-semibold text-slate-950 dark:text-white">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.97fr_1.03fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  {surface.badge}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {surface.headline}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {surface.description}
                </p>
              </div>
              <div className="rounded-full border border-slate-200 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {surface.templateId}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {surface.bullets.map((item) => (
                <article
                  key={item}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,40,0.94),rgba(9,14,28,0.92))] dark:shadow-[0_18px_60px_rgba(2,6,23,0.28)] lg:p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#b79d71]">
                Fulfillment path
              </p>
              <div className="mt-6 space-y-3">
                {fulfillmentSteps.map((item) => (
                  <article
                    key={item}
                    className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950 lg:p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                FAQ
              </p>
              <div className="mt-6 space-y-4">
                {SITE_CONFIG.faq.map((item) => (
                  <article
                    key={item.question}
                    className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 dark:border-slate-800"
                  >
                    <p className="text-base font-semibold text-slate-950 dark:text-white">
                      {item.question}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="mt-16 rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-[0_26px_80px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,40,0.98),rgba(9,14,28,0.96))] dark:shadow-[0_26px_80px_rgba(2,6,23,0.32)] lg:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#b79d71]">
                Final invitation
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {SITE_CONFIG.pricing.headline}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {SITE_CONFIG.pricing.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full bg-[#b79d71] px-6 py-3 text-sm font-medium text-[#0f1728] transition hover:bg-[#c9b389]"
              >
                {SITE_CONFIG.pricing.buyButtonLabel}
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-100 dark:border-white/14 dark:bg-white/5 dark:text-white dark:hover:border-white/24 dark:hover:bg-white/10"
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
