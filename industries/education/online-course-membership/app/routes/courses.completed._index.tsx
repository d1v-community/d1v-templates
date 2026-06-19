import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Completed · ${SITE_CONFIG.appTitle}` },
];

const COURSES = [
  {
    "slug": "getting-started",
    "title": "Getting started",
    "modules": 6,
    "lessons": 32,
    "progress": 64,
    "level": "Beginner",
    "lastTouchedAt": "2d ago"
  },
  {
    "slug": "craft",
    "title": "Craft and execution",
    "modules": 8,
    "lessons": 44,
    "progress": 28,
    "level": "Intermediate",
    "lastTouchedAt": "1d ago"
  },
  {
    "slug": "growth",
    "title": "Growth and distribution",
    "modules": 7,
    "lessons": 38,
    "progress": 12,
    "level": "Intermediate",
    "lastTouchedAt": "4d ago"
  },
  {
    "slug": "leadership",
    "title": "Leadership and team",
    "modules": 6,
    "lessons": 28,
    "progress": 100,
    "level": "Advanced",
    "lastTouchedAt": "3w ago"
  },
  {
    "slug": "ops",
    "title": "Ops and finance",
    "modules": 5,
    "lessons": 24,
    "progress": 100,
    "level": "Advanced",
    "lastTouchedAt": "1mo ago"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const courses = COURSES;
  return json({ user, courses });
}

interface Course {
  slug: string;
  title: string;
  modules: number;
  lessons: number;
  progress: number;
  level: string;
  lastTouchedAt?: string;
}

export default function CompletedTab() {
  const { courses } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const list = courses as unknown as Course[];

  if (list.length === 0) {
    return <EmptyState icon="📘" title="No courses here" description="Once a course reaches this milestone, it will appear here." />;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((course) => (
        <li key={course.slug}>
          <Link
            to={`/courses/${course.slug}`}
            className={`group flex flex-col gap-3 rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>{course.level}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">{course.progress}%</span>
            </div>
            <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{course.title}</h3>
            <p className={`text-sm ${theme.sectionText}`}>{course.modules} modules · {course.lessons} lessons</p>
            <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${theme.eyebrow}`}>
              <div className="h-full rounded-full bg-current opacity-30" style={{ width: `${course.progress}%` }} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
