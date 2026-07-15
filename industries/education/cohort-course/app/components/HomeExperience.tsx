import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const sessions = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 4);

  return (
    <div data-template="cohort-os" className="bg-[#f2f0e8] text-[#151515]">
      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid border-y-2 border-black lg:grid-cols-12">
          <div className="flex min-h-[39rem] flex-col justify-between border-b-2 border-black py-10 lg:col-span-7 lg:border-b-0 lg:border-r-2 lg:pr-10">
            <div><div className="grid grid-cols-2 text-xs font-bold uppercase"><span>CohortOS / Academy</span><span className="text-right">Session 01</span></div><h1 className="mt-14 max-w-4xl text-5xl font-bold leading-[1.02] sm:text-7xl">{SITE_CONFIG.home.headline}</h1><p className="mt-7 max-w-2xl text-lg leading-7">{SITE_CONFIG.home.description}</p></div>
            <div className="mt-10 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#d72b25] px-5 py-3 text-sm font-bold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border-2 border-black px-5 py-3 text-sm font-bold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div>
          </div>
          <div className="grid lg:col-span-5 lg:pl-10">
            <div className="flex flex-col justify-between bg-[#d72b25] p-7 text-white lg:my-10"><p className="text-xs font-bold uppercase">Learning is a shared calendar</p><p className="my-14 text-8xl font-bold leading-none">C↗</p><div><p className="text-2xl font-bold">Seats. Sessions. Momentum.</p><p className="mt-3 max-w-sm text-sm leading-6 text-white/80">A cohort is more than content: it is a sequence of people arriving at the same work together.</p></div></div>
          </div>
        </div>
        <div id="workspace" className="grid border-b-2 border-black lg:grid-cols-[0.28fr_0.72fr]">
          <div className="border-b-2 border-black py-7 lg:border-b-0 lg:border-r-2 lg:pr-7"><p className="text-xs font-bold uppercase">Program structure</p><div className="mt-7 space-y-5">{sections.slice(0, 3).map((section, index) => <div key={section.key}><p className="text-4xl font-bold text-[#d72b25]">0{index + 1}</p><p className="mt-2 font-bold">{section.title}</p><p className="mt-1 text-xs">{section.total} {section.totalLabel}</p></div>)}</div></div>
          <div className="py-7 lg:pl-7"><div className="flex justify-between text-xs font-bold uppercase"><span>Shared learning calendar</span><span>{user ? "Student view" : "Program preview"}</span></div><div className="mt-6 grid border-l-2 border-t-2 border-black sm:grid-cols-2">{(sessions.length ? sessions : [{ title: "Your first live session", meta: "Scheduled", detail: "Set the learning milestone and seat policy.", section: "Sessions" }]).map((item, index) => <article key={`${item.title}-${index}`} className="border-b-2 border-r-2 border-black p-5"><div className="flex justify-between text-xs"><span>W{String(index + 1).padStart(2, "0")}</span><span className="text-[#d72b25]">{item.meta}</span></div><h2 className="mt-10 text-xl font-bold">{item.title}</h2><p className="mt-3 text-sm leading-6">{item.detail}</p><p className="mt-5 text-xs font-bold uppercase">{item.section}</p></article>)}</div></div>
        </div>
      </section>
    </div>
  );
}
