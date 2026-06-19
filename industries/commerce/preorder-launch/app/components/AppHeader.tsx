import { Link, useLocation } from '@remix-run/react';

import { ThemeToggleButton } from '~/components/ThemeToggleButton';
import { WorkspaceReadyToast } from '~/components/WorkspaceReadyToast';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';

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
  const industryLinks = SITE_CONFIG.navigation.industryLinks ?? [];
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  return (
    <>
      <WorkspaceReadyToast />
      <header className={`w-full ${theme.headerShell}`}>
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/"
              className={`text-base font-semibold tracking-tight transition-colors ${theme.logo}`}
            >
              {APP_TITLE}
            </Link>

            <div className="flex items-center gap-3 sm:gap-5">
              <nav className="hidden items-center gap-4 sm:flex">
                {industryLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm font-medium transition-colors ${theme.navLink}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/pricing"
                  className={`text-sm font-medium transition-colors ${theme.navLink}`}
                >
                  {SITE_CONFIG.navigation.pricingLabel}
                </Link>
              </nav>

              <ThemeToggleButton />

              {user ? (
                <div className="flex items-center gap-3">
                  <div
                    className={`hidden max-w-[12rem] truncate text-sm transition-colors sm:block ${theme.navLink}`}
                  >
                    {displayName}
                  </div>
                  <button
                    onClick={onLogout}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${theme.secondaryButton}`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
                  className={`text-sm font-medium transition-colors ${theme.navLink}`}
                >
                  {SITE_CONFIG.navigation.loginLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
