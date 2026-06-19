import { SectionShell } from "~/components/sections/SectionShell";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";

export function WorkflowSection() {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const flow = SITE_CONFIG.workflow;
  const steps = flow?.steps ?? [];

  if (!steps.length) return null;

  return (
    <SectionShell
      id="workflow"
      eyebrow={flow.eyebrow}
      title={flow.title}
      description={flow.description}
      tone="canvas"
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`group relative flex flex-col gap-3 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.listItemShell}`}
          >
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.18em] ${theme.eyebrow}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-base font-semibold tracking-tight sm:text-lg">{step.title}</h3>
            <p className={`text-sm leading-relaxed ${theme.sectionText}`}>{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
