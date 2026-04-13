import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	DATABASE_URL: z.string().url(),
	APP_URL: z.string().url().default("http://localhost:5173"),
	LOG_LEVEL: z.string().default("info"),
	RESEND_API_KEY: z.string().optional(),
	JWT_SECRET: z.string().default("your-secret-key-change-in-production"),
	PAY_BASE_URL: z.string().url().optional(),
	PAY_API_BASE_URL: z.string().url().optional(),
	PAY_API_TOKEN: z.string().optional(),
	PAY_SUCCESS_URL: z.string().url().optional(),
	PAY_CANCEL_URL: z.string().url().optional(),
	D1V_PAI_BASE_URL: z.string().url().optional(),
	D1V_PAI_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

// Do not throw here. If env vars are misconfigured we log an error and
// let route loaders decide how to surface a friendly message.
if (!parsed.success) {
	console.error(
		"Invalid environment variables:",
		parsed.error.flatten().fieldErrors,
	);
}

function normalizePayBaseUrl(value?: string | null): string {
	const normalized = (value ?? "").replace(/\/+$/, "");
	if (!normalized) return "https://pay.d1v.ai/api";
	return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

function normalizePaiBaseUrl(value?: string | null): string {
	const normalized = (value ?? "").replace(/\/+$/, "");
	if (!normalized) return "https://pai.d1v.ai/v1";
	if (normalized.endsWith("/v1")) return normalized;
	return `${normalized}/v1`;
}

export const env = {
	NODE_ENV: parsed.success
		? parsed.data.NODE_ENV
		: ((process.env.NODE_ENV as string) ?? "development"),
	DATABASE_URL: process.env.DATABASE_URL!,
	APP_URL: parsed.success
		? parsed.data.APP_URL
		: (process.env.APP_URL ?? "http://localhost:5173"),
	LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
	RESEND_API_KEY: parsed.success
		? parsed.data.RESEND_API_KEY
		: process.env.RESEND_API_KEY,
	JWT_SECRET: parsed.success
		? parsed.data.JWT_SECRET
		: (process.env.JWT_SECRET ?? "your-secret-key-change-in-production"),
	PAY_BASE_URL: normalizePayBaseUrl(
		parsed.success
			? (parsed.data.PAY_BASE_URL ?? parsed.data.PAY_API_BASE_URL)
			: (process.env.PAY_BASE_URL ?? process.env.PAY_API_BASE_URL),
	),
	PAY_API_TOKEN: parsed.success
		? parsed.data.PAY_API_TOKEN
		: process.env.PAY_API_TOKEN,
	PAY_SUCCESS_URL: parsed.success
		? parsed.data.PAY_SUCCESS_URL
		: process.env.PAY_SUCCESS_URL,
	PAY_CANCEL_URL: parsed.success
		? parsed.data.PAY_CANCEL_URL
		: process.env.PAY_CANCEL_URL,
	D1V_PAI_BASE_URL: normalizePaiBaseUrl(
		parsed.success
			? parsed.data.D1V_PAI_BASE_URL
			: process.env.D1V_PAI_BASE_URL,
	),
	D1V_PAI_API_KEY: parsed.success
		? parsed.data.D1V_PAI_API_KEY
		: process.env.D1V_PAI_API_KEY,
};

export const isProd = env.NODE_ENV === "production";

// Returns a human-readable warning for missing/invalid env vars so
// the UI can show a banner instead of crashing the function.
export function getEnvWarningMessage(): string | null {
	if (parsed.success) return null;

	const vars = parsed.error.issues
		.map((issue) => issue.path[0])
		.filter(Boolean) as string[];

	if (vars.length === 0) {
		return "Environment variables are invalid. Please verify your deployment configuration.";
	}

	const unique = Array.from(new Set(vars));

	return `⚠️ Missing or invalid environment variables: ${unique.join(
		", ",
	)}. Please configure them in your deployment platform (for example, D1V Project > Chat > Env Settings Icon -> Sync or Import).`;
}

export function hasPaymentHubConfig(): boolean {
	return Boolean(env.PAY_BASE_URL && env.PAY_API_TOKEN);
}

export function getPaymentHubConfigWarningMessage(): string | null {
	const missing: string[] = [];

	if (!(process.env.PAY_BASE_URL || process.env.PAY_API_BASE_URL)) {
		missing.push("PAY_BASE_URL");
	}
	if (!env.PAY_API_TOKEN) missing.push("PAY_API_TOKEN");

	if (missing.length === 0) return null;

	return `⚠️ Payment Hub is not fully configured. Missing environment variables: ${missing.join(", ")}.`;
}

export function getPaymentSuccessUrl(): string {
	return env.PAY_SUCCESS_URL ?? `${env.APP_URL}/pay/success`;
}

export function getPaymentCancelUrl(): string {
	return env.PAY_CANCEL_URL ?? `${env.APP_URL}/pay/cancel`;
}

export function hasAiAssistantConfig(): boolean {
	return Boolean(env.D1V_PAI_API_KEY);
}

export function getAiAssistantConfigWarningMessage(
	isAiAssistantEnabled: boolean,
): string | null {
	if (!isAiAssistantEnabled) return null;

	const missing: string[] = [];

	if (!process.env.D1V_PAI_BASE_URL) {
		missing.push("D1V_PAI_BASE_URL");
	}
	if (!env.D1V_PAI_API_KEY) {
		missing.push("D1V_PAI_API_KEY");
	}

	if (missing.length === 0) return null;

	return `⚠️ AI assistant is not fully configured. Missing environment variables: ${missing.join(", ")}.`;
}
