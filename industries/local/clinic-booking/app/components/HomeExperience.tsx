import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const appointments = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 3);

  return (
    <div data-template="clinic-flow" className="bg-[#edf4f0] text-[#19382f]">
      <section className="mx-auto max-w-[1500px]">
        <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-14">
            <p className="text-sm font-semibold text-[#29745f]">ClinicFlow · Calm access to care</p>
            <h1 className="mt-7 max-w-2xl font-serif text-5xl leading-[1.05] sm:text-6xl">{SITE_CONFIG.home.headline}</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#567169]">{SITE_CONFIG.home.description}</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#19382f] px-5 py-3 text-sm font-semibold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border border-[#6c9488] bg-white/40 px-5 py-3 text-sm font-semibold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div>
            <div className="mt-14 grid gap-4 border-t border-[#9bb8af] pt-6 sm:grid-cols-3">{SITE_CONFIG.templateSurface.bullets.slice(0, 3).map((bullet, index) => <div key={bullet}><p className="font-serif text-2xl text-[#29745f]">0{index + 1}</p><p className="mt-2 text-sm leading-6 text-[#567169]">{bullet}</p></div>)}</div>
          </div>
          <div className="relative min-h-[34rem]"><img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1800&q=88" alt="A calm healthcare consultation environment" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-5 bottom-5 bg-white/92 p-5 backdrop-blur-sm sm:inset-x-8 sm:bottom-8 sm:p-7"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase text-[#29745f]">Next available care</p><span className="text-xs text-[#567169]">{user ? "Patient view" : "Preview"}</span></div><p className="mt-3 font-serif text-2xl">Booking should lower anxiety before the visit begins.</p></div></div>
        </div>
        <div id="workspace" className="grid border-t border-[#9bb8af] lg:grid-cols-[0.35fr_0.65fr]">
          <div className="bg-[#19382f] p-7 text-white sm:p-10"><p className="text-xs uppercase text-[#9cc5b8]">Care operations</p><h2 className="mt-5 font-serif text-3xl">Clear availability, simple deposits, one patient record.</h2><div className="mt-10 grid grid-cols-3 gap-4">{sections.slice(0, 3).map(section => <div key={section.key}><p className="font-serif text-3xl text-[#b8ddcf]">{section.total}</p><p className="mt-1 text-xs text-[#9cc5b8]">{section.title}</p></div>)}</div></div>
          <div className="bg-white p-7 sm:p-10"><p className="text-xs font-semibold uppercase text-[#29745f]">Appointment flow</p><div className="mt-6 divide-y divide-[#d6e2dd] border-y border-[#d6e2dd]">{(appointments.length ? appointments : [{ title: "Your first appointment type", meta: "Available", detail: "Add clinician, duration and deposit details.", section: "Schedule" }]).map((item, index) => <div key={`${item.title}-${index}`} className="grid gap-3 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="font-serif text-2xl text-[#29745f]">0{index + 1}</span><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-[#6a7f78]">{item.detail}</p></div><span className="text-xs font-semibold text-[#29745f]">{item.meta}</span></div>)}</div></div>
        </div>
      </section>
    </div>
  );
}
