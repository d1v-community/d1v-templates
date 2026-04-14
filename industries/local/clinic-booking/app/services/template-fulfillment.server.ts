import { sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import type {
  PaymentFulfillmentContext,
  TemplateFulfillmentResult,
} from "~/services/payment-fulfillment.server";

function displayNameFor(context: PaymentFulfillmentContext) {
  return (
    context.user.displayName ||
    context.user.username ||
    context.user.email ||
    "Paid member"
  );
}

function emailFor(context: PaymentFulfillmentContext) {
  return context.user.email || context.transaction.customerEmail || "member@example.com";
}

function productLabelFor(context: PaymentFulfillmentContext) {
  return context.transaction.productName || "Paid access";
}

function buildBusinessRecordId(prefix: string, context: PaymentFulfillmentContext) {
  return `${prefix}_${context.user.id}_${context.transaction.productId || "product"}`
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .slice(0, 120);
}

export async function fulfillTemplateEntitlement(
  context: PaymentFulfillmentContext,
): Promise<TemplateFulfillmentResult> {
  const recordId = buildBusinessRecordId("clinic_appointment_paid", context);
  await db.execute(
    sql`insert into clinic_appointments (id, provider_id, patient_email, appointment_state, visit_label) values (${recordId}, ${"provider_lee"}, ${emailFor(context)}, ${"deposit_paid"}, ${`Priority intake unlocked via ${productLabelFor(context)}`}) on conflict (id) do update set
      provider_id = excluded.provider_id,
      patient_email = excluded.patient_email,
      appointment_state = excluded.appointment_state,
      visit_label = excluded.visit_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "clinic_appointments",
    businessRecordId: recordId,
    accessLabel: `Clinic booking deposit received`,
    summary: `Booked the clinic intake flow for ${emailFor(context)}`,
  };
}
