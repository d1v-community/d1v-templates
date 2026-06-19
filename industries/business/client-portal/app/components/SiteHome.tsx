import { SectionShell } from '~/components/sections/SectionShell';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { WorkflowSection } from '~/components/sections/WorkflowSection';
import { FeatureGridSection } from '~/components/sections/FeatureGridSection';
import { FaqSection } from '~/components/sections/FaqSection';
import { ClosingCtaSection } from '~/components/sections/ClosingCtaSection';
import { HomeExperience } from '~/components/HomeExperience';
import { AppHeader } from '~/components/AppHeader';
import { AppFooter } from '~/components/AppFooter';
import { SignedOutToast } from '~/components/SignedOutToast';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import type { TemplateSnapshot } from '~/services/template-data.server';

interface SiteHomeProps {
  snapshot?: TemplateSnapshot | null;
  user?: AppHeaderUser;
  onLogout?: () => void;
  warnings?: string[];
  showSignedOutToast?: boolean;
}

type AppHeaderUser = import('~/components/AppHeader').AppHeaderUser;

function ShowcasePanels() {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const showcase = SITE_CONFIG.showcase;

  if (!showcase?.panels?.length) return null;

  return (
    <SectionShell
      id="showcase"
      eyebrow={showcase.eyebrow}
      title={showcase.title}
      description={showcase.description}
      tone="canvas"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showcase.panels.map(panel => (
          <article
            key={panel.title}
            className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
          >
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}
            >
              {panel.meta}
            </span>
            <h3 className="text-sm font-semibold tracking-tight opacity-80">{panel.title}</h3>
            <p className={`text-3xl font-semibold tracking-[-0.04em] ${theme.metricValue}`}>
              {panel.value}
            </p>
            <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{panel.detail}</p>
            <SceneBackground
              kind={SITE_CONFIG.home.industry.sceneKind}
              className="!bg-none opacity-0 group-hover:opacity-100"
            />
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function TemplateSurface() {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const surface = SITE_CONFIG.templateSurface;
  if (!surface) return null;

  return (
    <SectionShell
      id="surface"
      eyebrow={surface.badge}
      title={surface.headline}
      description={surface.description}
      tone="panel"
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {surface.bullets.map((bullet, i) => (
          <li
            key={bullet}
            className={`flex items-start gap-3 rounded-2xl p-4 ${theme.listItemShell}`}
          >
            <span
              className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold ${theme.eyebrow}`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-sm leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export function SiteHome({ snapshot, user, onLogout, warnings = [], showSignedOutToast = false }: SiteHomeProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {warnings.map(warning => (
        <div
          key={warning}
          className="w-full bg-red-50 border-b border-red-200 text-red-700 text-sm text-center py-2 px-4 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200"
        >
          {warning}
        </div>
      ))}

      <SignedOutToast active={showSignedOutToast} />

      <AppHeader user={user ?? null} onLogout={onLogout ?? (() => {})} />

      <main className="flex-1 min-h-0 space-y-6 sm:space-y-8 pb-10">
        <HomeExperience snapshot={snapshot} user={user ?? null} />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <ShowcasePanels />
          <TemplateSurface />
          <WorkflowSection />
          {(SITE_CONFIG.featureSections ?? []).map((_, i) => (
            <FeatureGridSection key={i} index={i} />
          ))}
          <FaqSection />
          <ClosingCtaSection />
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
