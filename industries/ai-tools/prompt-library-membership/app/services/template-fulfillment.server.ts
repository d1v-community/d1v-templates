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
  const recordId = buildBusinessRecordId("member_unlock_paid", context);
  await db.execute(
    sql`insert into member_unlocks (id, member_email, pack_id, access_state, unlock_label) values (${recordId}, ${emailFor(context)}, ${"pack_sales_os"}, ${"active"}, ${`Paid archive access via ${productLabelFor(context)}`}) on conflict (id) do update set
      member_email = excluded.member_email,
      pack_id = excluded.pack_id,
      access_state = excluded.access_state,
      unlock_label = excluded.unlock_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "member_unlocks",
    businessRecordId: recordId,
    accessLabel: `Prompt library membership active`,
    summary: `Unlocked the prompt library for ${emailFor(context)}`,
  };
}
