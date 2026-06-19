import { SectionShell } from "~/components/sections/SectionShell";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";

interface FeatureGridSectionProps {
  index: number;
}

export function FeatureGridSection({ index }: FeatureGridSectionProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const block = SITE_CONFIG.featureSections?.[index];

  if (!block) return null;

  return (
    <SectionShell
      id={block.title ? `feature-${index}` : undefined}
      eyebrow={block.eyebrow}
      title={block.title}
      description={block.description}
      tone={index % 2 === 0 ? "panel" : "canvas"}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map(item => (
          <article
            key={item.title}
            className={`flex flex-col gap-3 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
          >
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}
            >
              {item.meta ?? "Module"}
            </span>
            <h3 className="text-base font-semibold tracking-tight sm:text-lg">{item.title}</h3>
            <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
