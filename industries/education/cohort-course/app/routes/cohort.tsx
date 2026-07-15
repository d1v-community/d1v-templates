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
export default function Cohort() {
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
    <main className="min-h-screen bg-[#f2f0e8] text-[#151515]">
      <header className="px-5 pt-5 sm:px-8">
        <div className="mx-auto flex max-w-[1450px] justify-between border-y-2 border-black py-3 text-xs font-bold uppercase">
          <Link to="/">CohortOS / Academy</Link>
          <div className="flex gap-5">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-black pb-7">
          <div>
            <p className="text-xs font-bold uppercase text-[#d72b25]">Student workspace</p>
            <h1 className="mt-3 text-5xl font-bold">Your shared learning calendar.</h1>
          </div>
          <Link to="/pricing" className="text-sm font-bold">
            Seat details →
          </Link>
        </div>
        <div className="mt-6 grid border-l-2 border-t-2 border-black sm:grid-cols-3">
          {snapshot.sections.map((item, index) => (
            <button
              key={item.key}
              onClick={() => setActive(index)}
              className={
                active === index
                  ? 'border-b-2 border-r-2 border-black bg-[#d72b25] p-5 text-left text-white'
                  : 'border-b-2 border-r-2 border-black p-5 text-left'
              }
            >
              <p className="text-xs font-bold uppercase">W0{index + 1}</p>
              <p className="mt-8 text-2xl font-bold">{item.title}</p>
              <p className="mt-2 text-sm">
                {item.total} {item.totalLabel}
              </p>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-7 lg:grid-cols-[0.3fr_0.7fr]">
          <aside className="border-t-2 border-black pt-5">
            <p className="text-xs font-bold uppercase">Current module</p>
            <h2 className="mt-4 text-3xl font-bold">{section?.title}</h2>
            <p className="mt-4 text-sm leading-6">{section?.description}</p>
          </aside>
          <div className="grid sm:grid-cols-2">
            {(section?.items ?? []).map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="border-b-2 border-r-2 border-black p-5 first:border-l-2 sm:first:border-l-0"
              >
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>Session 0{index + 1}</span>
                  <span className="text-[#d72b25]">{item.meta}</span>
                </div>
                <h3 className="mt-10 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
