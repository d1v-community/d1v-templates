import { getTemplateSnapshot } from "~/services/template-data.server";

export async function loader() {
  try {
    const snapshot = await getTemplateSnapshot();

    return Response.json(
      {
        success: true,
        snapshot,
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
