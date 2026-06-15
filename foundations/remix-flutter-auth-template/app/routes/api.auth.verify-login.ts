import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { verifyCode, findOrCreateUserByEmail } from "~/services/verification.server";
import { generateToken } from "~/services/jwt.server";
import { createAuthHeaders } from "~/utils/auth.server";

const requestSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const { email, code } = requestSchema.parse(body);

    const isValid = await verifyCode(email, code);

    if (!isValid) {
      return Response.json(
        { success: false, error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    const user = await findOrCreateUserByEmail(email);
    const token = generateToken({ userId: user.id, email: user.email! });

    const headers = createAuthHeaders(token);

    return Response.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
        token,
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Verify login error:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Login verification failed" },
      { status: 500 }
    );
  }
}
