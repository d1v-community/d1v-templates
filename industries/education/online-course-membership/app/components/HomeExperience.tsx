import { Link } from "@remix-run/react";
import { SITE_CONFIG } from "~/constants/site";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function HomeExperience({ snapshot, user }: { snapshot?: TemplateSnapshot | null; user?: AppHeaderUser }) {
  const sections = snapshot?.sections ?? [];
  const lessons = sections.flatMap(section => section.items.map(item => ({ ...item, section: section.title }))).slice(0, 3);

  return (
    <div data-template="lesson-loop" className="bg-[#fbfbf8] text-[#302f2b]">
      <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid min-h-[calc(100svh-10rem)] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm text-[#b44b34]">LessonLoop · A quiet place to keep learning</p>
            <h1 className="mt-8 max-w-2xl font-serif text-5xl leading-[1.12] sm:text-6xl">{SITE_CONFIG.home.headline}</h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-[#77746d]">{SITE_CONFIG.home.description}</p>
            <div className="mt-10 flex flex-wrap gap-3"><Link to={SITE_CONFIG.home.primaryCtaHref} className="rounded-md bg-[#302f2b] px-5 py-3 text-sm font-semibold text-white">{SITE_CONFIG.home.primaryCtaLabel}</Link><Link to={SITE_CONFIG.home.secondaryCtaHref} className="rounded-md border border-[#bcbab3] px-5 py-3 text-sm font-semibold">{SITE_CONFIG.home.secondaryCtaLabel}</Link></div>
            <p className="mt-14 max-w-md border-l border-[#b44b34] pl-5 font-serif text-lg italic leading-8 text-[#625f59]">Progress should feel like understanding more, not managing another dashboard.</p>
          </div>
          <div id="workspace" className="relative min-h-[34rem] border border-[#deddd8] bg-white p-7 sm:p-10">
            <div className="absolute right-7 top-7 h-16 w-16 rounded-full border border-[#b44b34] sm:right-10 sm:top-10" />
            <p className="text-xs text-[#9a978f]">STUDY NOTE / {user ? "MEMBER" : "PREVIEW"}</p>
            <h2 className="mt-16 max-w-lg font-serif text-3xl">{snapshot?.title ?? "A course library with memory"}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#77746d]">{snapshot?.description ?? SITE_CONFIG.templateSurface.description}</p>
            <div className="mt-10 divide-y divide-[#deddd8] border-y border-[#deddd8]">{(lessons.length ? lessons : [{ title: "Begin with one considered lesson", meta: "Open", detail: "Structure the path before filling the library.", section: "Course" }]).map((item, index) => <article key={`${item.title}-${index}`} className="grid gap-3 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-start"><span className="font-serif text-2xl text-[#b44b34]">{index + 1}</span><div><p className="font-serif text-xl">{item.title}</p><p className="mt-2 text-sm leading-6 text-[#77746d]">{item.detail}</p></div><span className="text-xs text-[#9a978f]">{item.section}</span></article>)}</div>
            <div className="mt-8 grid grid-cols-3 gap-5">{sections.slice(0, 3).map(section => <div key={section.key}><p className="font-serif text-2xl text-[#b44b34]">{section.total}</p><p className="mt-1 text-xs text-[#9a978f]">{section.title}</p></div>)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
