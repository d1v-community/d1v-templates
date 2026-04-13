import jwt from "jsonwebtoken";
import { env } from "~/utils/env.server";

interface TokenPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    // Try cookie fallback when Authorization is missing
    const cookie = request.headers.get("Cookie");
    if (!cookie) return null;
    // Simple cookie parsing for auth-token
    const parts = cookie.split(/;\s*/);
    for (const part of parts) {
      const [k, ...rest] = part.split("=");
      if (k === "auth-token") {
        return rest.join("=") || null;
      }
    }
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}
