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

// Issues
export const newsletterIssues = pgTable("newsletter_issues", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  editionLabel: text("edition_label").notNull(),
  publishState: text("publish_state").notNull(),
  accessLabel: text("access_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Subscribers
export const subscriberMemberships = pgTable("subscriber_memberships", {
  id: text("id").primaryKey(),
  subscriberEmail: text("subscriber_email").notNull(),
  tierLabel: text("tier_label").notNull(),
  status: text("status").notNull(),
  renewalLabel: text("renewal_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Archive releases
export const archiveReleases = pgTable("archive_releases", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  curatorLabel: text("curator_label").notNull(),
  visibility: text("visibility").notNull(),
  themeLabel: text("theme_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// UGC: posts (newsletter issues are virtual posts; we materialize entries lazily
// so foreign keys from ugc_comments and ugc_reactions stay valid).
export const ugcPosts = pgTable(
  "ugc_posts",
  {
    id: text("id").primaryKey(),
    appUserId: text("app_user_id").references(() => users.id),
    authorName: text("author_name").notNull(),
    authorInitials: text("author_initials").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    createdIdx: index("ugc_posts_created_idx").on(table.createdAt),
  })
);

// UGC: comments on a post (or virtual issue post)
export const ugcComments = pgTable(
  "ugc_comments",
  {
    id: text("id").primaryKey(),
    postId: text("post_id").notNull().references(() => ugcPosts.id, { onDelete: "cascade" }),
    appUserId: text("app_user_id").references(() => users.id),
    authorName: text("author_name").notNull(),
    authorInitials: text("author_initials").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    postIdx: index("ugc_comments_post_idx").on(table.postId),
  })
);

// UGC: reactions (emoji) on a post (or virtual issue post)
export const ugcReactions = pgTable(
  "ugc_reactions",
  {
    id: text("id").primaryKey(),
    postId: text("post_id").notNull().references(() => ugcPosts.id, { onDelete: "cascade" }),
    appUserId: text("app_user_id").references(() => users.id),
    emoji: text("emoji").notNull(),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  },
  (table) => ({
    postIdx: index("ugc_reactions_post_idx").on(table.postId),
    userEmojiIdx: index("ugc_reactions_user_emoji_idx").on(table.appUserId, table.emoji),
  })
);

export type User = typeof users.$inferSelect;
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type PaymentCheckoutRequest = typeof paymentCheckoutRequests.$inferSelect;
export type PaymentWebhookEvent = typeof paymentWebhookEvents.$inferSelect;
export type PaymentEntitlement = typeof paymentEntitlements.$inferSelect;
export type PaymentFulfillment = typeof paymentFulfillments.$inferSelect;
export type NewsletterIssuesRecord = typeof newsletterIssues.$inferSelect;
export type SubscriberMembershipsRecord = typeof subscriberMemberships.$inferSelect;
export type ArchiveReleasesRecord = typeof archiveReleases.$inferSelect;
export type UgcPost = typeof ugcPosts.$inferSelect;
export type UgcComment = typeof ugcComments.$inferSelect;
export type UgcReaction = typeof ugcReactions.$inferSelect;
