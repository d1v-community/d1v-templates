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
export default function Portal() {
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
    <main className="min-h-screen bg-[#fbfaf8] text-[#291b20]">
      <header className="border-b border-[#d8d2cf] bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <Link to="/" className="font-serif text-xl">
            ClientRoom
          </Link>
          <div className="flex gap-5 text-sm text-[#6e6266]">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#d8d2cf] p-6 lg:min-h-[calc(100svh-69px)] lg:border-b-0 lg:border-r lg:p-8">
          <p className="text-xs uppercase text-[#8b2f43]">Private engagement</p>
          <h1 className="mt-5 font-serif text-3xl">Your client room.</h1>
          <nav className="mt-9 space-y-2">
            {snapshot.sections.map((item, index) => (
              <button
                key={item.key}
                onClick={() => setActive(index)}
                className={
                  active === index
                    ? 'w-full bg-[#f2e9eb] p-4 text-left'
                    : 'w-full p-4 text-left text-[#6e6266]'
                }
              >
                <span className="block font-medium">{item.title}</span>
                <span className="mt-1 block text-xs">
                  {item.total} {item.totalLabel}
                </span>
              </button>
            ))}
          </nav>
          <Link
            to="/pricing"
            className="mt-8 block border-t border-[#d8d2cf] pt-5 text-sm text-[#8b2f43]"
          >
            Service plan →
          </Link>
        </aside>
        <section className="p-6 sm:p-9 lg:p-12">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#d8d2cf] pb-7">
            <div>
              <p className="text-xs uppercase text-[#8b2f43]">Current engagement</p>
              <h2 className="mt-3 font-serif text-4xl">{section?.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e6266]">
                {section?.description}
              </p>
            </div>
            <p className="font-serif text-5xl text-[#8b2f43]">{section?.total}</p>
          </div>
          <div className="mt-8 space-y-4">
            {(section?.items ?? []).map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="grid gap-4 border border-[#d8d2cf] bg-white p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="font-serif text-2xl text-[#8b2f43]">0{index + 1}</span>
                <div>
                  <h3 className="font-serif text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#6e6266]">{item.detail}</p>
                </div>
                <span className="w-fit text-xs uppercase text-[#8b2f43]">{item.meta}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
