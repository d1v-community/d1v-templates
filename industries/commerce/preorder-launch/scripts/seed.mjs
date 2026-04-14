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
  await db.execute(sql`insert into launch_offers (id, name, price_label, launch_state, timeline_label) values (${"offer_alpha_drop"}, ${"Alpha hardware drop"}, ${"$149 preorder"}, ${"preorder_open"}, ${"Ships in June"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into launch_offers (id, name, price_label, launch_state, timeline_label) values (${"offer_founder_bundle"}, ${"Founder bundle"}, ${"$249 launch bundle"}, ${"waitlist"}, ${"Invite-only window"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into preorders (id, offer_id, customer_email, status, reservation_label) values (${"preorder_alpha_1"}, ${"offer_alpha_drop"}, ${"launch.one@example.com"}, ${"deposit_paid"}, ${"Queue slot 014"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into preorders (id, offer_id, customer_email, status, reservation_label) values (${"preorder_bundle_1"}, ${"offer_founder_bundle"}, ${"launch.two@example.com"}, ${"waitlisted"}, ${"Priority launch notice"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into shipment_updates (id, offer_id, update_title, delivery_state, audience_label) values (${"shipment_alpha_1"}, ${"offer_alpha_drop"}, ${"Assembly line cleared QA"}, ${"scheduled"}, ${"Paid preorders"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into shipment_updates (id, offer_id, update_title, delivery_state, audience_label) values (${"shipment_bundle_1"}, ${"offer_founder_bundle"}, ${"Founder bundle waitlist update"}, ${"draft"}, ${"VIP waitlist"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "launch_offers",
    "preorders",
    "shipment_updates"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
