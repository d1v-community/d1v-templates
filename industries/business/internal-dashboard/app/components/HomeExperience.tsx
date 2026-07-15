import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const items = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 4);

  return (
    <div data-template="ops-canvas" className="bg-[#f7f8f5] text-[#17233d]">
      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="flex min-h-[38rem] flex-col justify-between">
            <div><p className="text-xs font-bold uppercase text-[#e05d35]">Operations intelligence / report 01</p><h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[1.04] sm:text-6xl">{SITE_CONFIG.home.headline}</h1><p className="mt-6 max-w-lg text-base leading-7 text-[#657087]">{SITE_CONFIG.home.description}</p><div className="mt-8 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#17233d] px-5 py-3 text-sm font-semibold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border border-[#17233d] px-5 py-3 text-sm font-semibold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div></div>
            <div className="border-t-2 border-[#17233d] pt-5"><p className="max-w-md text-sm leading-6 text-[#657087]">A calm reporting surface for the decisions, approvals, and numbers that keep a company moving.</p><p className="mt-5 text-xs uppercase text-[#e05d35]">{user ? "Authenticated reporting" : "Preview dataset"}</p></div>
          </div>

          <div id="workspace" className="border border-[#cfd4cc] bg-white">
            <div className="flex items-center justify-between border-b border-[#cfd4cc] px-5 py-4 text-xs uppercase"><span>OpsCanvas / Executive readout</span><span className="text-[#e05d35]">Current</span></div>
            <div className="grid border-b border-[#cfd4cc] sm:grid-cols-3">{sections.slice(0, 3).map((section, index) => <div key={section.key} className="border-b border-[#cfd4cc] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><p className="text-xs uppercase text-[#657087]">0{index + 1} / {section.title}</p><p className="mt-5 text-4xl font-semibold">{section.total}</p><p className="mt-2 text-xs text-[#657087]">{section.totalLabel}</p></div>)}</div>
            <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
              <div className="border-b border-[#cfd4cc] p-5 lg:border-b-0 lg:border-r"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase">Operational register</p><p className="text-xs text-[#657087]">Status / owner</p></div><div className="mt-6 divide-y divide-[#dfe3dd] border-y border-[#dfe3dd]">{(items.length ? items : [{ title: "Live reporting layer", meta: "Ready", detail: "Connect your operational records.", section: "Overview" }]).map((item, index) => <div key={`${item.title}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="text-xs text-[#e05d35]">0{index + 1}</span><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs text-[#657087]">{item.section} · {item.detail}</p></div><span className="text-xs font-semibold">{item.meta}</span></div>)}</div></div>
              <div className="p-5"><p className="text-xs font-bold uppercase">Decision signal</p><div className="mt-8 flex h-48 items-end gap-2 border-b border-l border-[#9aa39a] px-3">{[42,68,51,82,64,91,74].map((height,index) => <div key={index} className={index === 5 ? "flex-1 bg-[#e05d35]" : "flex-1 bg-[#17233d]"} style={{ height: `${height}%` }} />)}</div><div className="mt-5 flex justify-between text-xs text-[#657087]"><span>7 day signal</span><span>Directional</span></div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
