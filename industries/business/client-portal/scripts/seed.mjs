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
  await db.execute(sql`insert into portal_clients (id, name, account_lead, status, plan_label) values (${"client_maple"}, ${"Maple Studio"}, ${"Ava Chen"}, ${"active"}, ${"Retainer portal"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into portal_clients (id, name, account_lead, status, plan_label) values (${"client_northstar"}, ${"Northstar Labs"}, ${"Jules Park"}, ${"onboarding"}, ${"Launch support"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into portal_projects (id, client_id, title, stage_label, milestone_label) values (${"project_brand_refresh"}, ${"client_maple"}, ${"Brand refresh portal"}, ${"delivery"}, ${"Assets due Friday"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into portal_projects (id, client_id, title, stage_label, milestone_label) values (${"project_launch_dash"}, ${"client_northstar"}, ${"Launch dashboard"}, ${"kickoff"}, ${"Strategy review scheduled"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into portal_uploads (id, project_id, file_name, file_type, status) values (${"upload_brand_guidelines"}, ${"project_brand_refresh"}, ${"Brand guidelines.pdf"}, ${"document"}, ${"approved"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into portal_uploads (id, project_id, file_name, file_type, status) values (${"upload_launch_tracker"}, ${"project_launch_dash"}, ${"Launch tracker.csv"}, ${"spreadsheet"}, ${"review_pending"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "portal_clients",
    "portal_projects",
    "portal_uploads"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
