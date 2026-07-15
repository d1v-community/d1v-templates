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
export default function Appointments() {
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
    <main className="min-h-screen bg-[#edf4f0] text-[#19382f]">
      <header className="border-b border-[#9bb8af] bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1400px] justify-between">
          <Link to="/" className="font-serif text-xl">
            ClinicFlow
          </Link>
          <div className="flex gap-5 text-sm text-[#567169]">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1400px] px-5 py-9 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold text-[#29745f]">PATIENT OVERVIEW</p>
            <h1 className="mt-3 font-serif text-4xl">Your care, clearly scheduled.</h1>
          </div>
          <Link to="/pricing" className="rounded-md bg-[#19382f] px-4 py-2 text-sm text-white">
            Review care plans
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {snapshot.sections.map((item, index) => (
            <button
              key={item.key}
              onClick={() => setActive(index)}
              className={
                active === index
                  ? 'border border-[#29745f] bg-[#19382f] p-5 text-left text-white'
                  : 'border border-[#b8cec7] bg-white p-5 text-left'
              }
            >
              <p className="text-xs">{item.title}</p>
              <p className="mt-5 font-serif text-4xl">{item.total}</p>
              <p className="mt-1 text-xs opacity-65">{item.totalLabel}</p>
            </button>
          ))}
        </div>
        <div className="mt-7 grid gap-7 lg:grid-cols-[0.35fr_0.65fr]">
          <aside className="bg-[#dcece6] p-6">
            <p className="text-xs font-semibold text-[#29745f]">CURRENT VIEW</p>
            <h2 className="mt-4 font-serif text-3xl">{section?.title}</h2>
            <p className="mt-4 text-sm leading-6 text-[#567169]">{section?.description}</p>
          </aside>
          <div className="divide-y divide-[#d6e2dd] border-y border-[#b8cec7] bg-white px-6">
            {(section?.items ?? []).map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="grid gap-4 py-6 sm:grid-cols-[50px_1fr_auto] sm:items-center"
              >
                <span className="font-serif text-2xl text-[#29745f]">0{index + 1}</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#567169]">{item.detail}</p>
                </div>
                <span className="w-fit rounded-full bg-[#dcece6] px-3 py-1 text-xs text-[#29745f]">
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
