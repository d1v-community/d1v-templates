import { eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import type { User } from "~/db/schema";
import { users } from "~/db/schema";
import { getTokenFromRequest, verifyToken } from "~/services/jwt.server";

export async function getUserFromRequest(request: Request): Promise<User | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const result = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    console.error("Failed to load user from database:", error);
    return null;
  }
}

export async function requireUser(request: Request): Promise<User> {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return user;
}

export function createAuthHeaders(token: string): HeadersInit {
  return {
    "Set-Cookie": `auth-token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
  };
}

export function createLogoutHeaders(): HeadersInit {
  return {
    "Set-Cookie": `auth-token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
  };
}
