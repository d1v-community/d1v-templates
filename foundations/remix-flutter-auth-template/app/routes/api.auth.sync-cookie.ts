import type { ActionFunctionArgs } from "@remix-run/node";
import { getTokenFromRequest, verifyToken } from "~/services/jwt.server";
import { createAuthHeaders } from "~/utils/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!verifyToken(token)) {
    return Response.json({ success: false, error: "Invalid token" }, { status: 401 });
  }

  const headers = createAuthHeaders(token);
  return Response.json({ success: true }, { status: 200, headers });
}
