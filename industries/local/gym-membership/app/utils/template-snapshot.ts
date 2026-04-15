import type {
  TemplateSnapshot,
  TemplateSnapshotItem,
  TemplateSnapshotSection,
} from "~/services/template-data.server";

function toPublicItem(
  item: TemplateSnapshotItem,
  section: TemplateSnapshotSection,
): TemplateSnapshotItem {
  return {
    title: item.title,
    meta: item.meta,
    detail: `Public preview visible. Sign in to inspect full ${section.title.toLowerCase()} context.`,
  };
}

export function toPublicTemplateSnapshot(
  snapshot: TemplateSnapshot,
): TemplateSnapshot {
  return {
    ...snapshot,
    description: `${snapshot.description} Public visitors see a limited preview until they sign in.`,
    sections: snapshot.sections.map((section) => ({
      ...section,
      items: section.items.slice(0, 2).map((item) => toPublicItem(item, section)),
    })),
  };
}
