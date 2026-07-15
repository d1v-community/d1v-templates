import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const stories = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 5);

  return (
    <div data-template="brief-club" className="bg-[#faf9f5] text-[#111111]">
      <section className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-12">
        <header className="border-y-4 border-black py-4 text-center"><p className="text-xs font-bold uppercase">Independent intelligence for paying readers</p><p className="mt-2 font-serif text-5xl font-bold sm:text-7xl">BriefClub</p><div className="mt-3 flex justify-between border-t border-black pt-3 text-xs"><span>Volume 01</span><span>{user ? "Subscriber edition" : "Public edition"}</span><span>Daily / considered</span></div></header>
        <div className="grid border-b-4 border-black lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b-2 border-black py-10 lg:border-b-0 lg:border-r-2 lg:pr-10"><p className="text-xs font-bold uppercase text-[#184ac9]">The lead story</p><h1 className="mt-5 max-w-4xl font-serif text-5xl font-bold leading-[1.02] sm:text-6xl">{SITE_CONFIG.home.headline}</h1><p className="mt-6 max-w-2xl font-serif text-lg leading-8">{SITE_CONFIG.home.description}</p><div className="mt-8 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#184ac9] px-5 py-3 text-sm font-bold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border-2 border-black px-5 py-3 text-sm font-bold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div></div>
          <aside className="py-10 lg:pl-10"><p className="text-xs font-bold uppercase">Why readers stay</p><div className="mt-6 divide-y divide-black border-y border-black">{SITE_CONFIG.templateSurface.bullets.slice(0, 3).map((bullet, index) => <div key={bullet} className="grid grid-cols-[auto_1fr] gap-4 py-4"><span className="font-serif text-3xl text-[#184ac9]">0{index + 1}</span><p className="text-sm leading-6">{bullet}</p></div>)}</div></aside>
        </div>
        <div id="workspace" className="grid border-b-4 border-black lg:grid-cols-[0.7fr_0.3fr]">
          <div className="border-b-2 border-black py-8 lg:border-b-0 lg:border-r-2 lg:pr-8"><div className="flex justify-between text-xs font-bold uppercase"><span>Latest from the archive</span><span>{stories.length || 1} briefs</span></div><div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2">{(stories.length ? stories : [{ title: "Your premium issue begins here", meta: "Draft", detail: "Publish a point of view worth subscribing to.", section: "Issues" }]).slice(0, 4).map((item, index) => <article key={`${item.title}-${index}`} className="border-t-2 border-black pt-4"><p className="text-xs font-bold uppercase text-[#184ac9]">{item.section} / {item.meta}</p><h2 className="mt-4 font-serif text-2xl font-bold leading-tight">{item.title}</h2><p className="mt-3 text-sm leading-6 text-[#555]">{item.detail}</p></article>)}</div></div>
          <div className="py-8 lg:pl-8"><p className="text-xs font-bold uppercase">Archive desk</p>{sections.slice(0, 3).map(section => <div key={section.key} className="border-b border-black py-5"><div className="flex items-end justify-between gap-4"><p className="font-serif text-xl font-bold">{section.title}</p><p className="text-3xl font-bold text-[#184ac9]">{section.total}</p></div><p className="mt-2 text-xs">{section.totalLabel}</p></div>)}</div>
        </div>
      </section>
    </div>
  );
}
