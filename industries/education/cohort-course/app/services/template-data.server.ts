import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  courseCohorts,
  cohortLessons,
  cohortEnrollments,
} from "~/db/schema";

export type TemplateSnapshotItem = {
  title: string;
  meta: string;
  detail: string;
};

export type TemplateSnapshotSection = {
  key: string;
  title: string;
  description: string;
  total: number;
  totalLabel: string;
  items: TemplateSnapshotItem[];
};

export type TemplateSnapshot = {
  title: string;
  description: string;
  generatedAt: string;
  sections: TemplateSnapshotSection[];
};

function buildDetail(parts: string[]) {
  return parts.filter(Boolean).join(" | ");
}

async function loadCourseCohortsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(courseCohorts);
  const rows = await db
    .select()
    .from(courseCohorts)
    .orderBy(desc(courseCohorts.createdAt))
    .limit(3);

  return {
    key: "courseCohorts",
    title: "Cohorts",
    description: "Seat-limited cohorts, schedules, and launch status.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "cohort records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.enrollmentState ?? ""),
      detail: buildDetail([String(row.scheduleLabel ?? ""), String(row.seatLabel ?? "")]),
    })),
  };
}

async function loadCohortLessonsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(cohortLessons);
  const rows = await db
    .select()
    .from(cohortLessons)
    .orderBy(desc(cohortLessons.createdAt))
    .limit(3);

  return {
    key: "cohortLessons",
    title: "Lessons",
    description: "Curriculum sessions and instructional milestones.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "lesson records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.cohortId ?? ""),
      detail: buildDetail([String(row.sessionLabel ?? ""), String(row.moduleLabel ?? "")]),
    })),
  };
}

async function loadCohortEnrollmentsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(cohortEnrollments);
  const rows = await db
    .select()
    .from(cohortEnrollments)
    .orderBy(desc(cohortEnrollments.createdAt))
    .limit(3);

  return {
    key: "cohortEnrollments",
    title: "Enrollments",
    description: "Student reservations and onboarding state.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "enrollment records",
    items: rows.map((row) => ({
      title: String(row.studentEmail ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.cohortId ?? ""), String(row.onboardingLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live cohort enrollment data",
    description: "Cohorts, lessons, and enrollment records are now persisted and exposed back into the starter to prove the education flow is wired end to end.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadCourseCohortsSection(),
      loadCohortLessonsSection(),
      loadCohortEnrollmentsSection()
    ]),
  };
}
