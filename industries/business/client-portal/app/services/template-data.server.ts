import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  portalClients,
  portalProjects,
  portalUploads,
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

async function loadPortalClientsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(portalClients);
  const rows = await db
    .select()
    .from(portalClients)
    .orderBy(desc(portalClients.createdAt))
    .limit(3);

  return {
    key: "portalClients",
    title: "Clients",
    description: "Accounts with active portal access and service ownership.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "client records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.accountLead ?? ""), String(row.planLabel ?? "")]),
    })),
  };
}

async function loadPortalProjectsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(portalProjects);
  const rows = await db
    .select()
    .from(portalProjects)
    .orderBy(desc(portalProjects.createdAt))
    .limit(3);

  return {
    key: "portalProjects",
    title: "Projects",
    description: "Delivery milestones and portal-facing workstreams.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "project records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.stageLabel ?? ""),
      detail: buildDetail([String(row.clientId ?? ""), String(row.milestoneLabel ?? "")]),
    })),
  };
}

async function loadPortalUploadsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(portalUploads);
  const rows = await db
    .select()
    .from(portalUploads)
    .orderBy(desc(portalUploads.createdAt))
    .limit(3);

  return {
    key: "portalUploads",
    title: "Uploads",
    description: "Shared files, approvals, and client-visible assets.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "upload records",
    items: rows.map((row) => ({
      title: String(row.fileName ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.projectId ?? ""), String(row.fileType ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live client portal data",
    description: "Projects, milestones, and uploads are stored in the same database that powers auth, making the portal template a real end-to-end starter.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadPortalClientsSection(),
      loadPortalProjectsSection(),
      loadPortalUploadsSection()
    ]),
  };
}
