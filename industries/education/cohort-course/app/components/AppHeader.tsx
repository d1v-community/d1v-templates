import { Link } from "@remix-run/react";
import { ThemeToggleButton } from "~/components/ThemeToggleButton";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";

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
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <header className={`w-full ${theme.headerShell}`}>
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className={`text-base font-semibold tracking-tight transition-colors ${theme.logo}`}
          >
            {APP_TITLE}
          </Link>

          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-4 sm:flex">
              {SITE_CONFIG.aiAssistant?.enabled ? (
                <Link
                  to="/#assistant"
                  className={`text-sm font-medium transition-colors ${theme.navLink}`}
                >
                  {SITE_CONFIG.navigation.assistantLabel ?? "AI Concierge"}
                </Link>
              ) : null}
              <Link
                to="/pricing"
                className={`text-sm font-medium transition-colors ${theme.navLink}`}
              >
                {SITE_CONFIG.navigation.pricingLabel}
              </Link>
            </nav>

            <ThemeToggleButton />

            {user ? (
              <div className="relative group">
                <div className={`cursor-default text-sm transition-colors ${theme.navLink}`}>
                  {displayName}
                </div>
                <div className="absolute right-0 mt-2 hidden group-hover:block">
                  <button
                    onClick={onLogout}
                    className="rounded px-3 py-1 text-sm text-white shadow transition hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-sm transition-colors ${theme.navLink}`}
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
