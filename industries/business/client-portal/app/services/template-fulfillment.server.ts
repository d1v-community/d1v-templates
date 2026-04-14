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
  const recordId = buildBusinessRecordId("portal_client_paid", context);
  await db.execute(
    sql`insert into portal_clients (id, name, account_lead, status, plan_label) values (${recordId}, ${displayNameFor(context)}, ${emailFor(context)}, ${"active"}, ${productLabelFor(context)}) on conflict (id) do update set
      name = excluded.name,
      account_lead = excluded.account_lead,
      status = excluded.status,
      plan_label = excluded.plan_label,
      updated_at = now()`,
  );

  return {
    businessEntity: "portal_clients",
    businessRecordId: recordId,
    accessLabel: `Client portal account activated`,
    summary: `Provisioned the client portal for ${displayNameFor(context)}`,
  };
}
