import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  membershipTiers,
  memberProfiles,
  communityEvents,
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

async function loadMembershipTiersSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(membershipTiers);
  const rows = await db
    .select()
    .from(membershipTiers)
    .orderBy(desc(membershipTiers.createdAt))
    .limit(3);

  return {
    key: "membershipTiers",
    title: "Membership tiers",
    description: "Paid levels, perks, and access framing.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "tier records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.priceLabel ?? ""), String(row.perkLabel ?? "")]),
    })),
  };
}

async function loadMemberProfilesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(memberProfiles);
  const rows = await db
    .select()
    .from(memberProfiles)
    .orderBy(desc(memberProfiles.createdAt))
    .limit(3);

  return {
    key: "memberProfiles",
    title: "Members",
    description: "Profiles, access state, and tier assignment.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "member records",
    items: rows.map((row) => ({
      title: String(row.displayName ?? ""),
      meta: String(row.accessState ?? ""),
      detail: buildDetail([String(row.tierId ?? ""), String(row.engagementLabel ?? "")]),
    })),
  };
}

async function loadCommunityEventsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(communityEvents);
  const rows = await db
    .select()
    .from(communityEvents)
    .orderBy(desc(communityEvents.createdAt))
    .limit(3);

  return {
    key: "communityEvents",
    title: "Community events",
    description: "Live drops, office hours, and member programming.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "event records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.eventState ?? ""),
      detail: buildDetail([String(row.hostLabel ?? ""), String(row.scheduleLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live membership community data",
    description: "Community tiers, member accounts, and event records now flow through the same app runtime as auth and billing.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadMembershipTiersSection(),
      loadMemberProfilesSection(),
      loadCommunityEventsSection()
    ]),
  };
}
