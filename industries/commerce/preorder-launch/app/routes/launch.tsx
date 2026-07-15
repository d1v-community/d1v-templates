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
export default function Launch() {
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
    <main className="min-h-screen bg-[#ff5b45] text-[#16110f]">
      <header className="px-5 pt-5 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] justify-between border-y-4 border-black py-3 text-xs font-black uppercase">
          <Link to="/">FirstDrop / Control</Link>
          <div className="flex gap-5">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-4 border-black pb-7">
          <div>
            <p className="text-xs font-black uppercase">Launch control / release 001</p>
            <h1 className="mt-3 text-5xl font-black uppercase">Reservation status.</h1>
          </div>
          <Link
            to="/pricing"
            className="rounded-md bg-black px-4 py-2 text-xs font-black uppercase text-white"
          >
            Manage offer
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {snapshot.sections.map((item, index) => (
            <button
              key={item.key}
              onClick={() => setActive(index)}
              className={
                active === index
                  ? 'border-2 border-black bg-[#f8de3c] p-5 text-left'
                  : 'border-2 border-black bg-[#f7efe5] p-5 text-left'
              }
            >
              <div className="flex justify-between text-xs font-black uppercase">
                <span>0{index + 1}</span>
                <span>{item.total}</span>
              </div>
              <p className="mt-10 text-2xl font-black uppercase">{item.title}</p>
              <p className="mt-2 text-xs">{item.totalLabel}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 border-2 border-black bg-[#f7efe5]">
          <div className="flex justify-between border-b-2 border-black p-5 text-xs font-black uppercase">
            <span>{section?.title}</span>
            <span>Live register</span>
          </div>
          <div className="divide-y-2 divide-black">
            {(section?.items ?? []).map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="grid gap-4 p-5 sm:grid-cols-[70px_1fr_1fr_auto] sm:items-center"
              >
                <span className="text-3xl font-black text-[#ff5b45]">0{index + 1}</span>
                <h2 className="font-black uppercase">{item.title}</h2>
                <p className="text-sm">{item.detail}</p>
                <span className="w-fit bg-[#f8de3c] px-3 py-1 text-xs font-bold uppercase">
                  {item.meta}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
