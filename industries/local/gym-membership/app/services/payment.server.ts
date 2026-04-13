import {
	env,
	getPaymentCancelUrl,
	getPaymentSuccessUrl,
	hasPaymentHubConfig,
} from "~/utils/env.server";

export type PaymentHubPriceType = "one_time" | "recurring";

export interface PaymentHubProductPrice {
	id?: string;
	amount: string;
	currency: string;
	type?: PaymentHubPriceType;
	interval?: string | null;
}

export interface PaymentHubProduct {
	id: string;
	ownerUserId?: string | null;
	userId?: string | null;
	name: string;
	description?: string | null;
	active?: boolean;
	price?: PaymentHubProductPrice | null;
	prices?: PaymentHubProductPrice[];
	createdAt?: string;
	updatedAt?: string;
}

export interface PaymentHubTransaction {
	id: string;
	productId?: string | null;
	userId?: string | null;
	amount?: string | number | null;
	currency?: string | null;
	status?: string | null;
	createdAt?: string;
	[key: string]: unknown;
}

export interface PaymentHubDashboardMetrics {
	revenue?: number;
	transactions?: number;
	customers?: number;
	conversionRate?: number;
	[key: string]: unknown;
}

export interface PaymentHubRevenuePoint {
	date: string;
	amount: number;
	[key: string]: unknown;
}

export interface PaymentHubPaymentLinkMetadata {
	userId?: string;
	productId?: string;
	createdAt?: string;
	[key: string]: unknown;
}

export interface PaymentHubPaymentLinkResponse {
	url: string;
	id?: string;
	active?: boolean;
	metadata?: PaymentHubPaymentLinkMetadata;
	product?: {
		id: string;
		name: string;
		description?: string | null;
	};
	price?: {
		amount: string;
		currency: string;
		interval?: string | null;
	};
}

export interface CreatePaymentHubPaymentLinkInput {
	productId: string;
	userId: string;
	buyerEmail?: string | null;
	successUrl?: string | null;
	cancelUrl?: string | null;
	requireBuyerEmail?: boolean;
	requireBuyerName?: boolean;
}

export class PaymentHubConfigError extends Error {
	constructor(message = "Payment Hub is not configured.") {
		super(message);
		this.name = "PaymentHubConfigError";
	}
}

export class PaymentHubApiError extends Error {
	status: number;
	details: unknown;

	constructor(message: string, status = 500, details: unknown = null) {
		super(message);
		this.name = "PaymentHubApiError";
		this.status = status;
		this.details = details;
	}
}

function assertPaymentHubConfig() {
	if (!hasPaymentHubConfig()) {
		throw new PaymentHubConfigError(
			"Missing PAY_BASE_URL or PAY_API_TOKEN environment variable.",
		);
	}
}

function getAuthHeaders(): HeadersInit {
	assertPaymentHubConfig();

	return {
		Authorization: `Bearer ${env.PAY_API_TOKEN}`,
		"Content-Type": "application/json",
		Accept: "application/json",
	};
}

function buildPaymentHubUrl(path: string, query?: URLSearchParams): string {
	const normalizedBase = env.PAY_BASE_URL.replace(/\/+$/, "");
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	const url = new URL(`${normalizedBase}${normalizedPath}`);

	if (query) {
		url.search = query.toString();
	}

	return url.toString();
}

