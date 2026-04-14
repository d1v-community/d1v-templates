import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  learningCourses,
  courseModules,
  lessonProgress,
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

async function loadLearningCoursesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(learningCourses);
  const rows = await db
    .select()
    .from(learningCourses)
    .orderBy(desc(learningCourses.createdAt))
    .limit(3);

  return {
    key: "learningCourses",
    title: "Courses",
    description: "Primary course offers and membership-access content.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "course records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.accessState ?? ""),
      detail: buildDetail([String(row.levelLabel ?? ""), String(row.cadenceLabel ?? "")]),
    })),
  };
}

async function loadCourseModulesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(courseModules);
  const rows = await db
    .select()
    .from(courseModules)
    .orderBy(desc(courseModules.createdAt))
    .limit(3);

  return {
    key: "courseModules",
    title: "Modules",
    description: "Curriculum groupings and lesson clusters.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "module records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.courseId ?? ""),
      detail: buildDetail([String(row.moduleState ?? ""), String(row.lessonCountLabel ?? "")]),
    })),
  };
}

async function loadLessonProgressSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(lessonProgress);
  const rows = await db
    .select()
    .from(lessonProgress)
    .orderBy(desc(lessonProgress.createdAt))
    .limit(3);

  return {
    key: "lessonProgress",
    title: "Lesson progress",
    description: "Student completion state and activity history.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "progress records",
    items: rows.map((row) => ({
      title: String(row.studentEmail ?? ""),
      meta: String(row.progressState ?? ""),
      detail: buildDetail([String(row.moduleId ?? ""), String(row.completionLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live course membership data",
    description: "Courses, modules, and progress state now live in Neon and are exposed through a dedicated API route for real frontend/backend verification.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadLearningCoursesSection(),
      loadCourseModulesSection(),
      loadLessonProgressSection()
    ]),
  };
}
