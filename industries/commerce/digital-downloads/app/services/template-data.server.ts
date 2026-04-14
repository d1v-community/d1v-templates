import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  downloadProducts,
  downloadOrders,
  downloadEntitlements,
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

async function loadDownloadProductsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(downloadProducts);
  const rows = await db
    .select()
    .from(downloadProducts)
    .orderBy(desc(downloadProducts.createdAt))
    .limit(3);

  return {
    key: "downloadProducts",
    title: "Products",
    description: "Digital offers that can be merchandised and fulfilled.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "product records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.categoryLabel ?? ""), String(row.deliveryLabel ?? "")]),
    })),
  };
}

async function loadDownloadOrdersSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(downloadOrders);
  const rows = await db
    .select()
    .from(downloadOrders)
    .orderBy(desc(downloadOrders.createdAt))
    .limit(3);

  return {
    key: "downloadOrders",
    title: "Orders",
    description: "Buyer purchases and fulfillment state tracking.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "order records",
    items: rows.map((row) => ({
      title: String(row.buyerEmail ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.productId ?? ""), String(row.fulfillmentLabel ?? "")]),
    })),
  };
}

async function loadDownloadEntitlementsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(downloadEntitlements);
  const rows = await db
    .select()
    .from(downloadEntitlements)
    .orderBy(desc(downloadEntitlements.createdAt))
    .limit(3);

  return {
    key: "downloadEntitlements",
    title: "Entitlements",
    description: "Active file access granted after checkout.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "entitlement records",
    items: rows.map((row) => ({
      title: String(row.buyerEmail ?? ""),
      meta: String(row.accessState ?? ""),
      detail: buildDetail([String(row.productId ?? ""), String(row.downloadLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live download storefront data",
    description: "Products, orders, and entitlements are stored and exposed through the app so the download template verifies more than login and checkout.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadDownloadProductsSection(),
      loadDownloadOrdersSection(),
      loadDownloadEntitlementsSection()
    ]),
  };
}
