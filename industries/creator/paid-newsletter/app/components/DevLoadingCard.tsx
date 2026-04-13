import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";

export function DevLoadingCard() {
  const surface = SITE_CONFIG.templateSurface;

  return (
    <section
      data-template={surface.templateId}
      className="relative isolate overflow-hidden bg-slate-950 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_38%),radial-gradient(circle_at_70%_25%,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.45),_rgba(2,6,23,0.92))]" />
      <div className="absolute inset-y-0 right-0 w-[42rem] max-w-full bg-[linear-gradient(135deg,_rgba(59,130,246,0.14),_transparent_45%,_rgba(16,185,129,0.10))]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-120px)] max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-sky-200">
            {SITE_CONFIG.home.badge}
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {SITE_CONFIG.home.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {SITE_CONFIG.home.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={SITE_CONFIG.home.primaryCtaHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
            >
              {SITE_CONFIG.home.primaryCtaLabel}
            </Link>
            <Link
              to={SITE_CONFIG.home.secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {SITE_CONFIG.home.secondaryCtaLabel}
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {SITE_CONFIG.home.proofPoints.map((item) => (
              <div
                key={item}
                className="border-t border-white/10 pt-3 text-sm leading-6 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full border border-white/10 bg-white/5 p-6 backdrop-blur xl:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
                {surface.badge}
              </div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                {surface.templateId}
              </div>
            </div>

            <div className="mt-8">
              <div className="h-px w-full bg-gradient-to-r from-sky-400/0 via-sky-400/50 to-sky-400/0" />
              <div className="mt-8">
                <p className="text-sm uppercase tracking-[0.24em] text-sky-200">
                  Foundation surface
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {surface.headline}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {surface.description}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {surface.bullets.map((item, index) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-medium text-sky-200">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
