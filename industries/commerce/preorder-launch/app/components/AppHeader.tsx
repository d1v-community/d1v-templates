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
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-base font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700 dark:text-slate-100 dark:hover:text-white"
          >
            {APP_TITLE}
          </Link>

          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-4 sm:flex">
              <Link
                to="/pricing"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {SITE_CONFIG.navigation.pricingLabel}
              </Link>
            </nav>

            <ThemeToggleButton />

            {user ? (
              <div className="relative group">
                <div className="text-sm text-gray-700 group-hover:text-gray-900 cursor-default dark:text-slate-200 dark:group-hover:text-white">
                  {displayName}
                </div>
                <div className="absolute right-0 mt-2 hidden group-hover:block">
                  <button
                    onClick={onLogout}
                    className="px-3 py-1 text-sm text-white bg-gray-800 rounded shadow hover:bg-gray-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm text-gray-700 hover:text-gray-900 dark:text-slate-200 dark:hover:text-white"
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
