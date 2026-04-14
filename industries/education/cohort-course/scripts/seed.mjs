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
  await db.execute(sql`insert into course_cohorts (id, name, schedule_label, enrollment_state, seat_label) values (${"cohort_summer_ops"}, ${"Summer GTM cohort"}, ${"Starts May 12"}, ${"open"}, ${"18 seats remaining"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into course_cohorts (id, name, schedule_label, enrollment_state, seat_label) values (${"cohort_exec_sprint"}, ${"Executive sprint"}, ${"Starts June 2"}, ${"waitlist"}, ${"Invite list only"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into cohort_lessons (id, cohort_id, title, session_label, module_label) values (${"lesson_offer_map"}, ${"cohort_summer_ops"}, ${"Offer mapping workshop"}, ${"Session 1"}, ${"Positioning"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into cohort_lessons (id, cohort_id, title, session_label, module_label) values (${"lesson_revenue_model"}, ${"cohort_exec_sprint"}, ${"Revenue model teardown"}, ${"Session 2"}, ${"Pricing systems"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into cohort_enrollments (id, cohort_id, student_email, status, onboarding_label) values (${"enrollment_1"}, ${"cohort_summer_ops"}, ${"student.one@example.com"}, ${"paid"}, ${"Welcome packet sent"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into cohort_enrollments (id, cohort_id, student_email, status, onboarding_label) values (${"enrollment_2"}, ${"cohort_exec_sprint"}, ${"student.two@example.com"}, ${"application_review"}, ${"Awaiting fit interview"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "course_cohorts",
    "cohort_lessons",
    "cohort_enrollments"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
