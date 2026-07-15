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
export default function Membership() {
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
    <main className="min-h-screen bg-[#11110f] text-white">
      <header className="border-b border-white/25 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] justify-between">
          <Link to="/" className="font-black uppercase">
            FlexPass
          </Link>
          <div className="flex gap-5 text-sm text-white/60">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        <div className="grid gap-7 lg:grid-cols-[0.36fr_0.64fr]">
          <aside className="border border-white/25 bg-[#181815] p-6 sm:p-8">
            <p className="inline-block bg-[#ff5a1f] px-2 py-1 text-xs font-black uppercase">
              Member active
            </p>
            <h1 className="mt-7 text-5xl font-black uppercase leading-[0.94]">
              Your training access.
            </h1>
            <p className="mt-5 text-sm leading-6 text-white/60">
              Plans, check-ins, and renewal state stay connected to this member identity.
            </p>
            <div className="mt-10 border-y border-white/25 py-6">
              <p className="text-xs uppercase text-[#ff7a42]">Account</p>
              <p className="mt-2 font-semibold">{user.email ?? user.username}</p>
            </div>
            <Link
              to="/pricing"
              className="mt-7 inline-block rounded-md bg-[#ff5a1f] px-4 py-2 text-xs font-black uppercase"
            >
              Change plan
            </Link>
          </aside>
          <div>
            <div className="grid sm:grid-cols-3">
              {snapshot.sections.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setActive(index)}
                  className={
                    active === index
                      ? 'border border-[#ff5a1f] bg-[#ff5a1f] p-5 text-left'
                      : 'border border-white/25 bg-[#181815] p-5 text-left'
                  }
                >
                  <p className="text-xs font-black uppercase">{item.title}</p>
                  <p className="mt-7 text-4xl font-black">{item.total}</p>
                  <p className="mt-1 text-xs opacity-60">{item.totalLabel}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 border border-white/25 bg-[#181815]">
              <div className="flex justify-between border-b border-white/25 p-5">
                <h2 className="text-xl font-black uppercase">{section?.title}</h2>
                <span className="text-xs text-[#ff7a42]">LIVE</span>
              </div>
              <div className="divide-y divide-white/20">
                {(section?.items ?? []).map((item, index) => (
                  <article
                    key={`${item.title}-${index}`}
                    className="grid gap-4 p-5 sm:grid-cols-[50px_1fr_auto] sm:items-center"
                  >
                    <span className="text-2xl font-black text-[#ff5a1f]">0{index + 1}</span>
                    <div>
                      <h3 className="font-bold uppercase">{item.title}</h3>
                      <p className="mt-2 text-sm text-white/55">{item.detail}</p>
                    </div>
                    <span className="w-fit border border-[#ff5a1f] px-3 py-1 text-xs text-[#ff7a42]">
                      {item.meta}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
