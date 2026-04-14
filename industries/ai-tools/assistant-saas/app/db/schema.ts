import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Email verification codes
export const verificationCodes = pgTable(
  "verification_codes",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    purpose: text("purpose").notNull().default("login"),
    expiresAt: timestamp("expires_at", { withTimezone: false }).notNull(),
    used: text("used").notNull().default("false"),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("verification_codes_email_idx").on(table.email),
    emailPurposeIdx: index("verification_codes_email_purpose_idx").on(table.email, table.purpose),
  })
);

// Payment checkout requests
export const paymentCheckoutRequests = pgTable("payment_checkout_requests", {
  id: text("id").primaryKey(),
  appUserId: text("app_user_id").notNull().references(() => users.id),
  externalBuyerUserId: text("external_buyer_user_id").notNull(),
  productId: text("product_id").notNull(),
  checkoutStatus: text("checkout_status").notNull(),
  paymentLinkUrl: text("payment_link_url"),
  successUrl: text("success_url").notNull(),
  cancelUrl: text("cancel_url").notNull(),
  lastTransactionId: text("last_transaction_id"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Payment webhook events
export const paymentWebhookEvents = pgTable("payment_webhook_events", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  transactionId: text("transaction_id"),
  signature: text("signature"),
  payloadJson: text("payload_json").notNull(),
  processingStatus: text("processing_status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Payment entitlements
export const paymentEntitlements = pgTable("payment_entitlements", {
  id: text("id").primaryKey(),
  appUserId: text("app_user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull(),
  entitlementStatus: text("entitlement_status").notNull(),
  accessLabel: text("access_label").notNull(),
  source: text("source").notNull(),
  lastTransactionId: text("last_transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Payment fulfillment records
export const paymentFulfillments = pgTable("payment_fulfillments", {
  id: text("id").primaryKey(),
  appUserId: text("app_user_id").notNull().references(() => users.id),
  productId: text("product_id").notNull(),
  transactionId: text("transaction_id").notNull(),
  businessEntity: text("business_entity").notNull(),
  businessRecordId: text("business_record_id").notNull(),
  fulfillmentStatus: text("fulfillment_status").notNull(),
  fulfillmentSource: text("fulfillment_source").notNull(),
  summaryLabel: text("summary_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Workspaces
export const assistantWorkspaces = pgTable("assistant_workspaces", {
  id: text("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  planName: text("plan_name").notNull(),
  status: text("status").notNull(),
  seatSummary: text("seat_summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Threads
export const assistantThreads = pgTable("assistant_threads", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  subject: text("subject").notNull(),
  channel: text("channel").notNull(),
  queueState: text("queue_state").notNull(),
  ownerLabel: text("owner_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Credit ledger
export const creditLedgerEntries = pgTable("credit_ledger_entries", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id").notNull(),
  entryType: text("entry_type").notNull(),
  balanceLabel: text("balance_label").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type PaymentCheckoutRequest = typeof paymentCheckoutRequests.$inferSelect;
export type PaymentWebhookEvent = typeof paymentWebhookEvents.$inferSelect;
export type PaymentEntitlement = typeof paymentEntitlements.$inferSelect;
export type PaymentFulfillment = typeof paymentFulfillments.$inferSelect;
export type AssistantWorkspacesRecord = typeof assistantWorkspaces.$inferSelect;
export type AssistantThreadsRecord = typeof assistantThreads.$inferSelect;
export type CreditLedgerEntriesRecord = typeof creditLedgerEntries.$inferSelect;
