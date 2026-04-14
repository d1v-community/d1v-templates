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
  await db.execute(sql`insert into kpi_snapshots (id, metric_name, metric_value, status, owner_label) values (${"kpi_health_score"}, ${"Health score"}, ${"93%"}, ${"stable"}, ${"Ops lead"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into kpi_snapshots (id, metric_name, metric_value, status, owner_label) values (${"kpi_approval_backlog"}, ${"Approval backlog"}, ${"12 pending"}, ${"watch"}, ${"Finance ops"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into ops_tasks (id, title, owner_label, status, priority_label) values (${"task_vendor_review"}, ${"Review vendor payout exception"}, ${"Finance ops"}, ${"open"}, ${"High"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into ops_tasks (id, title, owner_label, status, priority_label) values (${"task_status_report"}, ${"Publish daily operating brief"}, ${"Chief of staff"}, ${"in_progress"}, ${"Medium"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into audit_events (id, event_title, event_type, actor_label, context_label) values (${"audit_incident_1"}, ${"Incident severity lowered"}, ${"incident_update"}, ${"Ops lead"}, ${"Payments queue"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into audit_events (id, event_title, event_type, actor_label, context_label) values (${"audit_approval_1"}, ${"Launch budget approved"}, ${"approval"}, ${"Finance director"}, ${"Q2 campaign"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "kpi_snapshots",
    "ops_tasks",
    "audit_events"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
