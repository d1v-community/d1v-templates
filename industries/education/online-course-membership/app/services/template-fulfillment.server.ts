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
  const recordId = buildBusinessRecordId("lesson_progress_paid", context);
  await db.execute(
    sql`insert into lesson_progress (id, module_id, student_email, progress_state, completion_label) values (${recordId}, ${"module_growth_foundations"}, ${emailFor(context)}, ${"active"}, ${`Paid access granted via ${productLabelFor(context)}`}) on conflict (id) do update set
      module_id = excluded.module_id,
      student_email = excluded.student_email,
      progress_state = excluded.progress_state,
      completion_label = excluded.completion_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "lesson_progress",
    businessRecordId: recordId,
    accessLabel: `Course membership active`,
    summary: `Unlocked the course membership for ${emailFor(context)}`,
  };
}
