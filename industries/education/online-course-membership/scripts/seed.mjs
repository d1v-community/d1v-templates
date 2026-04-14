import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const neonClient = neon(databaseUrl);
const client = Object.assign(
  (text, params, options) => neonClient.query(text, params, options),
  { transaction: neonClient.transaction?.bind(neonClient) },
);
const db = drizzle(client);

const DEMO_USER_ID = "demo_user_industry_template";

async function main() {
  await db.execute(sql`insert into users (id, username, display_name, email) values (${DEMO_USER_ID}, ${"demo"}, ${"Demo User"}, ${"demo@example.com"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into learning_courses (id, title, level_label, access_state, cadence_label) values (${"course_growth_systems"}, ${"Growth systems"}, ${"Intermediate"}, ${"active"}, ${"Self-paced"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into learning_courses (id, title, level_label, access_state, cadence_label) values (${"course_exec_briefings"}, ${"Executive briefings"}, ${"Advanced"}, ${"coming_soon"}, ${"Weekly release"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into course_modules (id, course_id, title, module_state, lesson_count_label) values (${"module_growth_foundations"}, ${"course_growth_systems"}, ${"Growth foundations"}, ${"published"}, ${"6 lessons"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into course_modules (id, course_id, title, module_state, lesson_count_label) values (${"module_exec_ops"}, ${"course_exec_briefings"}, ${"Executive operating model"}, ${"draft"}, ${"4 lessons planned"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into lesson_progress (id, module_id, student_email, progress_state, completion_label) values (${"progress_1"}, ${"module_growth_foundations"}, ${"learner.one@example.com"}, ${"on_track"}, ${"4 of 6 lessons completed"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into lesson_progress (id, module_id, student_email, progress_state, completion_label) values (${"progress_2"}, ${"module_exec_ops"}, ${"learner.two@example.com"}, ${"not_started"}, ${"Unlocks next Monday"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "learning_courses",
    "course_modules",
    "lesson_progress"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
