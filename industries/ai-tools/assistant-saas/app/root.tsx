import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useRevalidator,
} from '@remix-run/react';
import { useEffect } from 'react';
import tailwindStyles from './tailwind.css?url';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';

const THEME_INIT_SCRIPT = `
  (() => {
    try {
      const root = document.documentElement;
      const stored = window.localStorage.getItem("theme");
      const theme =
        stored === "dark" || stored === "light"
          ? stored
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

      root.classList.toggle("dark", theme === "dark");
      root.style.colorScheme = theme;
    } catch {
      // noop
    }
  })();
`;

export const links = () => [{ rel: 'stylesheet', href: tailwindStyles }];

export const meta = () => {
  return [{ title: APP_TITLE }, { name: 'description', content: SITE_CONFIG.siteDescription }];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const revalidator = useRevalidator();

  // If SSR didn't include auth cookie (e.g., iframe 3PC blocked)
  // but localStorage has a token, refresh route loaders with Authorization.
  useEffect(() => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;
      fetch('/api/auth/me')
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
          if (d && d.authenticated) {
            revalidator.revalidate();
          }
        })
        .catch(() => {
          // noop: 静默处理网络错误
        });
    } catch {
      // noop: 静默处理访问 localStorage 失败
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <Meta />
          <Links />
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
          <title>{`${error.status} ${error.statusText}`}</title>
        </head>
        <body className="min-h-screen bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-white">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="max-w-lg space-y-3 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h1 className="text-2xl font-semibold tracking-tight">
                {error.status} {error.statusText}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">{String(error.data)}</p>
            </div>
          </div>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <title>App Error</title>
      </head>
      <body className="min-h-screen bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-white">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-lg space-y-3 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <pre className="overflow-x-auto text-sm text-slate-600 dark:text-slate-300">
              {String(error)}
            </pre>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
