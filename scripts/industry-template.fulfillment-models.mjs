function getTable(model, exportName) {
  const table = model.tables.find((entry) => entry.exportName === exportName);

  if (!table) {
    throw new Error(`Missing fulfillment table ${exportName}.`);
  }

  return table;
}

function getSeedId(model, exportName, rowIndex = 0) {
  const table = getTable(model, exportName);
  const row = table.seedRows[rowIndex];

  if (!row?.id) {
    throw new Error(`Missing seed row ${rowIndex} for ${exportName}.`);
  }

  return row.id;
}

function buildModel(config) {
  return (model) => config(model);
}

export const INDUSTRY_FULFILLMENT_MODELS = {
  "ai-assistant-saas": buildModel(() => ({
    targetExportName: "assistantWorkspaces",
    businessEntity: "assistant_workspaces",
    tableName: "assistant_workspaces",
    idPrefix: "workspace_paid",
    columns: {
      id: "recordId",
      owner_user_id: "context.user.id",
      name: "`" + "${displayNameFor(context)} Workspace" + "`",
      plan_name: "productLabelFor(context)",
      status: '"active"',
      seat_summary: "`" + "1 paid seat unlocked on ${productLabelFor(context)}" + "`",
    },
    updateColumns: [
      "owner_user_id",
      "name",
      "plan_name",
      "status",
      "seat_summary",
    ],
    accessLabel: "`" + "Assistant workspace unlocked for ${displayNameFor(context)}" + "`",
    summary: "`" + "Activated assistant workspace for ${displayNameFor(context)}" + "`",
  })),
  "ai-prompt-library-membership": buildModel((model) => ({
    targetExportName: "memberUnlocks",
    businessEntity: "member_unlocks",
    tableName: "member_unlocks",
    idPrefix: "member_unlock_paid",
    columns: {
      id: "recordId",
      member_email: "emailFor(context)",
      pack_id: JSON.stringify(getSeedId(model, "promptPacks")),
      access_state: '"active"',
      unlock_label: "`" + "Paid archive access via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["member_email", "pack_id", "access_state", "unlock_label"],
    accessLabel: "`" + "Prompt library membership active" + "`",
    summary: "`" + "Unlocked the prompt library for ${emailFor(context)}" + "`",
  })),
  "business-internal-dashboard": buildModel(() => ({
    targetExportName: "opsTasks",
    businessEntity: "ops_tasks",
    tableName: "ops_tasks",
    idPrefix: "ops_paid_activation",
    columns: {
      id: "recordId",
      title: "`" + "Onboard ${displayNameFor(context)}" + "`",
      owner_label: '"Revenue ops"',
      status: '"queued"',
      priority_label: '"paid_activation"',
    },
    updateColumns: ["title", "owner_label", "status", "priority_label"],
    accessLabel: "`" + "Paid dashboard onboarding queued" + "`",
    summary: "`" + "Queued a paid activation task for ${displayNameFor(context)}" + "`",
  })),
  "business-client-portal": buildModel(() => ({
    targetExportName: "portalClients",
    businessEntity: "portal_clients",
    tableName: "portal_clients",
    idPrefix: "portal_client_paid",
    columns: {
      id: "recordId",
      name: "displayNameFor(context)",
      account_lead: "emailFor(context)",
      status: '"active"',
      plan_label: "productLabelFor(context)",
    },
    updateColumns: ["name", "account_lead", "status", "plan_label"],
    accessLabel: "`" + "Client portal account activated" + "`",
    summary: "`" + "Provisioned the client portal for ${displayNameFor(context)}" + "`",
  })),
  "commerce-digital-downloads": buildModel(() => ({
    targetExportName: "downloadEntitlements",
    businessEntity: "download_entitlements",
    tableName: "download_entitlements",
    idPrefix: "download_entitlement_paid",
    columns: {
      id: "recordId",
      product_id: "context.transaction.productId ?? 'digital_download'",
      buyer_email: "emailFor(context)",
      access_state: '"active"',
      download_label: "`" + "Download unlocked via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["product_id", "buyer_email", "access_state", "download_label"],
    accessLabel: "`" + "Digital download unlocked" + "`",
    summary: "`" + "Granted download access to ${emailFor(context)}" + "`",
  })),
  "commerce-preorder-launch": buildModel((model) => ({
    targetExportName: "preorders",
    businessEntity: "preorders",
    tableName: "preorders",
    idPrefix: "preorder_paid",
    columns: {
      id: "recordId",
      offer_id: JSON.stringify(getSeedId(model, "launchOffers")),
      customer_email: "emailFor(context)",
      status: '"confirmed"',
      reservation_label: "`" + "Reserved via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["offer_id", "customer_email", "status", "reservation_label"],
    accessLabel: "`" + "Preorder reservation confirmed" + "`",
    summary: "`" + "Confirmed the preorder for ${emailFor(context)}" + "`",
  })),
  "creator-community-membership": buildModel((model) => ({
    targetExportName: "memberProfiles",
    businessEntity: "member_profiles",
    tableName: "member_profiles",
    idPrefix: "community_member_paid",
    columns: {
      id: "recordId",
      display_name: "displayNameFor(context)",
      tier_id: JSON.stringify(getSeedId(model, "membershipTiers")),
      access_state: '"active"',
      engagement_label: "`" + "Joined via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["display_name", "tier_id", "access_state", "engagement_label"],
    accessLabel: "`" + "Community membership active" + "`",
    summary: "`" + "Activated community membership for ${displayNameFor(context)}" + "`",
  })),
  "creator-paid-newsletter": buildModel(() => ({
    targetExportName: "subscriberMemberships",
    businessEntity: "subscriber_memberships",
    tableName: "subscriber_memberships",
    idPrefix: "newsletter_membership_paid",
    columns: {
      id: "recordId",
      subscriber_email: "emailFor(context)",
      tier_label: "productLabelFor(context)",
      status: '"active"',
      renewal_label: '"Auto-renew enabled"',
    },
    updateColumns: ["subscriber_email", "tier_label", "status", "renewal_label"],
    accessLabel: "`" + "Newsletter membership active" + "`",
    summary: "`" + "Activated newsletter access for ${emailFor(context)}" + "`",
  })),
  "education-cohort-course": buildModel((model) => ({
    targetExportName: "cohortEnrollments",
    businessEntity: "cohort_enrollments",
    tableName: "cohort_enrollments",
    idPrefix: "cohort_enrollment_paid",
    columns: {
      id: "recordId",
      cohort_id: JSON.stringify(getSeedId(model, "courseCohorts")),
      student_email: "emailFor(context)",
      status: '"active"',
      onboarding_label: "`" + "Enrollment confirmed via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["cohort_id", "student_email", "status", "onboarding_label"],
    accessLabel: "`" + "Cohort enrollment active" + "`",
    summary: "`" + "Enrolled ${emailFor(context)} into the cohort" + "`",
  })),
  "education-online-course-membership": buildModel((model) => ({
    targetExportName: "lessonProgress",
    businessEntity: "lesson_progress",
    tableName: "lesson_progress",
    idPrefix: "lesson_progress_paid",
    columns: {
      id: "recordId",
      module_id: JSON.stringify(getSeedId(model, "courseModules")),
      student_email: "emailFor(context)",
      progress_state: '"active"',
      completion_label: "`" + "Paid access granted via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["module_id", "student_email", "progress_state", "completion_label"],
    accessLabel: "`" + "Course membership active" + "`",
    summary: "`" + "Unlocked the course membership for ${emailFor(context)}" + "`",
  })),
  "local-clinic-booking": buildModel((model) => ({
    targetExportName: "clinicAppointments",
    businessEntity: "clinic_appointments",
    tableName: "clinic_appointments",
    idPrefix: "clinic_appointment_paid",
    columns: {
      id: "recordId",
      provider_id: JSON.stringify(getSeedId(model, "clinicProviders")),
      patient_email: "emailFor(context)",
      appointment_state: '"deposit_paid"',
      visit_label: "`" + "Priority intake unlocked via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["provider_id", "patient_email", "appointment_state", "visit_label"],
    accessLabel: "`" + "Clinic booking deposit received" + "`",
    summary: "`" + "Booked the clinic intake flow for ${emailFor(context)}" + "`",
  })),
  "local-gym-membership": buildModel((model) => ({
    targetExportName: "renewalEvents",
    businessEntity: "renewal_events",
    tableName: "renewal_events",
    idPrefix: "gym_membership_paid",
    columns: {
      id: "recordId",
      plan_id: JSON.stringify(getSeedId(model, "gymMembershipPlans")),
      member_email: "emailFor(context)",
      renewal_state: '"active"',
      renewal_label: "`" + "Membership activated via ${productLabelFor(context)}" + "`",
    },
    updateColumns: ["plan_id", "member_email", "renewal_state", "renewal_label"],
    accessLabel: "`" + "Gym membership active" + "`",
    summary: "`" + "Activated the gym membership for ${emailFor(context)}" + "`",
  })),
};
