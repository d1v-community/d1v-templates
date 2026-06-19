import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { EmptyState } from "~/components/sections/EmptyState";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = () => [
  { title: `Browse · ${SITE_CONFIG.appTitle}` },
];

const COURSES = [
  {
    "slug": "creator-kit",
    "title": "Creator kit",
    "price": "$48",
    "format": "PDF / ZIP / Notion",
    "license": "Commercial",
    "updated": "1d ago",
    "hasUpdate": true,
    "lastOpenedAt": "1d ago"
  },
  {
    "slug": "launch-bundle",
    "title": "Launch bundle",
    "price": "$84",
    "format": "ZIP + Notion",
    "license": "Commercial",
    "updated": "4d ago",
    "hasUpdate": true,
    "lastOpenedAt": "3d ago"
  },
  {
    "slug": "analyst-pack",
    "title": "Analyst pack",
    "price": "$36",
    "format": "PDF + Sheets",
    "license": "Single team",
    "updated": "2w ago",
    "hasUpdate": false,
    "lastOpenedAt": "1w ago"
  },
  {
    "slug": "founder-toolkit",
    "title": "Founder toolkit",
    "price": "$120",
    "format": "Notion + ZIP",
    "license": "Commercial",
    "updated": "3w ago",
    "hasUpdate": false,
    "lastOpenedAt": "2w ago"
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

export default function BrowseTab() {
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
