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

// Courses
export const learningCourses = pgTable("learning_courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  levelLabel: text("level_label").notNull(),
  accessState: text("access_state").notNull(),
  cadenceLabel: text("cadence_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Modules
export const courseModules = pgTable("course_modules", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  title: text("title").notNull(),
  moduleState: text("module_state").notNull(),
  lessonCountLabel: text("lesson_count_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});

// Lesson progress
export const lessonProgress = pgTable("lesson_progress", {
  id: text("id").primaryKey(),
  moduleId: text("module_id").notNull(),
  studentEmail: text("student_email").notNull(),
  progressState: text("progress_state").notNull(),
  completionLabel: text("completion_label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false }).defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type PaymentCheckoutRequest = typeof paymentCheckoutRequests.$inferSelect;
export type PaymentWebhookEvent = typeof paymentWebhookEvents.$inferSelect;
export type PaymentEntitlement = typeof paymentEntitlements.$inferSelect;
export type PaymentFulfillment = typeof paymentFulfillments.$inferSelect;
export type LearningCoursesRecord = typeof learningCourses.$inferSelect;
export type CourseModulesRecord = typeof courseModules.$inferSelect;
export type LessonProgressRecord = typeof lessonProgress.$inferSelect;
