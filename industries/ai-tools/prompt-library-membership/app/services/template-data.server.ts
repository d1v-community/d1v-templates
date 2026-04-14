import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  promptPacks,
  promptEntries,
  memberUnlocks,
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

async function loadPromptPacksSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(promptPacks);
  const rows = await db
    .select()
    .from(promptPacks)
    .orderBy(desc(promptPacks.createdAt))
    .limit(3);

  return {
    key: "promptPacks",
    title: "Prompt packs",
    description: "Launchable prompt collections and membership-facing offers.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "pack records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.visibility ?? ""),
      detail: buildDetail([String(row.categoryLabel ?? ""), String(row.releaseLabel ?? "")]),
    })),
  };
}

async function loadPromptEntriesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(promptEntries);
  const rows = await db
    .select()
    .from(promptEntries)
    .orderBy(desc(promptEntries.createdAt))
    .limit(3);

  return {
    key: "promptEntries",
    title: "Prompt entries",
    description: "Individual prompts, workflows, and implementation notes.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "prompt records",
    items: rows.map((row) => ({
      title: String(row.title ?? ""),
      meta: String(row.packId ?? ""),
      detail: buildDetail([String(row.workflowLabel ?? ""), String(row.difficultyLabel ?? "")]),
    })),
  };
}

async function loadMemberUnlocksSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(memberUnlocks);
  const rows = await db
    .select()
    .from(memberUnlocks)
    .orderBy(desc(memberUnlocks.createdAt))
    .limit(3);

  return {
    key: "memberUnlocks",
    title: "Member unlocks",
    description: "Entitlements granted after subscription or bundle purchases.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "unlock records",
    items: rows.map((row) => ({
      title: String(row.memberEmail ?? ""),
      meta: String(row.accessState ?? ""),
      detail: buildDetail([String(row.packId ?? ""), String(row.unlockLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live prompt library data",
    description: "Seeded library records prove the membership surface, protected data layer, and API responses all share the same content model.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadPromptPacksSection(),
      loadPromptEntriesSection(),
      loadMemberUnlocksSection()
    ]),
  };
}
