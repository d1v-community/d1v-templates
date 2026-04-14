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
  const recordId = buildBusinessRecordId("community_member_paid", context);
  await db.execute(
    sql`insert into member_profiles (id, display_name, tier_id, access_state, engagement_label) values (${recordId}, ${displayNameFor(context)}, ${"tier_core"}, ${"active"}, ${`Joined via ${productLabelFor(context)}`}) on conflict (id) do update set
      display_name = excluded.display_name,
      tier_id = excluded.tier_id,
      access_state = excluded.access_state,
      engagement_label = excluded.engagement_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "member_profiles",
    businessRecordId: recordId,
    accessLabel: `Community membership active`,
    summary: `Activated community membership for ${displayNameFor(context)}`,
  };
}
