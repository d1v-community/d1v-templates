import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const files = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 6);

  return (
    <div data-template="download-port" className="bg-[#f1f0ea] text-[#111111]">
      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="border-y-4 border-black">
          <div className="grid border-b-2 border-black py-3 text-xs font-bold uppercase sm:grid-cols-3"><span>DownloadPort</span><span className="text-center">Digital goods index</span><span className="text-right">Access / permanent</span></div>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex min-h-[34rem] flex-col justify-between border-b-2 border-black py-10 lg:border-b-0 lg:border-r-2 lg:pr-10">
              <div><p className="inline-block bg-[#1746d1] px-3 py-1 text-xs font-bold uppercase text-white">Files that arrive instantly</p><h1 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.96] sm:text-7xl">{SITE_CONFIG.home.headline}</h1><p className="mt-7 max-w-2xl text-lg leading-7">{SITE_CONFIG.home.description}</p></div>
              <div className="mt-12 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-black px-5 py-3 text-sm font-bold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border-2 border-black bg-[#f1df33] px-5 py-3 text-sm font-bold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div>
            </div>
            <div className="grid min-h-[34rem] grid-rows-[1fr_auto] lg:pl-10">
              <div className="grid grid-cols-2 gap-4 py-10">
                <div className="flex flex-col justify-between bg-[#1746d1] p-5 text-white"><span className="text-xs font-bold uppercase">Bundle 001</span><span className="break-all text-5xl font-black">.ZIP</span><span className="text-xs">FILES / LICENSE / UPDATES</span></div>
                <div className="flex flex-col justify-between border-2 border-black bg-[#f1df33] p-5"><span className="text-xs font-bold uppercase">Buyer access</span><span className="text-7xl font-black">∞</span><span className="text-xs">RETRIEVE ANYTIME</span></div>
              </div>
              <p className="border-t-2 border-black py-4 text-xs font-bold uppercase">{user ? "Your downloads are available" : "Preview the delivery system"}</p>
            </div>
          </div>
        </div>
        <div id="workspace" className="grid border-b-4 border-black lg:grid-cols-[0.35fr_0.65fr]">
          <div className="border-b-2 border-black py-7 lg:border-b-0 lg:border-r-2 lg:pr-8"><p className="text-xs font-bold uppercase">Catalog anatomy</p><h2 className="mt-4 text-3xl font-black uppercase">Buy once. Find it again.</h2><p className="mt-4 text-sm leading-6">Checkout, entitlement, and file retrieval read as one product instead of three disconnected systems.</p></div>
          <div className="divide-y-2 divide-black lg:pl-8">{(files.length ? files : [{ title: "Your first digital product", meta: "Ready", detail: "Attach the file and license policy.", section: "Catalog" }]).slice(0, 4).map((item, index) => <div key={`${item.title}-${index}`} className="grid gap-2 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="text-xs font-bold text-[#1746d1]">0{index + 1}</span><div><p className="font-bold uppercase">{item.title}</p><p className="mt-1 text-xs">{item.section} / {item.detail}</p></div><span className="text-xs font-bold uppercase">{item.meta}</span></div>)}</div>
        </div>
      </section>
    </div>
  );
}
