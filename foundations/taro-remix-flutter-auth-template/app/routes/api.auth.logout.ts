import { createLogoutHeaders } from "~/utils/auth.server";

export async function action() {
  const headers = createLogoutHeaders();

  return Response.json(
    { success: true, message: "Logged out successfully" },
    { status: 200, headers }
  );
}
