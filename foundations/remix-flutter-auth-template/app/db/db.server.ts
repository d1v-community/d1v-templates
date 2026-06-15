import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { env } from "~/utils/env.server";

const hasDatabaseUrl = Boolean(env.DATABASE_URL);

if (!hasDatabaseUrl) {
  console.warn(
    "DATABASE_URL environment variable is not set. Database access is disabled until it is configured.",
  );
}

// Create Neon client only when DATABASE_URL is available so that importing
// this module does not crash the serverless function.
const neonClient = hasDatabaseUrl ? neon(env.DATABASE_URL) : null;

// Adapter to support Drizzle's expected call signature (text, params, options)
// while using Neon's recommended `.query()` under the hood.
const client = Object.assign(
  (text: string, params?: any[], options?: any) => {
    if (!neonClient) {
      throw new Error(
        "DATABASE_URL environment variable is not set. Database operations are not available.",
      );
    }
    return (neonClient as any).query(text, params, options);
  },
  {
    transaction: hasDatabaseUrl
      ? (neonClient as any).transaction?.bind(neonClient)
      : undefined,
  },
);

export const db = drizzle(client as any, { schema });
export type DB = typeof db;
