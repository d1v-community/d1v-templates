import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import {
  VerificationEmailError,
  VerificationStorageError,
  generateVerificationCode,
  sendVerificationEmail,
} from "~/services/verification.server";
import { isProd } from "~/utils/env.server";

const requestSchema = z.object({
  email: z.string().email(),
});

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    const code = await generateVerificationCode(email);

    if (isProd) {
      await sendVerificationEmail(email, code);
      return Response.json(
        { success: true, message: "Verification code sent" },
        { status: 200 }
      );
    } else {
      // In development, don't actually send email; return the code for UI hint
      console.log(`[DEV] Verification code for ${email}: ${code}`);
      return Response.json(
        { success: true, message: "Verification code generated", dev: true, code },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Send code error:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (error instanceof VerificationStorageError) {
      return Response.json(
        {
          success: false,
          error: isProd
            ? "Verification service database is unavailable."
            : `${error.message}. Check DATABASE_URL and run the database migration.`,
        },
        { status: 503 }
      );
    }

    if (error instanceof VerificationEmailError) {
      return Response.json(
        {
          success: false,
          error: isProd
            ? "Failed to send verification email."
            : error.message,
        },
        { status: 502 }
      );
    }

    return Response.json(
      { success: false, error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
