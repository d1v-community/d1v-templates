import { Resend } from "resend";
import { db } from "~/db/db.server";
import { verificationCodes, users } from "~/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { env } from "~/utils/env.server";
import { randomUUID } from "crypto";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export class VerificationStorageError extends Error {
  constructor(message = "Verification storage is unavailable.") {
    super(message);
    this.name = "VerificationStorageError";
  }
}

export class VerificationEmailError extends Error {
  constructor(message = "Verification email delivery failed.") {
    super(message);
    this.name = "VerificationEmailError";
  }
}

function normalizeStorageError(error: unknown): VerificationStorageError {
  const detail =
    error instanceof Error && error.message
      ? error.message
      : "Unknown database error";

  return new VerificationStorageError(
    `Database unavailable for verification flow: ${detail}`,
  );
}

export async function generateVerificationCode(email: string) {
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Delete any existing unused codes for this email
    await db
      .delete(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.purpose, "login"),
          eq(verificationCodes.used, "false")
        )
      );

    // Create new verification code with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(verificationCodes).values({
      id: randomUUID(),
      email,
      code,
      purpose: "login",
      expiresAt,
      used: "false",
    });
  } catch (error) {
    console.error("Failed to persist verification code:", error);
    throw normalizeStorageError(error);
  }

  return code;
}

export async function sendVerificationEmail(email: string, code: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping email send");
    console.log(`Verification code for ${email}: ${code}`);
    return { success: true, id: "dev-mode" };
  }

  try {
    const result = await resend.emails.send({
      from: "Verification Code <send@dontreply.d1v.xyz>",
      to: [email],
      subject: "Your verification code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 36px; letter-spacing: 4px; color: #333;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new VerificationEmailError(
      error instanceof Error && error.message
        ? `Failed to send verification email: ${error.message}`
        : "Failed to send verification email",
    );
  }
}

export async function verifyCode(email: string, code: string) {
  let results;
  try {
    // Find valid, unused code
    results = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.code, code),
          eq(verificationCodes.purpose, "login"),
          eq(verificationCodes.used, "false"),
          gt(verificationCodes.expiresAt, new Date())
        )
      )
      .limit(1);
  } catch (error) {
    console.error("Failed to load verification code:", error);
    throw normalizeStorageError(error);
  }

  if (results.length === 0) {
    return false;
  }

  const verification = results[0];

  try {
    // Mark code as used
    await db
      .update(verificationCodes)
      .set({ used: "true" })
      .where(eq(verificationCodes.id, verification.id));
  } catch (error) {
    console.error("Failed to mark verification code as used:", error);
    throw normalizeStorageError(error);
  }

  return true;
}

export async function findOrCreateUserByEmail(email: string) {
  let existingUsers;
  try {
    // Try to find existing user
    existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  } catch (error) {
    console.error("Failed to load user by email:", error);
    throw normalizeStorageError(error);
  }

  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  // Create new user
  const username = email.split("@")[0];
  const newUser = {
    id: randomUUID(),
    username,
    displayName: username,
    email,
    avatarUrl: null as string | null,
  };

  try {
    await db.insert(users).values(newUser);
  } catch (error) {
    console.error("Failed to create user by email:", error);
    throw normalizeStorageError(error);
  }
  return newUser;
}
