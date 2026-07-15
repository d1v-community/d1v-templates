import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const entries = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 5);

  return (
    <div data-template="prompt-vault" className="bg-[#f3efe7] text-[#281f25]">
      <section className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid min-h-[calc(100svh-8rem)] border-y-2 border-[#281f25] lg:grid-cols-[0.42fr_0.58fr]">
          <div className="flex flex-col justify-between border-b-2 border-[#281f25] py-8 lg:border-b-0 lg:border-r-2 lg:pr-10">
            <div className="flex justify-between text-xs uppercase"><span>Prompt archive</span><span>Edition 01</span></div>
            <div className="my-16">
              <p className="font-serif text-lg italic text-[#b51f55]">Curated intelligence, kept useful.</p>
              <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.03] sm:text-6xl">{SITE_CONFIG.home.headline}</h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-[#675a62]">{SITE_CONFIG.home.description}</p>
              <div className="mt-9 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#281f25] px-5 py-3 text-sm font-semibold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border border-[#281f25] px-5 py-3 text-sm font-semibold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#675a62]">{user ? "Your member shelf is open." : "Browse the shape of the collection before entering the vault."}</p>
          </div>

          <div className="grid content-between gap-10 py-8 lg:pl-10">
            <div className="grid grid-cols-[auto_1fr_auto] items-center border-b border-[#281f25] pb-4 text-xs uppercase"><span>Index</span><span className="text-center">PromptVault</span><span>{sections.length || 3} collections</span></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex min-h-[22rem] flex-col justify-between bg-[#b51f55] p-6 text-white"><p className="text-xs uppercase">Member volume</p><div><p className="font-serif text-7xl">A</p><p className="mt-3 max-w-xs font-serif text-2xl">A working library for prompts worth returning to.</p></div><p className="text-xs">SEARCH / SAVE / APPLY</p></div>
              <div className="border border-[#281f25] bg-[#e2c9d3] p-6"><p className="text-xs uppercase">Collection notes</p><div className="mt-10 space-y-5">{(entries.length ? entries : [{ title: "Curated prompt systems", meta: "Member access", detail: "Organized for repeated use.", section: "Archive" }]).slice(0, 4).map((item, index) => <div key={`${item.title}-${index}`} className="border-t border-[#281f25] pt-3"><div className="flex justify-between gap-4 text-xs"><span>{item.section}</span><span>0{index + 1}</span></div><p className="mt-2 font-serif text-lg">{item.title}</p></div>)}</div></div>
            </div>
            <div className="grid gap-4 border-t border-[#281f25] pt-5 sm:grid-cols-3">{sections.slice(0, 3).map(section => <div key={section.key}><p className="font-serif text-3xl text-[#b51f55]">{section.total}</p><p className="mt-1 text-xs uppercase">{section.title}</p></div>)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
