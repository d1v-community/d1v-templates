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
  await db.execute(sql`insert into prompt_packs (id, title, category_label, visibility, release_label) values (${"pack_sales_os"}, ${"Sales OS"}, ${"Outbound systems"}, ${"members_only"}, ${"Friday drop"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into prompt_packs (id, title, category_label, visibility, release_label) values (${"pack_customer_research"}, ${"Customer Research Sprint"}, ${"Research workflows"}, ${"preview"}, ${"New this week"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into prompt_entries (id, pack_id, title, workflow_label, difficulty_label) values (${"prompt_multistep_followup"}, ${"pack_sales_os"}, ${"Multi-step follow-up sequence"}, ${"Outbound follow-up"}, ${"Intermediate"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into prompt_entries (id, pack_id, title, workflow_label, difficulty_label) values (${"prompt_interview_map"}, ${"pack_customer_research"}, ${"Customer interview map"}, ${"Research planning"}, ${"Beginner"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into member_unlocks (id, member_email, pack_id, access_state, unlock_label) values (${"unlock_member_1"}, ${"member.one@example.com"}, ${"pack_sales_os"}, ${"active"}, ${"Full archive included"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into member_unlocks (id, member_email, pack_id, access_state, unlock_label) values (${"unlock_member_2"}, ${"member.two@example.com"}, ${"pack_customer_research"}, ${"preview"}, ${"Preview tier access"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "prompt_packs",
    "prompt_entries",
    "member_unlocks"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
