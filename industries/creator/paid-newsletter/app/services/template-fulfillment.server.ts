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
  const recordId = buildBusinessRecordId("newsletter_membership_paid", context);
  await db.execute(
    sql`insert into subscriber_memberships (id, subscriber_email, tier_label, status, renewal_label) values (${recordId}, ${emailFor(context)}, ${productLabelFor(context)}, ${"active"}, ${"Auto-renew enabled"}) on conflict (id) do update set
      subscriber_email = excluded.subscriber_email,
      tier_label = excluded.tier_label,
      status = excluded.status,
      renewal_label = excluded.renewal_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "subscriber_memberships",
    businessRecordId: recordId,
    accessLabel: `Newsletter membership active`,
    summary: `Activated newsletter access for ${emailFor(context)}`,
  };
}
