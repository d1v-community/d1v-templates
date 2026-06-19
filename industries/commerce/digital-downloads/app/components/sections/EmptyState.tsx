import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  hint?: string;
}

export function EmptyState({ title, description, icon, hint }: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300/70 bg-white/40 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/30">
      {icon ? <div className="text-2xl">{icon}</div> : null}
      <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {hint ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
