import { Link } from "@remix-run/react";
import { ThemeToggleButton } from "~/components/ThemeToggleButton";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";

export type AppHeaderUser = {
  displayName: string | null;
  username: string | null;
  email: string | null;
} | null;

interface AppHeaderProps {
  user: AppHeaderUser;
  onLogout: () => void;
}

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  const displayName = user?.displayName || user?.username || user?.email;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 text-slate-950 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-[rgba(9,17,31,0.90)] dark:text-white dark:supports-[backdrop-filter]:bg-[rgba(9,17,31,0.76)]">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#b79d71]/80 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/16 dark:hover:bg-white/7"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b79d71] shadow-none dark:border-white/14 dark:bg-black/20 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              CR
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                Private suite
              </p>
              <p className="text-base font-semibold tracking-tight">{APP_TITLE}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 dark:border-white/10 dark:bg-white/5 lg:flex">
            <Link
              to="/#workspace"
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:border-white/14 dark:hover:bg-white/8 dark:hover:text-white"
            >
              {user ? "Accounts" : "Preview"}
            </Link>
            {SITE_CONFIG.aiAssistant?.enabled ? (
              <Link
                to="/#assistant"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:border-white/14 dark:hover:bg-white/8 dark:hover:text-white"
              >
                {SITE_CONFIG.navigation.assistantLabel ?? "Service desk"}
              </Link>
            ) : null}
            <Link
              to="/pricing"
              className="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:border-white/14 dark:hover:bg-white/8 dark:hover:text-white"
            >
              {SITE_CONFIG.navigation.pricingLabel}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggleButton />

            {user ? (
              <div className="group relative">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-white/14 dark:bg-white/5 dark:text-slate-200 dark:hover:border-white/24 dark:hover:bg-white/8 dark:hover:text-white"
                >
                  {displayName}
                </button>
                <div className="absolute right-0 top-full hidden min-w-[12rem] pt-2 group-hover:block">
                  <div className="rounded-[1.15rem] border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-[rgba(9,17,31,0.96)] dark:shadow-[0_18px_50px_rgba(2,6,23,0.38)]">
                    <button
                      onClick={onLogout}
                      className="w-full rounded-[0.95rem] px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-[#b79d71] hover:text-[#0f1728] dark:text-slate-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#b79d71] px-5 py-2.5 text-sm font-medium text-[#0f1728] shadow-[0_10px_30px_rgba(183,157,113,0.24)] transition hover:bg-[#c9b389]"
              >
                {SITE_CONFIG.navigation.loginLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
