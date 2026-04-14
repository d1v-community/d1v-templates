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
  await db.execute(sql`insert into assistant_workspaces (id, owner_user_id, name, plan_name, status, seat_summary) values (${"ws_signaldesk_core"}, ${DEMO_USER_ID}, ${"SignalDesk Core"}, ${"Pro Assistant"}, ${"active"}, ${"12 active seats"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into assistant_workspaces (id, owner_user_id, name, plan_name, status, seat_summary) values (${"ws_signaldesk_support"}, ${DEMO_USER_ID}, ${"Support Escalations"}, ${"Team Concierge"}, ${"trialing"}, ${"5 shared operators"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into assistant_threads (id, workspace_id, subject, channel, queue_state, owner_label) values (${"thread_onboarding_1"}, ${"ws_signaldesk_core"}, ${"First-run onboarding"}, ${"In-app chat"}, ${"open"}, ${"Growth ops"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into assistant_threads (id, workspace_id, subject, channel, queue_state, owner_label) values (${"thread_support_1"}, ${"ws_signaldesk_support"}, ${"Credit cap escalation"}, ${"Email handoff"}, ${"needs review"}, ${"Human support"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into credit_ledger_entries (id, workspace_id, entry_type, balance_label, note) values (${"ledger_grant_1"}, ${"ws_signaldesk_core"}, ${"monthly_grant"}, ${"240 credits remaining"}, ${"Starter grant applied after checkout"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into credit_ledger_entries (id, workspace_id, entry_type, balance_label, note) values (${"ledger_burn_1"}, ${"ws_signaldesk_support"}, ${"usage_burn"}, ${"88 credits remaining"}, ${"Escalation triage workflow consumed 12 credits"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "assistant_workspaces",
    "assistant_threads",
    "credit_ledger_entries"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
