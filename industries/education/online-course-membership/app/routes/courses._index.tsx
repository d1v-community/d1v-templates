import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { EmptyState } from '~/components/sections/EmptyState';
import { PageHeader } from '~/components/sections/PageHeader';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = () => [
  { title: `Library · ${APP_TITLE}` },
  { name: 'description', content: 'Course library with progress.' },
];

const COURSES = [
  { slug: 'getting-started', title: 'Getting started', modules: 6, lessons: 32, progress: 64, level: 'Beginner' },
  { slug: 'craft', title: 'Craft and execution', modules: 8, lessons: 44, progress: 28, level: 'Intermediate' },
  { slug: 'growth', title: 'Growth and distribution', modules: 7, lessons: 38, progress: 12, level: 'Intermediate' },
  { slug: 'leadership', title: 'Leadership and team', modules: 6, lessons: 28, progress: 0, level: 'Advanced' },
  { slug: 'ops', title: 'Ops and finance', modules: 5, lessons: 24, progress: 0, level: 'Advanced' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, courses: COURSES });
}

export default function CoursesIndex() {
  const { user, courses } = useLoaderData<typeof loader>();
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
          eyebrow="Course library"
          title="Pick up where you left off"
          description="Every course is always on. Progress is saved against the same account, so you can switch devices and keep going."
          back={{ href: '/', label: 'Home' }}
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
          {courses.length === 0 ? (
            <EmptyState icon="📘" title="No courses yet" description="Publish your first course and the library will appear here." hint="outline → library" />
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map(course => (
                <Link
                  key={course.slug}
                  to={`/courses/${course.slug}`}
                  className={`group flex flex-col gap-3 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                      {course.level}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{course.progress}%</span>
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{course.title}</h2>
                  <p className={`text-sm ${theme.sectionText}`}>{course.modules} modules · {course.lessons} lessons</p>
                  <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${theme.eyebrow}`}>
                    <div className="h-full w-full rounded-full bg-current opacity-30" style={{ width: `${course.progress}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
