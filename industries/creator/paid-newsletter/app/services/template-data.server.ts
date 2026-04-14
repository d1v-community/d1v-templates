import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  newsletterIssues,
  subscriberMemberships,
  archiveReleases,
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

async function loadNewsletterIssuesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(newsletterIssues);
  const rows = await db
    .select()
    .from(newsletterIssues)
    .orderBy(desc(newsletterIssues.createdAt))
    .limit(3);

  return {
    key: "newsletterIssues",
    title: "Issues",
    description: "Published and scheduled premium issues.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "issue records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.publishState ?? ""),
      detail: buildDetail([String(row.editionLabel ?? ""), String(row.accessLabel ?? "")]),
    })),
  };
}

async function loadSubscriberMembershipsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(subscriberMemberships);
  const rows = await db
    .select()
    .from(subscriberMemberships)
    .orderBy(desc(subscriberMemberships.createdAt))
    .limit(3);

  return {
    key: "subscriberMemberships",
    title: "Subscribers",
    description: "Access state and billing-aware membership records.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "subscriber records",
    items: rows.map((row) => ({
      title: String(row.subscriberEmail ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.tierLabel ?? ""), String(row.renewalLabel ?? "")]),
    })),
  };
}

async function loadArchiveReleasesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(archiveReleases);
  const rows = await db
    .select()
    .from(archiveReleases)
    .orderBy(desc(archiveReleases.createdAt))
    .limit(3);

  return {
    key: "archiveReleases",
    title: "Archive releases",
    description: "Special collections and gated archive packaging.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "archive releases",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.visibility ?? ""),
      detail: buildDetail([String(row.curatorLabel ?? ""), String(row.themeLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live newsletter publishing data",
    description: "Issues, subscriber state, and archive releases now exist in the database and are exposed through a real app route.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadNewsletterIssuesSection(),
      loadSubscriberMembershipsSection(),
      loadArchiveReleasesSection()
    ]),
  };
}
