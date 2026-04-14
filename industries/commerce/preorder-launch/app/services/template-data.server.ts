import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  launchOffers,
  preorders,
  shipmentUpdates,
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

async function loadLaunchOffersSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(launchOffers);
  const rows = await db
    .select()
    .from(launchOffers)
    .orderBy(desc(launchOffers.createdAt))
    .limit(3);

  return {
    key: "launchOffers",
    title: "Launch offers",
    description: "Hero offers, reservation windows, and release state.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "offer records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.launchState ?? ""),
      detail: buildDetail([String(row.priceLabel ?? ""), String(row.timelineLabel ?? "")]),
    })),
  };
}

async function loadPreordersSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(preorders);
  const rows = await db
    .select()
    .from(preorders)
    .orderBy(desc(preorders.createdAt))
    .limit(3);

  return {
    key: "preorders",
    title: "Preorders",
    description: "Reservation records and customer launch readiness.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "preorder records",
    items: rows.map((row) => ({
      title: String(row.customerEmail ?? ""),
      meta: String(row.status ?? ""),
      detail: buildDetail([String(row.offerId ?? ""), String(row.reservationLabel ?? "")]),
    })),
  };
}

async function loadShipmentUpdatesSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(shipmentUpdates);
  const rows = await db
    .select()
    .from(shipmentUpdates)
    .orderBy(desc(shipmentUpdates.createdAt))
    .limit(3);

  return {
    key: "shipmentUpdates",
    title: "Shipment updates",
    description: "Post-launch updates and fulfillment communication state.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "shipment updates",
    items: rows.map((row) => ({
      title: String(row.updateTitle ?? ""),
      meta: String(row.deliveryState ?? ""),
      detail: buildDetail([String(row.offerId ?? ""), String(row.audienceLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live preorder launch data",
    description: "Offer, preorder, and shipment-state records now exist in Neon so the launch template can prove checkout-to-fulfillment data flow.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadLaunchOffersSection(),
      loadPreordersSection(),
      loadShipmentUpdatesSection()
    ]),
  };
}
