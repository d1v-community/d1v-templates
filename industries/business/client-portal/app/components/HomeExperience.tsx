import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const active = sections[0];

  return (
    <div data-template="client-room" className="bg-[#fbfaf8] text-[#291b20]">
      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid min-h-[calc(100svh-9rem)] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-4"><span className="h-px w-12 bg-[#8b2f43]" /><p className="text-xs uppercase text-[#8b2f43]">Private client service</p></div>
            <h1 className="mt-8 max-w-2xl font-serif text-5xl leading-[1.05] sm:text-6xl">{SITE_CONFIG.home.headline}</h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#6e6266]">{SITE_CONFIG.home.description}</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#8b2f43] px-5 py-3 text-sm font-semibold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border border-[#8b2f43] px-5 py-3 text-sm font-semibold text-[#8b2f43]">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div>
            <div className="mt-16 grid gap-5 border-t border-[#cfc7c8] pt-6 sm:grid-cols-3">{SITE_CONFIG.templateSurface.bullets.slice(0, 3).map((bullet, index) => <div key={bullet}><p className="font-serif text-xl text-[#8b2f43]">0{index + 1}</p><p className="mt-3 text-sm leading-6 text-[#6e6266]">{bullet}</p></div>)}</div>
          </div>

          <div id="workspace" className="relative border border-[#d8d2cf] bg-white p-4 shadow-[0_28px_80px_rgba(41,27,32,0.12)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[#d8d2cf] pb-5"><div><p className="text-xs uppercase text-[#8b2f43]">Client briefing room</p><p className="mt-2 font-serif text-2xl">{snapshot?.title ?? "A polished place for every engagement"}</p></div><span className="hidden rounded-full border border-[#d8d2cf] px-3 py-1 text-xs sm:block">{user ? "Private" : "Preview"}</span></div>
            <div className="grid gap-6 py-7 sm:grid-cols-[0.38fr_0.62fr]">
              <div className="space-y-2">{sections.slice(0, 3).map((section, index) => <div key={section.key} className={index === 0 ? "bg-[#f2e9eb] p-4" : "p-4"}><p className="text-sm font-semibold">{section.title}</p><p className="mt-1 text-xs text-[#8b7d81]">{section.total} {section.totalLabel}</p></div>)}</div>
              <div className="border-l border-[#d8d2cf] pl-6"><p className="text-xs uppercase text-[#8b7d81]">Current engagement</p><h2 className="mt-4 font-serif text-3xl">{active?.title ?? "Your service, clearly presented"}</h2><p className="mt-3 text-sm leading-6 text-[#6e6266]">{active?.description ?? "Milestones, requests and deliverables remain legible from first payment to final handoff."}</p><div className="mt-7 divide-y divide-[#e6e1df] border-y border-[#e6e1df]">{(active?.items ?? []).slice(0, 3).map((item, index) => <div key={`${item.title}-${index}`} className="py-4"><div className="flex items-start justify-between gap-4"><p className="font-medium">{item.title}</p><span className="text-xs text-[#8b2f43]">{item.meta}</span></div><p className="mt-1 text-xs text-[#8b7d81]">{item.detail}</p></div>)}</div></div>
            </div>
            <div className="flex items-center justify-between border-t border-[#d8d2cf] pt-5 text-xs text-[#8b7d81]"><span>One account · One engagement history</span><span>ClientRoom</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
