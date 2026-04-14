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
  await db.execute(sql`insert into gym_membership_plans (id, name, price_label, status, benefit_label) values (${"plan_unlimited"}, ${"Unlimited access"}, ${"$89 monthly"}, ${"active"}, ${"Open gym + classes"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into gym_membership_plans (id, name, price_label, status, benefit_label) values (${"plan_foundation"}, ${"Foundation plan"}, ${"$49 monthly"}, ${"active"}, ${"Open gym access"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into member_checkins (id, plan_id, member_email, visit_state, visit_label) values (${"checkin_1"}, ${"plan_unlimited"}, ${"member.one@example.com"}, ${"completed"}, ${"Strength class on Apr 13"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into member_checkins (id, plan_id, member_email, visit_state, visit_label) values (${"checkin_2"}, ${"plan_foundation"}, ${"member.two@example.com"}, ${"booked"}, ${"Open gym slot on Apr 16"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into renewal_events (id, plan_id, member_email, renewal_state, renewal_label) values (${"renewal_1"}, ${"plan_unlimited"}, ${"member.one@example.com"}, ${"scheduled"}, ${"Renews Apr 30"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into renewal_events (id, plan_id, member_email, renewal_state, renewal_label) values (${"renewal_2"}, ${"plan_foundation"}, ${"member.two@example.com"}, ${"payment_retry"}, ${"Card retry tomorrow"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "gym_membership_plans",
    "member_checkins",
    "renewal_events"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
