import { useState } from 'react';
import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { getUserFromRequest } from '~/utils/auth.server';
import { getTemplateSnapshot } from '~/services/template-data.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (!user) return redirect('/login');
  return json({ user, snapshot: await getTemplateSnapshot() });
}
export default function Console() {
  const { user, snapshot } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const section = snapshot.sections[active] ?? snapshot.sections[0];
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('auth-token');
    navigate('/login');
  };
  return (
    <main className="min-h-screen bg-[#10120f] text-[#eef3e8]">
      <header className="border-b border-[#badf43]/35 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between">
          <Link to="/" className="font-mono text-sm text-[#badf43]">
            SIGNALDESK / CONSOLE
          </Link>
          <div className="flex items-center gap-5 text-xs text-[#aab3a4]">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-[#60685b] p-5 lg:min-h-[calc(100svh-57px)] lg:border-b-0 lg:border-r lg:p-7">
          <p className="font-mono text-xs text-[#7f8979]">DATA CHANNELS</p>
          <nav className="mt-6 space-y-2">
            {snapshot.sections.map((item, index) => (
              <button
                key={item.key}
                onClick={() => setActive(index)}
                className={
                  active === index
                    ? 'w-full border-l-2 border-[#badf43] bg-[#1d211a] px-4 py-3 text-left'
                    : 'w-full px-4 py-3 text-left text-[#8f9988]'
                }
              >
                <span className="block text-sm font-semibold">{item.title}</span>
                <span className="mt-1 block font-mono text-xs">
                  {item.total} {item.totalLabel}
                </span>
              </button>
            ))}
          </nav>
          <Link
            to="/pricing"
            className="mt-8 block border-t border-[#60685b] pt-5 text-xs text-[#badf43]"
          >
            MANAGE PLAN ↗
          </Link>
        </aside>
        <section className="p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#60685b] pb-7">
            <div>
              <p className="font-mono text-xs text-[#badf43]">LIVE OPERATOR SURFACE</p>
              <h1 className="mt-3 text-4xl font-semibold">{section?.title ?? 'Workspace'}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9da696]">
                {section?.description}
              </p>
            </div>
            <div className="font-mono text-right">
              <p className="text-4xl text-[#badf43]">{section?.total ?? 0}</p>
              <p className="text-xs text-[#7f8979]">CURRENT RECORDS</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 xl:grid-cols-2">
            {(section?.items ?? []).map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="border border-[#40463d] bg-[#181b16] p-5"
              >
                <div className="flex justify-between gap-4">
                  <span className="font-mono text-xs text-[#badf43]">0{index + 1}</span>
                  <span className="border border-[#60685b] px-2 py-1 font-mono text-[10px] text-[#badf43]">
                    {item.meta}
                  </span>
                </div>
                <h2 className="mt-7 text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#8f9988]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
