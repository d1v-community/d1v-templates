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
  await db.execute(sql`insert into download_products (id, name, category_label, status, delivery_label) values (${"product_conversion_kit"}, ${"Conversion kit"}, ${"Template bundle"}, ${"active"}, ${"Instant download"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into download_products (id, name, category_label, status, delivery_label) values (${"product_launch_copy"}, ${"Launch copy vault"}, ${"Copy system"}, ${"active"}, ${"ZIP + updates"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into download_orders (id, product_id, buyer_email, status, fulfillment_label) values (${"order_kit_1"}, ${"product_conversion_kit"}, ${"buyer.one@example.com"}, ${"paid"}, ${"Link issued"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into download_orders (id, product_id, buyer_email, status, fulfillment_label) values (${"order_copy_1"}, ${"product_launch_copy"}, ${"buyer.two@example.com"}, ${"refunded"}, ${"Access revoked"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into download_entitlements (id, product_id, buyer_email, access_state, download_label) values (${"entitlement_kit_1"}, ${"product_conversion_kit"}, ${"buyer.one@example.com"}, ${"active"}, ${"2 remaining downloads"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into download_entitlements (id, product_id, buyer_email, access_state, download_label) values (${"entitlement_copy_1"}, ${"product_launch_copy"}, ${"buyer.two@example.com"}, ${"inactive"}, ${"Suspended after refund"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "download_products",
    "download_orders",
    "download_entitlements"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
