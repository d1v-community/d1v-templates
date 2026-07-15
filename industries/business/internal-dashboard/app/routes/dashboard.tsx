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
export default function Dashboard() {
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
    <main className="min-h-screen bg-[#f7f8f5] text-[#17233d]">
      <header className="border-b border-[#cfd4cc] bg-white px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[1500px] justify-between">
          <Link to="/" className="font-bold">
            OpsCanvas
          </Link>
          <div className="flex gap-5 text-sm text-[#657087]">
            <span className="hidden sm:block">{user.email ?? user.username}</span>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-[#17233d] pb-6">
          <div>
            <p className="text-xs font-bold uppercase text-[#e05d35]">
              Executive operations report
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Today’s operating picture.</h1>
          </div>
          <Link to="/pricing" className="text-sm">
            Manage access →
          </Link>
        </div>
        <div className="mt-6 grid border border-[#cfd4cc] bg-white sm:grid-cols-3">
          {snapshot.sections.map((item, index) => (
            <button
              key={item.key}
              onClick={() => setActive(index)}
              className={
                active === index
                  ? 'border-b-4 border-[#e05d35] p-5 text-left'
                  : 'border-b-4 border-transparent p-5 text-left sm:border-l sm:first:border-l-0'
              }
            >
              <p className="text-xs uppercase text-[#657087]">{item.title}</p>
              <p className="mt-4 text-4xl font-semibold">{item.total}</p>
              <p className="mt-1 text-xs text-[#657087]">{item.totalLabel}</p>
            </button>
          ))}
        </div>
        <div className="mt-7 border border-[#cfd4cc] bg-white">
          <div className="flex flex-wrap justify-between gap-4 border-b border-[#cfd4cc] p-5">
            <div>
              <h2 className="text-xl font-semibold">{section?.title}</h2>
              <p className="mt-2 text-sm text-[#657087]">{section?.description}</p>
            </div>
            <span className="text-xs font-bold uppercase text-[#e05d35]">Current register</span>
          </div>
          <div className="divide-y divide-[#dfe3dd]">
            {(section?.items ?? []).map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="grid gap-3 p-5 md:grid-cols-[60px_1fr_1fr_auto] md:items-center"
              >
                <span className="text-xs text-[#e05d35]">0{index + 1}</span>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-[#657087]">{item.detail}</p>
                <span className="w-fit bg-[#edf0ec] px-3 py-1 text-xs font-semibold">
                  {item.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
