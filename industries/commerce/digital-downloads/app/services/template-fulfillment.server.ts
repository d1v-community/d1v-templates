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
  const recordId = buildBusinessRecordId("download_entitlement_paid", context);
  await db.execute(
    sql`insert into download_entitlements (id, product_id, buyer_email, access_state, download_label) values (${recordId}, ${context.transaction.productId ?? 'digital_download'}, ${emailFor(context)}, ${"active"}, ${`Download unlocked via ${productLabelFor(context)}`}) on conflict (id) do update set
      product_id = excluded.product_id,
      buyer_email = excluded.buyer_email,
      access_state = excluded.access_state,
      download_label = excluded.download_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "download_entitlements",
    businessRecordId: recordId,
    accessLabel: `Digital download unlocked`,
    summary: `Granted download access to ${emailFor(context)}`,
  };
}
