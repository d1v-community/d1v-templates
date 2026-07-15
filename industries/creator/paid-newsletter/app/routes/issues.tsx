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
export default function Issues() {
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
    <main className="min-h-screen bg-[#faf9f5] text-black">
      <header className="px-5 pt-5 sm:px-8">
        <div className="mx-auto max-w-[1450px] border-y-4 border-black py-3 text-center">
          <Link to="/" className="font-serif text-5xl font-bold">
            BriefClub
          </Link>
          <div className="mt-3 flex justify-between border-t border-black pt-3 text-xs uppercase">
            <span>Subscriber archive</span>
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8">
        <div className="grid border-b-4 border-black lg:grid-cols-[0.3fr_0.7fr]">
          <aside className="border-b-2 border-black pb-7 lg:border-b-0 lg:border-r-2 lg:pr-7">
            <p className="text-xs font-bold uppercase text-[#184ac9]">Archive desk</p>
            <h1 className="mt-5 font-serif text-4xl font-bold">All editions, fully readable.</h1>
            <nav className="mt-8 border-y border-black">
              {snapshot.sections.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setActive(index)}
                  className={
                    active === index
                      ? 'flex w-full justify-between bg-[#e8edfb] px-4 py-4 text-left font-bold'
                      : 'flex w-full justify-between border-t border-black px-4 py-4 text-left first:border-t-0'
                  }
                >
                  <span>{item.title}</span>
                  <span>{item.total}</span>
                </button>
              ))}
            </nav>
            <Link to="/pricing" className="mt-7 block text-sm font-bold">
              Subscription →
            </Link>
          </aside>
          <div className="lg:pl-7">
            <div className="flex justify-between border-b-2 border-black pb-4 text-xs font-bold uppercase">
              <span>{section?.title}</span>
              <span>{section?.totalLabel}</span>
            </div>
            <div className="grid gap-x-7 sm:grid-cols-2">
              {(section?.items ?? []).map((item, index) => (
                <article key={`${item.title}-${index}`} className="border-b-2 border-black py-7">
                  <p className="text-xs font-bold uppercase text-[#184ac9]">
                    Edition 0{index + 1} / {item.meta}
                  </p>
                  <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">{item.title}</h2>
                  <p className="mt-4 font-serif text-base leading-7 text-[#555]">{item.detail}</p>
                  <p className="mt-6 text-xs font-bold uppercase text-[#184ac9]">
                    Subscriber edition
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
