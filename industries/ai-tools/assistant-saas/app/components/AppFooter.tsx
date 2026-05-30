import { SITE_CONFIG } from '~/constants/site';
import { ClientOnly } from './ClientOnly';

export function AppFooter() {
  return (
    <footer className="w-full border-t border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
        {SITE_CONFIG.footer.line}{' '}
        <ClientOnly fallback={<>@</>}>
          <>@{new Date().getFullYear()}</>
        </ClientOnly>
      </div>
    </footer>
  );
}
