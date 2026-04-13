import { db } from "~/db/db.server";
import { users } from "~/db/schema";
import { verifyToken, getTokenFromRequest } from "~/services/jwt.server";
import { eq } from "drizzle-orm";
import type { User } from "~/db/schema";

export async function getUserFromRequest(request: Request): Promise<User | null> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  try {
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (userResults.length === 0) {
      return null;
    }

    return userResults[0];
  } catch (error) {
    // If the database is not configured (for example, missing DATABASE_URL),
    // we treat this as "no user" instead of crashing the request.
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
    "Set-Cookie": `auth-token=${token}; HttpOnly; Path=/; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
  };
}

export function createLogoutHeaders(): HeadersInit {
  return {
    "Set-Cookie": `auth-token=; HttpOnly; Path=/; SameSite=None; Max-Age=0; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`,
  };
}
