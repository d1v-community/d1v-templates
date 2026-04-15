import { HomeExperience } from "~/components/HomeExperience";
import type { AppHeaderUser } from "~/components/AppHeader";
import type { TemplateSnapshot } from "~/services/template-data.server";

export function DevLoadingCard({
  snapshot,
  user,
}: {
  snapshot?: TemplateSnapshot | null;
  user?: AppHeaderUser;
}) {
  return <HomeExperience snapshot={snapshot} user={user} />;
}
