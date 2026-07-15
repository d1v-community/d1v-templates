import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];

  return (
    <div data-template="flex-pass" className="bg-[#11110f] text-white">
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=90" alt="Athletes training in a modern strength gym" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1500px] flex-col justify-between px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="flex items-center justify-between border-b border-white/50 pb-4 text-xs font-bold uppercase"><span>FlexPass / membership engine</span><span>{user ? "Member active" : "Join the floor"}</span></div>
          <div className="my-16 max-w-5xl"><p className="inline-block bg-[#ff5a1f] px-3 py-1 text-sm font-black uppercase">Built for repeat visits</p><h1 className="mt-6 text-6xl font-black uppercase leading-[0.9] sm:text-8xl lg:text-9xl">{SITE_CONFIG.home.headline}</h1><p className="mt-7 max-w-2xl text-lg font-medium leading-7 text-white/85">{SITE_CONFIG.home.description}</p><div className="mt-9 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#ff5a1f] px-5 py-3 text-sm font-black uppercase text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border-2 border-white px-5 py-3 text-sm font-black uppercase">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div></div>
          <div className="grid border-y border-white/50 bg-black/35 backdrop-blur-sm sm:grid-cols-3">{sections.slice(0, 3).map((section, index) => <div key={section.key} className="border-b border-white/40 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><div className="flex items-end justify-between"><p className="text-xs font-bold uppercase">0{index + 1} / {section.title}</p><p className="text-4xl font-black text-[#ff7a42]">{section.total}</p></div><p className="mt-2 text-xs text-white/65">{section.totalLabel}</p></div>)}</div>
        </div>
      </section>
      <section id="workspace" className="mx-auto grid max-w-[1500px] border-b border-white/30 lg:grid-cols-[0.4fr_0.6fr]">
        <div className="border-b border-white/30 p-7 sm:p-10 lg:border-b-0 lg:border-r"><p className="text-xs font-bold uppercase text-[#ff7a42]">Membership, operationalized</p><h2 className="mt-5 text-4xl font-black uppercase">From payment to check-in without friction.</h2><p className="mt-5 max-w-md text-sm leading-6 text-white/60">Plans, renewals, visits, and member identity stay connected so the front desk can focus on people.</p></div>
        <div className="grid sm:grid-cols-3">{SITE_CONFIG.templateSurface.bullets.slice(0, 3).map((bullet, index) => <article key={bullet} className="border-b border-white/30 p-7 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><p className="text-5xl font-black text-[#ff5a1f]">0{index + 1}</p><p className="mt-8 text-sm font-bold uppercase leading-6">{bullet}</p></article>)}</div>
      </section>
    </div>
  );
}
