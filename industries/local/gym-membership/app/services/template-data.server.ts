import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  gymMembershipPlans,
  memberCheckins,
  renewalEvents,
} from "~/db/schema";

export type TemplateSnapshotItem = {
  title: string;
  meta: string;
  detail: string;
};

export type TemplateSnapshotSection = {
  key: string;
  title: string;
  description: string;
  total: number;
  totalLabel: string;
  items: TemplateSnapshotItem[];
};

export type TemplateSnapshot = {
  title: string;
  description: string;
  generatedAt: string;
  sections: TemplateSnapshotSection[];
};

function buildDetail(parts: string[]) {
  return parts.filter(Boolean).join(" | ");
}

async function loadGymMembershipPlansSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(gymMembershipPlans);
  const rows = await db
    .select()
    .from(gymMembershipPlans)
    .orderBy(desc(gymMembershipPlans.createdAt))
    .limit(3);

  return {
    key: "gymMembershipPlans",
    title: "Membership plans",
    description: "Sellable plans, benefits, and renewal framing.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "plan records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.priceLabel ?? ""), String(row.benefitLabel ?? "")]),
    })),
  };
}

async function loadMemberCheckinsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(memberCheckins);
  const rows = await db
    .select()
    .from(memberCheckins)
    .orderBy(desc(memberCheckins.createdAt))
    .limit(3);

  return {
    key: "memberCheckins",
    title: "Check-ins",
    description: "Visit history and class attendance state.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "check-in records",
    items: rows.map((row) => ({
      title: String(row.memberEmail ?? ""),
      meta: String(row.visitState ?? ""),
      detail: buildDetail([String(row.planId ?? ""), String(row.visitLabel ?? "")]),
    })),
  };
}

async function loadRenewalEventsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(renewalEvents);
  const rows = await db
    .select()
    .from(renewalEvents)
    .orderBy(desc(renewalEvents.createdAt))
    .limit(3);

  return {
    key: "renewalEvents",
    title: "Renewals",
    description: "Membership renewal and billing state history.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "renewal events",
    items: rows.map((row) => ({
      title: String(row.memberEmail ?? ""),
      meta: String(row.renewalState ?? ""),
      detail: buildDetail([String(row.planId ?? ""), String(row.renewalLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live gym membership data",
    description: "Plan, check-in, and renewal records now live in the database and are exposed through the app for real operational verification.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadGymMembershipPlansSection(),
      loadMemberCheckinsSection(),
      loadRenewalEventsSection()
    ]),
  };
}
