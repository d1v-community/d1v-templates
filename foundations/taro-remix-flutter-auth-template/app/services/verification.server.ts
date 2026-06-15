import { randomUUID } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "~/db/db.server";
import { users, verificationCodes } from "~/db/schema";
import { env } from "~/utils/env.server";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await db
    .delete(verificationCodes)
    .where(and(eq(verificationCodes.email, email), eq(verificationCodes.purpose, "login"), eq(verificationCodes.used, "false")));

  await db.insert(verificationCodes).values({
    id: randomUUID(),
    email,
    code,
    purpose: "login",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    used: "false",
  });

  return code;
}

export async function sendVerificationEmail(email: string, code: string) {
  if (!resend) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    return { success: true, id: "dev-mode" };
  }

  const result = await resend.emails.send({
    from: "Auth Template <send@dontreply.d1v.xyz>",
    to: [email],
    subject: "Your verification code",
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result;
}

export async function verifyCode(email: string, code: string) {
  const result = await db
    .select()
    .from(verificationCodes)
    .where(
      and(
        eq(verificationCodes.email, email),
        eq(verificationCodes.code, code),
        eq(verificationCodes.purpose, "login"),
        eq(verificationCodes.used, "false"),
        gt(verificationCodes.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (result.length === 0) return false;

  await db.update(verificationCodes).set({ used: "true" }).where(eq(verificationCodes.id, result[0].id));
  return true;
}

export async function findOrCreateUserByEmail(email: string) {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) return existing[0];

  const username = email.split("@")[0] || "user";
  const user = {
    id: randomUUID(),
    username,
    displayName: username,
    email,
    avatarUrl: null as string | null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(users).values(user);
  return user;
}
