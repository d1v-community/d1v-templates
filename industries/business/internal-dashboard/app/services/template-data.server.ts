import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  kpiSnapshots,
  opsTasks,
  auditEvents,
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

async function loadKpiSnapshotsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(kpiSnapshots);
  const rows = await db
    .select()
    .from(kpiSnapshots)
    .orderBy(desc(kpiSnapshots.createdAt))
    .limit(3);

  return {
    key: "kpiSnapshots",
    title: "KPI snapshots",
    description: "Metrics operators expect to review on every session.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "kpi snapshots",
    items: rows.map((row) => ({
      title: String(row.metricName ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.metricValue ?? ""), String(row.ownerLabel ?? "")]),
    })),
  };
}

async function loadOpsTasksSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(opsTasks);
  const rows = await db
    .select()
    .from(opsTasks)
    .orderBy(desc(opsTasks.createdAt))
    .limit(3);

  return {
    key: "opsTasks",
    title: "Ops tasks",
    description: "Assigned workflow tasks and next-action queues.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "task records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.ownerLabel ?? ""), String(row.priorityLabel ?? "")]),
    })),
  };
}

async function loadAuditEventsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(auditEvents);
  const rows = await db
    .select()
    .from(auditEvents)
    .orderBy(desc(auditEvents.createdAt))
    .limit(3);

  return {
    key: "auditEvents",
    title: "Audit events",
    description: "Operator actions, incident notes, and approval trails.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "audit events",
    items: rows.map((row) => ({
      title: String(row.eventTitle ?? ""),
      meta: String(row.eventType ?? ""),
      detail: buildDetail([String(row.actorLabel ?? ""), String(row.contextLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live operations data",
    description: "Operational entities are stored in Neon and surfaced back into the app to prove the dashboard starter is no longer auth-only.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadKpiSnapshotsSection(),
      loadOpsTasksSection(),
      loadAuditEventsSection()
    ]),
  };
}
