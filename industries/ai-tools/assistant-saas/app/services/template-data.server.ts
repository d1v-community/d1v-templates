import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  assistantWorkspaces,
  assistantThreads,
  creditLedgerEntries,
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

async function loadAssistantWorkspacesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(assistantWorkspaces);
  const rows = await db
    .select()
    .from(assistantWorkspaces)
    .orderBy(desc(assistantWorkspaces.createdAt))
    .limit(3);

  return {
    key: "assistantWorkspaces",
    title: "Workspaces",
    description: "Paid assistant accounts, plan state, and seat ownership.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "workspace records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.planName ?? ""), String(row.seatSummary ?? "")]),
    })),
  };
}

async function loadAssistantThreadsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(assistantThreads);
  const rows = await db
    .select()
    .from(assistantThreads)
    .orderBy(desc(assistantThreads.createdAt))
    .limit(3);

  return {
    key: "assistantThreads",
    title: "Threads",
    description: "Conversation history, queue state, and follow-up ownership.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "thread records",
    items: rows.map((row) => ({
      title: String(row.subject ?? ""),
      meta: String(row.queueState ?? ""),
      detail: buildDetail([String(row.channel ?? ""), String(row.ownerLabel ?? "")]),
    })),
  };
}

async function loadCreditLedgerEntriesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(creditLedgerEntries);
  const rows = await db
    .select()
    .from(creditLedgerEntries)
    .orderBy(desc(creditLedgerEntries.createdAt))
    .limit(3);

  return {
    key: "creditLedgerEntries",
    title: "Credit ledger",
    description: "Usage grants, burn, and balance-facing adjustments.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "ledger entries",
    items: rows.map((row) => ({
      title: String(row.entryType ?? ""),
      meta: String(row.workspaceId ?? ""),
      detail: buildDetail([String(row.balanceLabel ?? ""), String(row.note ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live assistant workspace data",
    description: "Industry tables seeded into Neon so auth, pricing, API responses, and homepage surfaces can all read the same workspace state.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadAssistantWorkspacesSection(),
      loadAssistantThreadsSection(),
      loadCreditLedgerEntriesSection()
    ]),
  };
}