async function parseJsonSafely(response: Response): Promise<unknown> {
	const text = await response.text();

	if (!text) return null;

	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

async function paymentHubRequest<T>(
	path: string,
	init?: RequestInit,
	query?: URLSearchParams,
): Promise<T> {
	const response = await fetch(buildPaymentHubUrl(path, query), {
		...init,
		headers: {
			...getAuthHeaders(),
			...(init?.headers ?? {}),
		},
	});

	const payload = await parseJsonSafely(response);

	if (!response.ok) {
		const message =
			typeof payload === "object" &&
			payload !== null &&
			"error" in payload &&
			typeof (payload as { error?: unknown }).error === "string"
				? (payload as { error: string }).error
				: `Payment Hub request failed with status ${response.status}`;

		throw new PaymentHubApiError(message, response.status, payload);
	}

	return payload as T;
}

function normalizeProduct(raw: unknown): PaymentHubProduct {
	const item = (raw ?? {}) as Record<string, unknown>;
	const embeddedPrice =
		item.price && typeof item.price === "object"
			? (item.price as Record<string, unknown>)
			: null;

	return {
		id: String(item.id ?? ""),
		ownerUserId:
			typeof item.ownerUserId === "string"
				? item.ownerUserId
				: typeof item.owner_user_id === "string"
					? item.owner_user_id
					: null,
		userId:
			typeof item.userId === "string"
				? item.userId
				: typeof item.user_id === "string"
					? item.user_id
					: null,
		name: String(item.name ?? ""),
		description: typeof item.description === "string" ? item.description : null,
		active: typeof item.active === "boolean" ? item.active : undefined,
		price: embeddedPrice
			? {
					id:
						typeof embeddedPrice.id === "string" ? embeddedPrice.id : undefined,
					amount: String(embeddedPrice.amount ?? ""),
					currency: String(embeddedPrice.currency ?? ""),
					type:
						embeddedPrice.type === "one_time" ||
						embeddedPrice.type === "recurring"
							? embeddedPrice.type
							: undefined,
					interval:
						typeof embeddedPrice.interval === "string"
							? embeddedPrice.interval
							: null,
				}
			: null,
		prices: Array.isArray(item.prices)
			? item.prices
					.filter(
						(price): price is Record<string, unknown> =>
							!!price && typeof price === "object",
					)
					.map((price) => ({
						id: typeof price.id === "string" ? price.id : undefined,
						amount: String(price.amount ?? ""),
						currency: String(price.currency ?? ""),
						type:
							price.type === "one_time" || price.type === "recurring"
								? price.type
								: undefined,
						interval:
							typeof price.interval === "string" ? price.interval : null,
					}))
			: undefined,
		createdAt:
			typeof item.createdAt === "string"
				? item.createdAt
				: typeof item.created_at === "string"
					? item.created_at
					: undefined,
		updatedAt:
			typeof item.updatedAt === "string"
				? item.updatedAt
				: typeof item.updated_at === "string"
					? item.updated_at
					: undefined,
	};
}

function normalizeProductsResponse(payload: unknown): PaymentHubProduct[] {
	if (Array.isArray(payload)) {
		return payload.map(normalizeProduct);
	}

	if (payload && typeof payload === "object") {
		const record = payload as Record<string, unknown>;

		if (Array.isArray(record.products)) {
			return record.products.map(normalizeProduct);
		}

		if (Array.isArray(record.data)) {
			return record.data.map(normalizeProduct);
		}
	}

	return [];
}

export async function listPaymentHubProducts(): Promise<PaymentHubProduct[]> {
	const payload = await paymentHubRequest<unknown>("/products", {
		method: "GET",
	});

	return normalizeProductsResponse(payload);
}

export async function listPaymentHubTransactions(): Promise<
	PaymentHubTransaction[]
> {
	const payload = await paymentHubRequest<unknown>("/transactions", {
		method: "GET",
	});

	if (Array.isArray(payload)) {
		return payload as PaymentHubTransaction[];
	}

	if (payload && typeof payload === "object") {
		const record = payload as Record<string, unknown>;

		if (Array.isArray(record.transactions)) {
			return record.transactions as PaymentHubTransaction[];
		}

		if (Array.isArray(record.data)) {
			return record.data as PaymentHubTransaction[];
		}
	}

	return [];
}

export async function getPaymentHubDashboardMetrics(): Promise<PaymentHubDashboardMetrics> {
	return paymentHubRequest<PaymentHubDashboardMetrics>("/dashboard/metrics", {
		method: "GET",
	});
}

export async function getPaymentHubRevenue(
	days = 7,
): Promise<PaymentHubRevenuePoint[]> {
	const query = new URLSearchParams({
		days: String(days),
	});

	const payload = await paymentHubRequest<unknown>(
		"/revenue",
		{ method: "GET" },
		query,
	);

	if (Array.isArray(payload)) {
		return payload as PaymentHubRevenuePoint[];
	}

	if (payload && typeof payload === "object") {
		const record = payload as Record<string, unknown>;

		if (Array.isArray(record.data)) {
			return record.data as PaymentHubRevenuePoint[];
		}

		if (Array.isArray(record.revenue)) {
			return record.revenue as PaymentHubRevenuePoint[];
		}
	}

	return [];
}

export async function createPaymentHubPaymentLink(
	input: CreatePaymentHubPaymentLinkInput,
): Promise<PaymentHubPaymentLinkResponse> {
	const body = {
		productId: input.productId,
		userId: input.userId,
		customFields: {
			buyerEmail: input.requireBuyerEmail ?? Boolean(input.buyerEmail),
			buyerName: input.requireBuyerName ?? false,
		},
		successUrl: input.successUrl ?? getPaymentSuccessUrl(),
		cancelUrl: input.cancelUrl ?? getPaymentCancelUrl(),
	};

	return paymentHubRequest<PaymentHubPaymentLinkResponse>(
		"/create-payment-link",
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
}

export async function getProductQuickPaymentLink(params: {
	productId: string;
	userId: string;
	email?: string | null;
	successUrl?: string | null;
	cancelUrl?: string | null;
}): Promise<PaymentHubPaymentLinkResponse> {
	const query = new URLSearchParams({
		userId: params.userId,
	});

	if (params.email) {
		query.set("email", params.email);
	}

	if (params.successUrl) {
		query.set("successUrl", params.successUrl);
	}

	if (params.cancelUrl) {
		query.set("cancelUrl", params.cancelUrl);
	}

	return paymentHubRequest<PaymentHubPaymentLinkResponse>(
		`/products/${encodeURIComponent(params.productId)}/payment-link`,
		{ method: "GET" },
		query,
	);
}

export function toPaymentHubUserId(userId: string): string {
	const trimmed = userId.trim();

	if (trimmed.length >= 13) return trimmed;

	return `user_${trimmed.padEnd(13, "0")}`;
}
