import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const posts = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 4);

  return (
    <div data-template="inner-circle" className="bg-[#f4e9d8] text-[#19382c]">
      <section className="mx-auto max-w-[1460px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.52fr_0.48fr]">
          <div className="flex min-h-[42rem] flex-col justify-between bg-[#19382c] p-7 text-[#f4e9d8] sm:p-10">
            <div className="flex justify-between text-xs uppercase"><span>InnerCircle</span><span>{user ? "Member edition" : "Open edition"}</span></div>
            <div className="my-16"><p className="font-serif text-xl italic text-[#f3b24a]">A membership with a pulse.</p><h1 className="mt-6 max-w-2xl font-serif text-5xl leading-[1.02] sm:text-7xl">{SITE_CONFIG.home.headline}</h1><p className="mt-7 max-w-xl text-base leading-7 text-[#c9d1c5]">{SITE_CONFIG.home.description}</p><div className="mt-9 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#f3b24a] px-5 py-3 text-sm font-bold text-[#19382c]">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border border-[#f4e9d8]/60 px-5 py-3 text-sm font-semibold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div></div>
            <p className="max-w-md border-t border-[#f4e9d8]/30 pt-5 text-sm leading-6">Private posts, shared rituals, and recurring reasons to come back.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="flex min-h-[20rem] flex-col justify-between bg-[#d94b38] p-7 text-white"><p className="text-xs uppercase">This week inside</p><p className="font-serif text-4xl">Ideas become a community when people can answer back.</p><p className="text-xs">POSTS / EVENTS / PERKS</p></div>
            <div className="border-2 border-[#19382c] p-7"><p className="text-xs uppercase">The rhythm</p><div className="mt-10 space-y-7">{sections.slice(0, 3).map((section, index) => <div key={section.key} className="grid grid-cols-[auto_1fr] gap-4"><p className="font-serif text-3xl text-[#d94b38]">0{index + 1}</p><div><p className="font-semibold">{section.title}</p><p className="mt-1 text-sm leading-6 text-[#52685f]">{section.description}</p></div></div>)}</div></div>
            <div id="workspace" className="border-t-2 border-[#19382c] pt-5 sm:col-span-2 lg:col-span-1 xl:col-span-2"><div className="flex justify-between text-xs uppercase"><span>Member dispatch</span><span>{posts.length || 1} recent</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{(posts.length ? posts : [{ title: "Your first member story", meta: "Draft", detail: "Give the community something worth discussing.", section: "Posts" }]).map((item, index) => <article key={`${item.title}-${index}`} className={index === 0 ? "bg-[#f3b24a] p-5" : "border border-[#19382c] p-5"}><p className="text-xs uppercase">{item.section} / {item.meta}</p><h2 className="mt-5 font-serif text-2xl">{item.title}</h2><p className="mt-3 text-sm leading-6">{item.detail}</p></article>)}</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
