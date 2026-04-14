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
  const recordId = buildBusinessRecordId("cohort_enrollment_paid", context);
  await db.execute(
    sql`insert into cohort_enrollments (id, cohort_id, student_email, status, onboarding_label) values (${recordId}, ${"cohort_summer_ops"}, ${emailFor(context)}, ${"active"}, ${`Enrollment confirmed via ${productLabelFor(context)}`}) on conflict (id) do update set
      cohort_id = excluded.cohort_id,
      student_email = excluded.student_email,
      status = excluded.status,
      onboarding_label = excluded.onboarding_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "cohort_enrollments",
    businessRecordId: recordId,
    accessLabel: `Cohort enrollment active`,
    summary: `Enrolled ${emailFor(context)} into the cohort`,
  };
}
