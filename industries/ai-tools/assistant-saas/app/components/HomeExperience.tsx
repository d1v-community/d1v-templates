import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const threads = sections[1]?.items ?? [];

  return (
    <div data-template="signal-desk" className="bg-[#10120f] text-[#eef3e8]">
      <section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1440px] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-between border-b border-[#badf43]/30 px-6 py-12 lg:border-b-0 lg:border-r lg:px-12 lg:py-16">
          <div className="flex items-center justify-between text-xs uppercase text-[#badf43]">
            <span>SignalDesk / AI operations</span><span>{user ? "Live account" : "Public signal"}</span>
          </div>
          <div className="my-16 max-w-xl">
            <p className="mb-5 font-mono text-sm text-[#badf43]">PRIVATE ASSISTANT INFRASTRUCTURE</p>
            <h1 className="text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">{SITE_CONFIG.home.headline}</h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#b8c0b2]">{SITE_CONFIG.home.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#badf43] px-5 py-3 text-sm font-bold text-[#10120f] transition hover:bg-[#d5f66c]">{SITE_CONFIG.home.primaryCtaLabel}</Link>
              <Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border border-[#60685b] px-5 py-3 text-sm font-semibold transition hover:border-[#badf43]">{SITE_CONFIG.home.secondaryCtaLabel}</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-[#60685b]/60 pt-5">
            {sections.slice(0, 3).map((section, index) => <div key={section.key}><p className="font-mono text-2xl text-[#badf43]">{String(index + 1).padStart(2, "0")}</p><p className="mt-1 text-xs text-[#9ca596]">{section.title}</p></div>)}
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#181b16] p-5 sm:p-8 lg:p-12">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#badf4322_1px,transparent_1px),linear-gradient(90deg,#badf4322_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="relative flex h-full min-h-[34rem] flex-col border border-[#60685b] bg-[#10120f]/95">
            <div className="flex items-center justify-between border-b border-[#60685b] px-5 py-4 font-mono text-xs text-[#8f9988]"><span>OPERATOR CONSOLE</span><span className="text-[#badf43]">● SYSTEM READY</span></div>
            <div className="grid flex-1 lg:grid-cols-[0.38fr_0.62fr]">
              <aside className="border-b border-[#60685b] p-5 lg:border-b-0 lg:border-r">
                <p className="font-mono text-xs text-[#badf43]">WORKSPACES</p>
                <div className="mt-5 space-y-4">{sections.slice(0, 3).map((section, index) => <div key={section.key} className={index === 1 ? "border-l-2 border-[#badf43] pl-3" : "pl-3 text-[#7c8576]"}><p className="text-sm font-semibold">{section.title}</p><p className="mt-1 font-mono text-xs">{section.total} {section.totalLabel}</p></div>)}</div>
              </aside>
              <div className="flex flex-col p-5 sm:p-7">
                <p className="font-mono text-xs text-[#8f9988]">ACTIVE THREADS / ROUTED</p>
                <div className="mt-5 divide-y divide-[#40463d] border-y border-[#40463d]">
                  {(threads.length ? threads : [{ title: "Workflow intelligence", meta: "Ready", detail: "Context, billing and access in one operator surface." }]).slice(0, 3).map((item, index) => <div key={`${item.title}-${index}`} className="grid gap-3 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="font-mono text-xs text-[#badf43]">0{index + 1}</span><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-[#8f9988]">{item.detail}</p></div><span className="w-fit border border-[#60685b] px-2 py-1 font-mono text-[10px] uppercase text-[#badf43]">{item.meta}</span></div>)}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-3 pt-7"><div className="border border-[#40463d] p-4"><p className="font-mono text-xs text-[#8f9988]">MEMORY</p><p className="mt-3 text-xl">Persistent</p></div><div className="border border-[#40463d] p-4"><p className="font-mono text-xs text-[#8f9988]">ACCESS</p><p className="mt-3 text-xl">Entitled</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
