import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const reservation = sections[0]?.items[0];

  return (
    <div data-template="first-drop" className="overflow-hidden bg-[#ff5b45] text-[#16110f]">
      <section className="relative mx-auto min-h-[calc(100svh-4rem)] max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="absolute -right-20 top-24 hidden h-80 w-80 rotate-12 bg-[#f8de3c] lg:block" />
        <div className="relative border-y-4 border-black">
          <div className="flex items-center justify-between border-b-2 border-black py-3 text-xs font-black uppercase"><span>FirstDrop / preorder system</span><span>Release 001</span></div>
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <div className="flex min-h-[36rem] flex-col justify-between border-b-2 border-black py-10 lg:border-b-0 lg:border-r-2 lg:pr-10">
              <div><p className="text-sm font-black uppercase">The launch starts before inventory lands.</p><h1 className="mt-6 max-w-5xl text-6xl font-black uppercase leading-[0.88] sm:text-8xl lg:text-9xl">{SITE_CONFIG.home.headline}</h1></div>
              <div className="mt-10 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end"><p className="max-w-xl text-lg font-medium leading-7">{SITE_CONFIG.home.description}</p><div className="flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-black px-5 py-3 text-sm font-bold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border-2 border-black bg-[#f8de3c] px-5 py-3 text-sm font-bold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div></div>
            </div>
            <div className="relative flex flex-col justify-between bg-[#f8de3c] p-7 lg:my-10 lg:ml-10"><p className="text-xs font-black uppercase">Reservation window</p><div className="my-12"><p className="text-[8rem] font-black leading-none">01</p><p className="mt-4 text-2xl font-black uppercase">Drop / clear / accountable</p></div><div className="border-t-2 border-black pt-4 text-sm"><p>{reservation?.title ?? "Your launch offer"}</p><p className="mt-2 font-bold">{reservation?.meta ?? (user ? "Reserved" : "Ready for preorder")}</p></div></div>
          </div>
        </div>
        <div id="workspace" className="relative grid border-b-4 border-black bg-[#f7efe5] lg:grid-cols-3">{sections.slice(0, 3).map((section, index) => <article key={section.key} className="border-b-2 border-black p-6 last:border-b-0 lg:border-b-0 lg:border-r-2 lg:last:border-r-0"><div className="flex justify-between text-xs font-black uppercase"><span>0{index + 1}</span><span>{section.total} {section.totalLabel}</span></div><h2 className="mt-12 text-3xl font-black uppercase">{section.title}</h2><p className="mt-4 text-sm leading-6">{section.description}</p></article>)}</div>
      </section>
    </div>
  );
}
