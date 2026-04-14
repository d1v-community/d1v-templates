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
  const recordId = buildBusinessRecordId("gym_membership_paid", context);
  await db.execute(
    sql`insert into renewal_events (id, plan_id, member_email, renewal_state, renewal_label) values (${recordId}, ${"plan_unlimited"}, ${emailFor(context)}, ${"active"}, ${`Membership activated via ${productLabelFor(context)}`}) on conflict (id) do update set
      plan_id = excluded.plan_id,
      member_email = excluded.member_email,
      renewal_state = excluded.renewal_state,
      renewal_label = excluded.renewal_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "renewal_events",
    businessRecordId: recordId,
    accessLabel: `Gym membership active`,
    summary: `Activated the gym membership for ${emailFor(context)}`,
  };
}
