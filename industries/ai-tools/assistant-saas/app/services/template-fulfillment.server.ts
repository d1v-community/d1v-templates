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
  const recordId = buildBusinessRecordId("workspace_paid", context);
  await db.execute(
    sql`insert into assistant_workspaces (id, owner_user_id, name, plan_name, status, seat_summary) values (${recordId}, ${context.user.id}, ${`${displayNameFor(context)} Workspace`}, ${productLabelFor(context)}, ${"active"}, ${`1 paid seat unlocked on ${productLabelFor(context)}`}) on conflict (id) do update set
      owner_user_id = excluded.owner_user_id,
      name = excluded.name,
      plan_name = excluded.plan_name,
      status = excluded.status,
      seat_summary = excluded.seat_summary,
      updated_at = now()`,
  );

  return {
    businessEntity: "assistant_workspaces",
    businessRecordId: recordId,
    accessLabel: `Assistant workspace unlocked for ${displayNameFor(context)}`,
    summary: `Activated assistant workspace for ${displayNameFor(context)}`,
  };
}
