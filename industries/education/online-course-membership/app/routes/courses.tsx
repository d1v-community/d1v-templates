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
export default function Courses() {
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
    <main className="min-h-screen bg-[#fbfbf8] text-[#302f2b]">
      <header className="border-b border-[#deddd8] px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1350px] justify-between">
          <Link to="/" className="font-serif text-xl">
            LessonLoop
          </Link>
          <div className="flex gap-5 text-sm text-[#77746d]">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1350px] px-5 py-10 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.32fr_0.68fr]">
          <aside>
            <p className="font-serif text-lg italic text-[#b44b34]">Your learning path</p>
            <h1 className="mt-5 font-serif text-5xl">Continue with clarity.</h1>
            <p className="mt-5 text-sm leading-7 text-[#77746d]">
              A quiet view of the course, the next lesson, and the progress you have already made.
            </p>
            <nav className="mt-10 space-y-2">
              {snapshot.sections.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setActive(index)}
                  className={
                    active === index
                      ? 'w-full border-l border-[#b44b34] bg-white px-5 py-4 text-left'
                      : 'w-full px-5 py-4 text-left text-[#77746d]'
                  }
                >
                  <span className="font-serif text-lg">{item.title}</span>
                  <span className="float-right text-sm">{item.total}</span>
                </button>
              ))}
            </nav>
            <Link to="/pricing" className="mt-8 block text-sm text-[#b44b34]">
              Membership →
            </Link>
          </aside>
          <div>
            <div className="border-b border-[#deddd8] pb-6">
              <p className="text-xs text-[#9a978f]">CURRENT STUDY NOTE</p>
              <h2 className="mt-3 font-serif text-4xl">{section?.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77746d]">
                {section?.description}
              </p>
            </div>
            <div className="divide-y divide-[#deddd8]">
              {(section?.items ?? []).map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="grid gap-4 py-7 sm:grid-cols-[60px_1fr_auto] sm:items-start"
                >
                  <span className="font-serif text-3xl text-[#b44b34]">{index + 1}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#77746d]">{item.detail}</p>
                  </div>
                  <span className="text-xs text-[#9a978f]">{item.meta}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
