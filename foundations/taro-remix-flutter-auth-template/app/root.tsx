import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import tailwindStyles from "./tailwind.css?url";

export const links = () => [{ rel: "stylesheet", href: tailwindStyles }];

export const meta = () => [
  { title: "D1V Taro Remix Flutter Auth Template" },
  { name: "description", content: "Minimal reusable Remix + Taro + Flutter email auth template." },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
        <h1 className="text-3xl font-semibold">{error.status} {error.statusText}</h1>
        <p className="mt-4 text-stone-300">{String(error.data)}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <h1 className="text-3xl font-semibold">Unexpected error</h1>
      <pre className="mt-4 overflow-auto rounded-xl bg-stone-900 p-4 text-sm text-stone-300">{String(error)}</pre>
    </main>
  );
}
