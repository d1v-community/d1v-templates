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
  await db.execute(sql`insert into membership_tiers (id, name, price_label, status, perk_label) values (${"tier_core"}, ${"Core circle"}, ${"$19 monthly"}, ${"active"}, ${"Weekly drops + member chat"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into membership_tiers (id, name, price_label, status, perk_label) values (${"tier_backstage"}, ${"Backstage"}, ${"$79 monthly"}, ${"active"}, ${"Office hours + private Q&A"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into member_profiles (id, display_name, tier_id, access_state, engagement_label) values (${"member_aria"}, ${"Aria M"}, ${"tier_core"}, ${"active"}, ${"Attended 3 live sessions"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into member_profiles (id, display_name, tier_id, access_state, engagement_label) values (${"member_joel"}, ${"Joel P"}, ${"tier_backstage"}, ${"past_due"}, ${"Billing update needed"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into community_events (id, title, host_label, event_state, schedule_label) values (${"event_drop_1"}, ${"Private strategy drop"}, ${"Creator host"}, ${"scheduled"}, ${"Thursday 7pm ET"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into community_events (id, title, host_label, event_state, schedule_label) values (${"event_qa_1"}, ${"Backstage Q&A"}, ${"Community lead"}, ${"replay_ready"}, ${"Recording available"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "membership_tiers",
    "member_profiles",
    "community_events"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
