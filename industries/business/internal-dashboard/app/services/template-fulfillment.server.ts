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
  const recordId = buildBusinessRecordId("ops_paid_activation", context);
  await db.execute(
    sql`insert into ops_tasks (id, title, owner_label, status, priority_label) values (${recordId}, ${`Onboard ${displayNameFor(context)}`}, ${"Revenue ops"}, ${"queued"}, ${"paid_activation"}) on conflict (id) do update set
      title = excluded.title,
      owner_label = excluded.owner_label,
      status = excluded.status,
      priority_label = excluded.priority_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "ops_tasks",
    businessRecordId: recordId,
    accessLabel: `Paid dashboard onboarding queued`,
    summary: `Queued a paid activation task for ${displayNameFor(context)}`,
  };
}
