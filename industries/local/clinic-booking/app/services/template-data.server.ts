import { count, desc } from "drizzle-orm";
import { db } from "~/db/db.server";
import {
  clinicProviders,
  clinicAppointments,
  clinicIntakeForms,
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

async function loadClinicProvidersSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(clinicProviders);
  const rows = await db
    .select()
    .from(clinicProviders)
    .orderBy(desc(clinicProviders.createdAt))
    .limit(3);

  return {
    key: "clinicProviders",
    title: "Providers",
    description: "Clinicians, specialties, and booking availability state.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "provider records",
    items: rows.map((row) => ({
      title: String(row.name ?? ""),
      meta: String(row.availabilityState ?? ""),
      detail: buildDetail([String(row.specialtyLabel ?? ""), String(row.scheduleLabel ?? "")]),
    })),
  };
}

async function loadClinicAppointmentsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(clinicAppointments);
  const rows = await db
    .select()
    .from(clinicAppointments)
    .orderBy(desc(clinicAppointments.createdAt))
    .limit(3);

  return {
    key: "clinicAppointments",
    title: "Appointments",
    description: "Patient bookings, deposit status, and visit state.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "appointment records",
    items: rows.map((row) => ({
      title: String(row.patientEmail ?? ""),
      meta: String(row.appointmentState ?? ""),
      detail: buildDetail([String(row.providerId ?? ""), String(row.visitLabel ?? "")]),
    })),
  };
}

async function loadClinicIntakeFormsSection(): Promise<TemplateSnapshotSection> {
  const totalRows = await db.select({ value: count() }).from(clinicIntakeForms);
  const rows = await db
    .select()
    .from(clinicIntakeForms)
    .orderBy(desc(clinicIntakeForms.createdAt))
    .limit(3);

  return {
    key: "clinicIntakeForms",
    title: "Intake forms",
    description: "Pre-visit intake completion and readiness state.",
    total: Number(totalRows[0]?.value ?? 0),
    totalLabel: "intake records",
    items: rows.map((row) => ({
      title: String(row.patientEmail ?? ""),
      meta: String(row.formState ?? ""),
      detail: buildDetail([String(row.appointmentId ?? ""), String(row.completionLabel ?? "")]),
    })),
  };
}

export async function getTemplateSnapshot(): Promise<TemplateSnapshot> {
  return {
    title: "Live clinic booking data",
    description: "Providers, appointments, and intake records now back the starter so booking and patient portal flows are connected to real tables.",
    generatedAt: new Date().toISOString(),
    sections: await Promise.all([
      loadClinicProvidersSection(),
      loadClinicAppointmentsSection(),
      loadClinicIntakeFormsSection()
    ]),
  };
}
