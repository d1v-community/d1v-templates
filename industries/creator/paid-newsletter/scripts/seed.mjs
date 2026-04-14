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
  await db.execute(sql`insert into newsletter_issues (id, title, edition_label, publish_state, access_label) values (${"issue_market_signal"}, ${"Market signal memo"}, ${"Issue 42"}, ${"published"}, ${"Premium archive"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into newsletter_issues (id, title, edition_label, publish_state, access_label) values (${"issue_operator_brief"}, ${"Operator brief"}, ${"Issue 43"}, ${"scheduled"}, ${"Members on release"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into subscriber_memberships (id, subscriber_email, tier_label, status, renewal_label) values (${"subscriber_1"}, ${"reader.one@example.com"}, ${"Premium annual"}, ${"active"}, ${"Renews January 2027"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into subscriber_memberships (id, subscriber_email, tier_label, status, renewal_label) values (${"subscriber_2"}, ${"reader.two@example.com"}, ${"Premium monthly"}, ${"canceled"}, ${"Access ends this month"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into archive_releases (id, title, curator_label, visibility, theme_label) values (${"archive_q1"}, ${"Q1 operating archive"}, ${"Editorial desk"}, ${"members_only"}, ${"Operations strategy"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into archive_releases (id, title, curator_label, visibility, theme_label) values (${"archive_bestof"}, ${"Best-of onboarding bundle"}, ${"Editorial desk"}, ${"preview"}, ${"Getting started"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "newsletter_issues",
    "subscriber_memberships",
    "archive_releases"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
