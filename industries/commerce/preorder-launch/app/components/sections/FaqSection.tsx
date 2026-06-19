import { SectionShell } from "~/components/sections/SectionShell";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";

export function FaqSection() {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const items = SITE_CONFIG.faq ?? [];

  if (!items.length) return null;

  return (
    <SectionShell
      id="faq"
      eyebrow="Operator Q&A"
      title="Questions paid teams ask before they turn this on."
      description="Real onboarding questions, framed for the operators who run the workspace day to day."
      align="center"
      tone="panel"
      className="scroll-mt-20"
    >
      <div className="mx-auto grid w-full max-w-4xl gap-3 sm:gap-4">
        {items.map((item, index) => (
          <details
            key={item.question}
            className={`group overflow-hidden rounded-2xl px-5 py-4 text-left transition duration-300 open:shadow-sm ${theme.faqShell}`}
            {...(index === 0 ? { open: true } : {})}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold tracking-tight sm:text-base">
              <span className="flex-1">{item.question}</span>
              <span
                aria-hidden
                className={`mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold transition duration-300 group-open:rotate-45 ${theme.eyebrow}`}
              >
                +
              </span>
            </summary>
            <p className={`mt-3 text-sm leading-relaxed sm:text-[15px] ${theme.sectionText}`}>
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
