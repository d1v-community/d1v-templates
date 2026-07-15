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
export default function Downloads() {
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
    <main className="min-h-screen bg-[#f1f0ea] text-black">
      <header className="px-5 pt-5 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] justify-between border-y-4 border-black py-3 text-xs font-black uppercase">
          <Link to="/">DownloadPort / Library</Link>
          <div className="flex gap-5">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Exit</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        <div className="grid border-b-4 border-black lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="border-b-2 border-black pb-7 lg:border-b-0 lg:border-r-2 lg:pr-7">
            <p className="inline-block bg-[#1746d1] px-2 py-1 text-xs font-bold uppercase text-white">
              Buyer library
            </p>
            <h1 className="mt-6 text-5xl font-black uppercase">Your files. Ready again.</h1>
            <nav className="mt-9 border-y-2 border-black">
              {snapshot.sections.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setActive(index)}
                  className={
                    active === index
                      ? 'flex w-full justify-between bg-[#f1df33] px-4 py-4 text-left font-bold'
                      : 'flex w-full justify-between border-t-2 border-black px-4 py-4 text-left first:border-t-0'
                  }
                >
                  <span>{item.title}</span>
                  <span>{item.total}</span>
                </button>
              ))}
            </nav>
            <Link to="/pricing" className="mt-7 inline-block text-sm font-bold uppercase">
              Browse catalog →
            </Link>
          </aside>
          <div className="lg:pl-7">
            <div className="flex justify-between border-b-2 border-black pb-4 text-xs font-black uppercase">
              <span>{section?.title}</span>
              <span>{section?.totalLabel}</span>
            </div>
            <div className="grid sm:grid-cols-2">
              {(section?.items ?? []).map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="border-b-2 border-black p-5 sm:border-r-2 sm:even:border-r-0"
                >
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>FILE 0{index + 1}</span>
                    <span className="text-[#1746d1]">{item.meta}</span>
                  </div>
                  <p className="mt-10 break-all text-3xl font-black uppercase">{item.title}</p>
                  <p className="mt-4 text-sm leading-6">{item.detail}</p>
                  <p className="mt-8 text-xs font-black uppercase text-[#1746d1]">
                    Access attached to this account
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
