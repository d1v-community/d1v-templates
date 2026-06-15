import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserFromRequest } from "~/utils/auth.server";
import { getEnvWarningMessage } from "~/utils/env.server";

export const meta: MetaFunction = () => [
  { title: "D1V Remix Flutter Auth Template" },
  { name: "description", content: "Minimal reusable Remix + Flutter auth template." },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserFromRequest(request);
  const envWarning = getEnvWarningMessage();
  return json({ user, envWarning });
};

export default function Index() {
  const { user, envWarning } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-16 text-stone-50">
      {envWarning ? (
        <div className="mx-auto mb-6 max-w-5xl rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {envWarning}
        </div>
      ) : null}

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p className="text-sm uppercase tracking-[0.28em] text-orange-300">D1V Foundation</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Remix + Flutter auth starter
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            A minimal template with a Remix auth backend and a Flutter client, including a same-domain Flutter Web build served under `/app`.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-orange-400 px-5 py-3 text-sm font-semibold text-stone-950" to="/login">
              Open web login
            </Link>
            <a className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-100" href="/app">
              Open Flutter Web shell
            </a>
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-800 bg-stone-900/80 p-6">
          <h2 className="text-xl font-semibold">What stays in the template</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-300">
            <li>Remix routes: `/api/auth/send-code`, `/api/auth/verify-login`, `/api/auth/me`, `/api/auth/logout`.</li>
            <li>Flutter mobile and Flutter Web: same login flow backed by the same Remix APIs.</li>
            <li>Neon + Drizzle schema reduced to `users` and `verification_codes`.</li>
            <li>Vercel routes that serve Flutter Web under `/app` and Remix everywhere else.</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm text-stone-300">
            {user ? `Current server session: ${user.email ?? user.username}` : "No server session detected."}
          </div>
        </section>
      </div>
    </main>
  );
}
