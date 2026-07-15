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
export default function Community() {
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
    <main className="min-h-screen bg-[#f4e9d8] text-[#19382c]">
      <header className="bg-[#19382c] px-5 py-5 text-[#f4e9d8] sm:px-8">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between">
          <Link to="/" className="font-serif text-xl">
            InnerCircle
          </Link>
          <div className="flex gap-5 text-sm text-[#c9d1c5]">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Leave</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1450px] lg:grid-cols-[280px_1fr]">
        <aside className="border-b-2 border-[#19382c] p-6 lg:min-h-[calc(100svh-68px)] lg:border-b-0 lg:border-r-2 lg:p-8">
          <p className="font-serif text-lg italic text-[#d94b38]">Member edition</p>
          <h1 className="mt-4 font-serif text-4xl">Inside this week.</h1>
          <nav className="mt-9 space-y-2">
            {snapshot.sections.map((item, index) => (
              <button
                key={item.key}
                onClick={() => setActive(index)}
                className={
                  active === index ? 'w-full bg-[#f3b24a] p-4 text-left' : 'w-full p-4 text-left'
                }
              >
                <span className="font-semibold">{item.title}</span>
                <span className="float-right">{item.total}</span>
              </button>
            ))}
          </nav>
          <Link to="/pricing" className="mt-8 block border-t border-[#19382c] pt-5 text-sm">
            Membership →
          </Link>
        </aside>
        <section className="p-6 sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-[#19382c] pb-6">
            <div>
              <p className="text-xs uppercase text-[#d94b38]">Community feed</p>
              <h2 className="mt-3 font-serif text-4xl">{section?.title}</h2>
            </div>
            <p className="font-serif text-5xl text-[#d94b38]">{section?.total}</p>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {(section?.items ?? []).map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className={
                  index === 0 ? 'bg-[#19382c] p-6 text-[#f4e9d8]' : 'border-2 border-[#19382c] p-6'
                }
              >
                <p className="text-xs uppercase text-[#d94b38]">{item.meta}</p>
                <h3 className="mt-8 font-serif text-3xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 opacity-75">{item.detail}</p>
                <p className="mt-7 text-xs font-bold uppercase">Member conversation</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
