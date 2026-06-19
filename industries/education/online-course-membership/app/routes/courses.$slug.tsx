import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { SceneBackground } from '~/components/sections/SceneBackground';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = ({ params }) => [
  { title: `Course · ${params.slug ?? ''} · ${APP_TITLE}` },
  { name: 'description', content: 'Single course detail view.' },
];

const COURSES: Record<string, { title: string; level: string; modules: Array<{ name: string; lessons: string[] }> }> = {
  'getting-started': {
    title: 'Getting started', level: 'Beginner',
    modules: [
      { name: 'Foundations', lessons: ['Welcome and orientation', 'How the library works', 'Setting your goal'] },
      { name: 'First session', lessons: ['Make the first move', 'Capture the first result', 'Plan the next session'] },
    ],
  },
  'craft': { title: 'Craft and execution', level: 'Intermediate', modules: [{ name: 'Frame', lessons: ['Frame the problem', 'Frame the audience'] }] },
  'growth': { title: 'Growth and distribution', level: 'Intermediate', modules: [{ name: 'Channels', lessons: ['Find your channel', 'Publish the first piece'] }] },
  'leadership': { title: 'Leadership and team', level: 'Advanced', modules: [{ name: 'Cadence', lessons: ['Set the cadence', 'Run the review'] }] },
  'ops': { title: 'Ops and finance', level: 'Advanced', modules: [{ name: 'Books', lessons: ['Read the books', 'Build the forecast'] }] },
};

function getCourse(slug: string) {
  return COURSES[slug] ?? { title: slug, level: '—', modules: [{ name: 'Outline', lessons: ['Publish the course outline to populate this view.'] }] };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const slug = params.slug ?? 'unknown';
  return json({ user, slug, ...getCourse(slug) });
}

export default function CourseDetail() {
  const { user, slug, title, level, modules } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d?.authenticated ? setClientUser(d.user) : setClientUser(null)))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } finally { navigate('/?signedOut=1', { replace: true }); }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`${level} · ${slug}`}
          title={title}
          description="Modules and lessons stay attached to the same account. Pick up where you left off on any device."
          back={{ href: '/library', label: 'Library' }}
        />

        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6">
            <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} className="opacity-50" />
            <div className="relative flex flex-col gap-4">
              {modules.map((module, mi) => (
                <article key={module.name} className={`flex flex-col gap-2 rounded-2xl p-4 ${mi === 0 ? theme.assistantShell : theme.listItemShell}`}>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">Module {mi + 1} · {module.name}</h2>
                  <ul className="flex flex-col gap-1.5">
                    {module.lessons.map((lesson, li) => (
                      <li key={lesson} className="text-sm leading-relaxed sm:text-[15px]">· {lesson}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/library" className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
              <span aria-hidden>←</span> Library
            </Link>
            <Link to="/pricing" className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${theme.primaryButton}`}>
              Open pricing
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
