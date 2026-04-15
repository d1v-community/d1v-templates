import { getTemplateSnapshot } from "~/services/template-data.server";
import { getUserFromRequest } from "~/utils/auth.server";
import { toPublicTemplateSnapshot } from "~/utils/template-snapshot";

export async function loader({ request }: { request: Request }) {
  try {
    const user = await getUserFromRequest(request);
    const snapshot = await getTemplateSnapshot();

    return Response.json(
      {
        success: true,
        snapshot: user ? snapshot : toPublicTemplateSnapshot(snapshot),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load template snapshot.";

    return Response.json(
      {
        success: false,
        error: message,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
