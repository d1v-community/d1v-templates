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
  await db.execute(sql`insert into clinic_providers (id, name, specialty_label, availability_state, schedule_label) values (${"provider_lee"}, ${"Dr. Lee"}, ${"Dermatology consults"}, ${"accepting_bookings"}, ${"Tue / Thu mornings"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into clinic_providers (id, name, specialty_label, availability_state, schedule_label) values (${"provider_morgan"}, ${"Dr. Morgan"}, ${"Wellness follow-ups"}, ${"limited"}, ${"Wed afternoons"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into clinic_appointments (id, provider_id, patient_email, appointment_state, visit_label) values (${"appointment_1"}, ${"provider_lee"}, ${"patient.one@example.com"}, ${"confirmed"}, ${"Initial consult on Apr 18"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into clinic_appointments (id, provider_id, patient_email, appointment_state, visit_label) values (${"appointment_2"}, ${"provider_morgan"}, ${"patient.two@example.com"}, ${"awaiting_deposit"}, ${"Follow-up on Apr 22"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into clinic_intake_forms (id, appointment_id, patient_email, form_state, completion_label) values (${"intake_1"}, ${"appointment_1"}, ${"patient.one@example.com"}, ${"submitted"}, ${"Allergies and history complete"}) on conflict (id) do nothing`);
  await db.execute(sql`insert into clinic_intake_forms (id, appointment_id, patient_email, form_state, completion_label) values (${"intake_2"}, ${"appointment_2"}, ${"patient.two@example.com"}, ${"draft"}, ${"Awaiting insurance details"}) on conflict (id) do nothing`);
  console.log("Seed complete:", {
    demoUserId: DEMO_USER_ID,
    tables: [
    "clinic_providers",
    "clinic_appointments",
    "clinic_intake_forms"
],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
