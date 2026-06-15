import type { LoaderFunctionArgs } from "@remix-run/node";
import { getUserFromRequest } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return Response.json({ authenticated: false }, { status: 200 });
  }

  return Response.json({
    authenticated: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    },
  });
}
