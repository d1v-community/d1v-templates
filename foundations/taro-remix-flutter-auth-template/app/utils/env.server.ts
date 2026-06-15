import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  APP_URL: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: z.string().default("info"),
  RESEND_API_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(16).default("replace-with-a-long-random-string"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
}

export const env = {
  NODE_ENV: parsed.success ? parsed.data.NODE_ENV : process.env.NODE_ENV ?? "development",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  APP_URL: parsed.success ? parsed.data.APP_URL : process.env.APP_URL ?? "http://localhost:5173",
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
  RESEND_API_KEY: parsed.success ? parsed.data.RESEND_API_KEY : process.env.RESEND_API_KEY,
  JWT_SECRET: parsed.success ? parsed.data.JWT_SECRET : process.env.JWT_SECRET ?? "replace-with-a-long-random-string",
};

export const isProd = env.NODE_ENV === "production";

export function getEnvWarningMessage(): string | null {
  if (parsed.success) return null;
  const vars = Array.from(
    new Set(
      parsed.error.issues
        .map((issue) => issue.path[0])
        .filter(Boolean)
        .map((value) => String(value)),
    ),
  );
  return vars.length > 0 ? `Missing or invalid environment variables: ${vars.join(", ")}.` : "Environment variables are invalid.";
}
