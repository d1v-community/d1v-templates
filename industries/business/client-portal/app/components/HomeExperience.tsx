import { Link } from '@remix-run/react';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import type { TemplateSnapshot } from '~/services/template-data.server';
import type { AppHeaderUser } from '~/components/AppHeader';

type PreviewRow = {
  label: string;
  value: string;
  meta: string;
};

function formatGeneratedAt(generatedAt?: string | null) {
  if (!generatedAt) return null;

  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function buildPreviewRows(snapshot?: TemplateSnapshot | null): PreviewRow[] {
  if (snapshot?.sections.length) {
    return snapshot.sections.slice(0, 3).map(section => ({
      label: section.title,
      value: `${section.total} ${section.totalLabel}`,
      meta: section.items[0]?.title || section.items[0]?.meta || section.key,
    }));
  }

  return SITE_CONFIG.heroMetrics.slice(0, 3).map(metric => ({
    label: metric.label,
    value: metric.value,
    meta: APP_TITLE,
  }));
}

export function HomeExperience({
  snapshot,
  user,
}: {
  snapshot?: TemplateSnapshot | null;
  user?: AppHeaderUser;
}) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const previewRows = buildPreviewRows(snapshot);
  const generatedAt = formatGeneratedAt(snapshot?.generatedAt);
  const secondaryCta = user
    ? { href: '#workspace-preview', label: 'Preview' }
    : {
        href: SITE_CONFIG.home.secondaryCtaHref,
        label: SITE_CONFIG.home.secondaryCtaLabel,
      };

  return (
    <section className={`relative overflow-hidden ${theme.heroShell}`}>
      <div className={`absolute inset-0 ${theme.heroGlow}`} />
      <div className="absolute inset-x-0 top-0 h-40 bg-white/10 blur-3xl dark:bg-white/5" />
      <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-white/14 blur-3xl motion-safe:animate-pulse dark:bg-white/8" />
      <div
        className="absolute -right-12 bottom-16 h-48 w-48 rounded-full bg-white/12 blur-3xl motion-safe:animate-pulse dark:bg-white/8"
        style={{ animationDelay: '900ms' }}
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-8.5rem)] max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end">
          <div className="max-w-3xl space-y-6">
            <div className="space-y-4">
              <div
                className={`inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}`}
              >
                {SITE_CONFIG.home.badge}
              </div>

              <div className="space-y-3">
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${theme.subEyebrow}`}
                >
                  {APP_TITLE}
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] sm:text-5xl lg:text-[4.5rem] lg:leading-[0.92]">
                  {SITE_CONFIG.home.headline}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={SITE_CONFIG.home.primaryCtaHref}
                className={`inline-flex min-w-[9rem] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition motion-safe:hover:-translate-y-0.5 ${theme.primaryButton}`}
              >
                {SITE_CONFIG.home.primaryCtaLabel}
              </Link>
              <Link
                to={secondaryCta.href}
                className={`inline-flex min-w-[9rem] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition motion-safe:hover:-translate-y-0.5 ${theme.secondaryButton}`}
              >
                {secondaryCta.label}
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {SITE_CONFIG.heroMetrics.slice(0, 3).map(metric => (
                <div
                  key={metric.label}
                  className={`rounded-[1.6rem] p-4 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] opacity-60">
                    {metric.label}
                  </p>
                  <p
                    className={`mt-3 text-2xl font-semibold tracking-[-0.05em] ${theme.metricValue}`}
                  >
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside
            id="workspace-preview"
            className={`overflow-hidden rounded-[2rem] p-5 sm:p-6 ${theme.showcaseShell}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.eyebrow}`}
              >
                {SITE_CONFIG.templateSurface.badge}
              </div>
              <div className={`text-[11px] font-medium uppercase tracking-[0.22em] ${theme.body}`}>
                {user ? 'Signed in' : 'Public'}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p
                className={`text-[11px] font-medium uppercase tracking-[0.24em] ${theme.subEyebrow}`}
              >
                Workspace
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.05em] sm:text-[2rem]">
                {SITE_CONFIG.templateSurface.headline}
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {previewRows.map(row => (
                <div
                  key={row.label}
                  className={`grid gap-2 rounded-[1.5rem] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center ${theme.metricShell}`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                      {row.label}
                    </p>
                    <p className="mt-2 truncate text-sm font-medium opacity-80">{row.meta}</p>
                  </div>
                  <p
                    className={`text-sm font-semibold tracking-[-0.02em] sm:text-right ${theme.metricValue}`}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em]">
              <span className={theme.subEyebrow}>{SITE_CONFIG.navigation.pricingLabel}</span>
              <span className="opacity-30">/</span>
              <span className={theme.body}>{secondaryCta.label}</span>
              {generatedAt ? (
                <>
                  <span className="opacity-30">/</span>
                  <span className={theme.body}>{generatedAt}</span>
                </>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
