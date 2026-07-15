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
export default function Library() {
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
    <main className="min-h-screen bg-[#f3efe7] text-[#281f25]">
      <header className="px-5 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between border-y-2 border-[#281f25] py-3 text-xs uppercase">
          <Link to="/" className="font-serif text-xl normal-case">
            PromptVault
          </Link>
          <div className="flex gap-5">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Leave archive</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1450px] px-5 py-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <aside>
            <p className="font-serif text-lg italic text-[#b51f55]">Member library</p>
            <h1 className="mt-4 font-serif text-5xl">The working archive.</h1>
            <p className="mt-5 text-sm leading-6 text-[#675a62]">
              Return to saved systems, member releases, and prompts prepared for repeated use.
            </p>
            <nav className="mt-10 border-y border-[#281f25]">
              {snapshot.sections.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setActive(index)}
                  className={
                    active === index
                      ? 'flex w-full justify-between bg-[#e2c9d3] px-4 py-4 text-left'
                      : 'flex w-full justify-between border-t border-[#281f25] px-4 py-4 text-left first:border-t-0'
                  }
                >
                  <span>{item.title}</span>
                  <span>{item.total}</span>
                </button>
              ))}
            </nav>
            <Link to="/pricing" className="mt-7 inline-block text-sm text-[#b51f55]">
              Membership details →
            </Link>
          </aside>
          <div>
            <div className="flex justify-between border-b-2 border-[#281f25] pb-4 text-xs uppercase">
              <span>{section?.title}</span>
              <span>
                {section?.total} {section?.totalLabel}
              </span>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {(section?.items ?? []).map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className={
                    index === 0
                      ? 'min-h-64 bg-[#b51f55] p-6 text-white'
                      : 'min-h-64 border border-[#281f25] p-6'
                  }
                >
                  <div className="flex justify-between text-xs uppercase">
                    <span>Archive 0{index + 1}</span>
                    <span>{item.meta}</span>
                  </div>
                  <h2 className="mt-16 font-serif text-3xl">{item.title}</h2>
                  <p className="mt-4 text-sm leading-6 opacity-75">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
