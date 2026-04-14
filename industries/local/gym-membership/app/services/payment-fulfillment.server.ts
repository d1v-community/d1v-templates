import crypto from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { APP_TITLE } from "~/constants/app";
import { db } from "~/db/db.server";
import {
	paymentCheckoutRequests,
	paymentEntitlements,
	paymentFulfillments,
	paymentWebhookEvents,
	users,
	type PaymentCheckoutRequest,
	type PaymentEntitlement,
	type User,
} from "~/db/schema";
import {
	createPaymentHubPaymentLink,
	createPaymentHubWebhook,
	listPaymentHubTransactions,
	listPaymentHubWebhooks,
	toPaymentHubUserId,
	updatePaymentHubWebhook,
	type CreatePaymentHubPaymentLinkInput,
	type PaymentHubPaymentLinkResponse,
} from "~/services/payment.server";
import {
	getPaymentCancelUrl,
	getPaymentSuccessUrl,
	getPaymentWebhookUrl,
	isPublicAppUrl,
} from "~/utils/env.server";
import { fulfillTemplateEntitlement } from "~/services/template-fulfillment.server";

export type NormalizedPaymentTransaction = {
	id: string;
	userId: string | null;
	productId: string | null;
	priceId: string | null;
	productName: string | null;
	amount: string | null;
	currency: string | null;
	status: string | null;
	customerEmail: string | null;
	customerName: string | null;
	createdAt: string | null;
	raw: Record<string, unknown>;
};

export type PaymentFulfillmentContext = {
	user: User;
	transaction: NormalizedPaymentTransaction;
	entitlement: PaymentEntitlement;
	checkoutRequestId: string | null;
	source: "webhook" | "success_page";
};

export type TemplateFulfillmentResult = {
	businessEntity: string;
	businessRecordId: string;
	accessLabel: string;
	summary: string;
};

export type PaymentFulfillmentResult = {
	status: "fulfilled" | "duplicate" | "ignored" | "pending";
	reason?: string;
	checkoutRequestId?: string | null;
	transactionId?: string | null;
	entitlementId?: string | null;
	businessEntity?: string | null;
	businessRecordId?: string | null;
	accessLabel?: string | null;
	summary?: string | null;
};

const DESIRED_WEBHOOK_EVENTS = [
	"payment.succeeded",
	"payment.failed",
	"refund.created",
] as const;

function normalizeUrl(value: string): string {
	return value.replace(/\/+$/, "");
}

function normalizeEmail(value: string | null | undefined): string | null {
	return typeof value === "string" && value.trim()
		? value.trim().toLowerCase()
		: null;
}

function buildStableId(prefix: string, ...parts: Array<string | null | undefined>): string {
	const raw = parts
		.map((value) => (typeof value === "string" ? value.trim() : ""))
		.filter(Boolean)
		.join(":");
	const digest = crypto.createHash("sha256").update(raw || prefix).digest("hex");
	return `${prefix}_${digest.slice(0, 24)}`;
}

function appendCheckoutContext(
	targetUrl: string,
	context: Record<string, string>,
): string {
	const url = new URL(targetUrl);

	for (const [key, value] of Object.entries(context)) {
		url.searchParams.set(key, value);
	}

	return url.toString();
}

function timingSafeEquals(left: string, right: string): boolean {
	const leftBuffer = Buffer.from(left);
	const rightBuffer = Buffer.from(right);

	if (leftBuffer.length !== rightBuffer.length) {
		return false;
	}

	return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function isSuccessfulTransactionStatus(status: string | null | undefined): boolean {
	return new Set(["succeeded", "paid", "completed", "active"]).has(
		String(status ?? "").toLowerCase(),
	);
}

function normalizePaymentTransaction(
	payload: Record<string, unknown>,
): NormalizedPaymentTransaction {
	const product =
		payload.product && typeof payload.product === "object"
			? (payload.product as Record<string, unknown>)
			: null;
	const price =
		payload.price && typeof payload.price === "object"
			? (payload.price as Record<string, unknown>)
			: null;

	return {
		id: String(
			payload.id ??
				payload.transactionId ??
				payload.paymentIntentId ??
				payload.stripePaymentIntentId ??
				"",
		),
		userId:
			typeof payload.userId === "string"
				? payload.userId
				: typeof payload.user_id === "string"
					? payload.user_id
					: typeof payload.externalUserId === "string"
						? payload.externalUserId
						: null,
		productId:
			typeof payload.productId === "string"
				? payload.productId
				: typeof payload.product_id === "string"
					? payload.product_id
					: typeof product?.id === "string"
						? product.id
						: null,
		priceId:
			typeof payload.priceId === "string"
				? payload.priceId
				: typeof payload.price_id === "string"
					? payload.price_id
					: typeof price?.id === "string"
						? price.id
						: null,
		productName:
			typeof payload.productName === "string"
				? payload.productName
				: typeof product?.name === "string"
					? product.name
					: null,
		amount:
			typeof payload.amount === "number" || typeof payload.amount === "string"
				? String(payload.amount)
				: typeof price?.amount === "number" || typeof price?.amount === "string"
					? String(price.amount)
					: null,
		currency:
			typeof payload.currency === "string"
				? payload.currency
				: typeof price?.currency === "string"
					? price.currency
					: null,
		status: typeof payload.status === "string" ? payload.status : null,
		customerEmail:
			typeof payload.customerEmail === "string"
				? payload.customerEmail
				: typeof payload.customer_email === "string"
					? payload.customer_email
					: null,
		customerName:
			typeof payload.customerName === "string"
				? payload.customerName
				: typeof payload.customer_name === "string"
					? payload.customer_name
					: null,
		createdAt:
			typeof payload.createdAt === "string"
				? payload.createdAt
				: typeof payload.created_at === "string"
					? payload.created_at
					: null,
		raw: payload,
	};
}

function compareEventSets(left: string[], right: readonly string[]): boolean {
	return [...left].sort().join("|") === [...right].sort().join("|");
}

async function updateCheckoutRequest(
	checkoutRequestId: string,
	values: Partial<PaymentCheckoutRequest>,
): Promise<void> {
	await db
		.update(paymentCheckoutRequests)
		.set({
			...values,
			updatedAt: new Date(),
		})
		.where(eq(paymentCheckoutRequests.id, checkoutRequestId));
}

async function markLatestMatchingCheckoutRequest(params: {
	externalBuyerUserId: string | null;
	productId: string | null;
	transactionId: string;
	checkoutStatus: string;
}): Promise<PaymentCheckoutRequest | null> {
	if (!params.externalBuyerUserId && !params.productId) {
		return null;
	}

	const clauses = [];

	if (params.externalBuyerUserId) {
		clauses.push(
			eq(
				paymentCheckoutRequests.externalBuyerUserId,
				params.externalBuyerUserId,
			),
		);
	}

	if (params.productId) {
		clauses.push(eq(paymentCheckoutRequests.productId, params.productId));
	}

	if (clauses.length === 0) {
		return null;
	}

	const request = await db
		.select()
		.from(paymentCheckoutRequests)
		.where(and(...clauses))
		.orderBy(desc(paymentCheckoutRequests.updatedAt))
		.limit(1);

	if (!request[0]) {
		return null;
	}

	await updateCheckoutRequest(request[0].id, {
		checkoutStatus: params.checkoutStatus,
		lastTransactionId: params.transactionId,
	});

	return request[0];
}

async function getWebhookSecretForCurrentApp(): Promise<string | null> {
	const webhookUrl = normalizeUrl(getPaymentWebhookUrl());
	const webhooks = await listPaymentHubWebhooks();
	const webhook = webhooks.find(
		(entry) => normalizeUrl(entry.url) === webhookUrl && entry.secret,
	);

	return webhook?.secret ?? null;
}

export async function ensurePaymentHubWebhookRegistration(): Promise<void> {
	if (!isPublicAppUrl()) {
		return;
	}

	const webhookUrl = getPaymentWebhookUrl();
	const webhooks = await listPaymentHubWebhooks();
	const existing = webhooks.find(
		(entry) => normalizeUrl(entry.url) === normalizeUrl(webhookUrl),
	);

	if (!existing) {
		await createPaymentHubWebhook({
			name: `${APP_TITLE} payment webhook`,
			url: webhookUrl,
			events: [...DESIRED_WEBHOOK_EVENTS],
			isActive: true,
		});
		return;
	}

	if (
		existing.isActive === false ||
		!compareEventSets(existing.events, DESIRED_WEBHOOK_EVENTS)
	) {
		await updatePaymentHubWebhook(existing.id, {
			url: webhookUrl,
			events: [...DESIRED_WEBHOOK_EVENTS],
			isActive: true,
		});
	}
}

export async function createManagedPaymentCheckout(input: {
	user: User;
	productId: string;
	successUrl?: string | null;
	cancelUrl?: string | null;
	requireBuyerEmail?: boolean;
	requireBuyerName?: boolean;
}): Promise<{
	checkoutRequestId: string;
	externalBuyerUserId: string;
	paymentLink: PaymentHubPaymentLinkResponse;
}> {
	const checkoutRequestId = crypto.randomUUID();
	const externalBuyerUserId = toPaymentHubUserId(input.user.id);
	const successUrl = appendCheckoutContext(
		input.successUrl ?? getPaymentSuccessUrl(),
		{
			checkout_request_id: checkoutRequestId,
			product_id: input.productId,
		},
	);
	const cancelUrl = appendCheckoutContext(
		input.cancelUrl ?? getPaymentCancelUrl(),
		{
			checkout_request_id: checkoutRequestId,
			product_id: input.productId,
		},
	);

	await ensurePaymentHubWebhookRegistration();

	await db.insert(paymentCheckoutRequests).values({
		id: checkoutRequestId,
		appUserId: input.user.id,
		externalBuyerUserId,
		productId: input.productId,
		checkoutStatus: "pending",
		successUrl,
		cancelUrl,
	});

	try {
		const paymentLink = await createPaymentHubPaymentLink({
			productId: input.productId,
			userId: externalBuyerUserId,
			buyerEmail: input.user.email ?? undefined,
			successUrl,
			cancelUrl,
			requireBuyerEmail: input.requireBuyerEmail ?? true,
			requireBuyerName: input.requireBuyerName ?? false,
		} satisfies CreatePaymentHubPaymentLinkInput);

		await updateCheckoutRequest(checkoutRequestId, {
			checkoutStatus: paymentLink.url ? "link_created" : "link_missing",
			paymentLinkUrl: paymentLink.url ?? null,
		});

		return {
			checkoutRequestId,
			externalBuyerUserId,
			paymentLink,
		};
	} catch (error) {
		await updateCheckoutRequest(checkoutRequestId, {
			checkoutStatus: "link_failed",
			lastError: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}

async function findLocalUserForTransaction(
	transaction: NormalizedPaymentTransaction,
): Promise<{ user: User; checkoutRequestId: string | null } | null> {
	if (transaction.userId) {
		const request = await db
			.select()
			.from(paymentCheckoutRequests)
			.where(eq(paymentCheckoutRequests.externalBuyerUserId, transaction.userId))
			.orderBy(desc(paymentCheckoutRequests.updatedAt))
			.limit(1);

		if (request[0]) {
			const user = await db
				.select()
				.from(users)
				.where(eq(users.id, request[0].appUserId))
				.limit(1);

			if (user[0]) {
				return { user: user[0], checkoutRequestId: request[0].id };
			}
		}
	}

	const email = normalizeEmail(transaction.customerEmail);
	if (!email) {
		return null;
	}

	const matchedUsers = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (!matchedUsers[0]) {
		return null;
	}

	return { user: matchedUsers[0], checkoutRequestId: null };
}

async function upsertEntitlement(params: {
	user: User;
	transaction: NormalizedPaymentTransaction;
	source: "webhook" | "success_page";
	accessLabel: string;
}): Promise<PaymentEntitlement> {
	const productId = params.transaction.productId ?? "unknown_product";
	const entitlementId = buildStableId("pay_entitlement", params.user.id, productId);

	const rows = await db
		.select()
		.from(paymentEntitlements)
		.where(eq(paymentEntitlements.id, entitlementId))
		.limit(1);

	if (rows[0]) {
		await db
			.update(paymentEntitlements)
			.set({
				entitlementStatus: "active",
				accessLabel: params.accessLabel,
				source: params.source,
				lastTransactionId: params.transaction.id,
				updatedAt: new Date(),
			})
			.where(eq(paymentEntitlements.id, entitlementId));
	} else {
		await db.insert(paymentEntitlements).values({
			id: entitlementId,
			appUserId: params.user.id,
			productId,
			entitlementStatus: "active",
			accessLabel: params.accessLabel,
			source: params.source,
			lastTransactionId: params.transaction.id,
		});
	}

	const entitlement = await db
		.select()
		.from(paymentEntitlements)
		.where(eq(paymentEntitlements.id, entitlementId))
		.limit(1);

	return entitlement[0];
}

async function recordWebhookEvent(params: {
	eventId: string;
	eventType: string;
	transactionId: string | null;
	signature: string | null;
	payloadJson: string;
	processingStatus: string;
	errorMessage?: string | null;
}): Promise<void> {
	const existing = await db
		.select()
		.from(paymentWebhookEvents)
		.where(eq(paymentWebhookEvents.id, params.eventId))
		.limit(1);

	if (existing[0]) {
		await db
			.update(paymentWebhookEvents)
			.set({
				eventType: params.eventType,
				transactionId: params.transactionId,
				signature: params.signature,
				payloadJson: params.payloadJson,
				processingStatus: params.processingStatus,
				errorMessage: params.errorMessage ?? null,
				updatedAt: new Date(),
			})
			.where(eq(paymentWebhookEvents.id, params.eventId));
		return;
	}

	await db.insert(paymentWebhookEvents).values({
		id: params.eventId,
		eventType: params.eventType,
		transactionId: params.transactionId,
		signature: params.signature,
		payloadJson: params.payloadJson,
		processingStatus: params.processingStatus,
		errorMessage: params.errorMessage ?? null,
	});
}

async function recordFulfillment(params: {
	user: User;
	transaction: NormalizedPaymentTransaction;
	source: "webhook" | "success_page";
	businessEntity: string;
	businessRecordId: string;
	summary: string;
}): Promise<void> {
	const fulfillmentId = buildStableId(
		"pay_fulfillment",
		params.transaction.id,
		params.businessEntity,
	);
	const existing = await db
		.select()
		.from(paymentFulfillments)
		.where(eq(paymentFulfillments.id, fulfillmentId))
		.limit(1);

	if (existing[0]) {
		await db
			.update(paymentFulfillments)
			.set({
				productId: params.transaction.productId ?? "unknown_product",
				transactionId: params.transaction.id,
				businessEntity: params.businessEntity,
				businessRecordId: params.businessRecordId,
				fulfillmentStatus: "fulfilled",
				fulfillmentSource: params.source,
				summaryLabel: params.summary,
				updatedAt: new Date(),
			})
			.where(eq(paymentFulfillments.id, fulfillmentId));
		return;
	}

	await db.insert(paymentFulfillments).values({
		id: fulfillmentId,
		appUserId: params.user.id,
		productId: params.transaction.productId ?? "unknown_product",
		transactionId: params.transaction.id,
		businessEntity: params.businessEntity,
		businessRecordId: params.businessRecordId,
		fulfillmentStatus: "fulfilled",
		fulfillmentSource: params.source,
		summaryLabel: params.summary,
	});
}

async function fulfillSucceededTransaction(params: {
	transaction: NormalizedPaymentTransaction;
	source: "webhook" | "success_page";
}): Promise<PaymentFulfillmentResult> {
	if (!params.transaction.id || !params.transaction.productId) {
		return {
			status: "ignored",
			reason: "Missing transaction id or product id.",
		};
	}

	const resolved = await findLocalUserForTransaction(params.transaction);
	if (!resolved) {
		return {
			status: "pending",
			reason: "Could not map the payment back to a local user yet.",
			transactionId: params.transaction.id,
		};
	}

	const duplicate = await db
		.select()
		.from(paymentFulfillments)
		.where(eq(paymentFulfillments.transactionId, params.transaction.id))
		.limit(1);

	if (duplicate[0]) {
		return {
			status: "duplicate",
			checkoutRequestId: resolved.checkoutRequestId,
			transactionId: params.transaction.id,
			entitlementId: buildStableId(
				"pay_entitlement",
				resolved.user.id,
				params.transaction.productId,
			),
			businessEntity: duplicate[0].businessEntity,
			businessRecordId: duplicate[0].businessRecordId,
			accessLabel: duplicate[0].summaryLabel,
			summary: duplicate[0].summaryLabel,
		};
	}

	const provisionalEntitlement: PaymentEntitlement = {
		id: buildStableId(
			"pay_entitlement",
			resolved.user.id,
			params.transaction.productId,
		),
		appUserId: resolved.user.id,
		productId: params.transaction.productId,
		entitlementStatus: "active",
		accessLabel: "Paid access granted",
		source: params.source,
		lastTransactionId: params.transaction.id,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const templateResult = await fulfillTemplateEntitlement({
		user: resolved.user,
		transaction: params.transaction,
		entitlement: provisionalEntitlement,
		checkoutRequestId: resolved.checkoutRequestId,
		source: params.source,
	});

	const entitlement = await upsertEntitlement({
		user: resolved.user,
		transaction: params.transaction,
		source: params.source,
		accessLabel: templateResult.accessLabel,
	});

	await recordFulfillment({
		user: resolved.user,
		transaction: params.transaction,
		source: params.source,
		businessEntity: templateResult.businessEntity,
		businessRecordId: templateResult.businessRecordId,
		summary: templateResult.summary,
	});

	await markLatestMatchingCheckoutRequest({
		externalBuyerUserId: params.transaction.userId,
		productId: params.transaction.productId,
		transactionId: params.transaction.id,
		checkoutStatus: "fulfilled",
	});

	return {
		status: "fulfilled",
		checkoutRequestId: resolved.checkoutRequestId,
		transactionId: params.transaction.id,
		entitlementId: entitlement.id,
		businessEntity: templateResult.businessEntity,
		businessRecordId: templateResult.businessRecordId,
		accessLabel: templateResult.accessLabel,
		summary: templateResult.summary,
	};
}

export async function handlePaymentHubWebhook(
	request: Request,
): Promise<PaymentFulfillmentResult> {
	const signature = request.headers.get("x-payment-hub-signature");
	const rawBody = await request.text();
	const secret = await getWebhookSecretForCurrentApp();

	if (!signature || !secret) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const expectedSignature = crypto
		.createHmac("sha256", secret)
		.update(rawBody)
		.digest("hex");

	if (!timingSafeEquals(signature, expectedSignature)) {
		throw new Response("Unauthorized", { status: 401 });
	}

	const payload = JSON.parse(rawBody) as Record<string, unknown>;
	const eventType =
		typeof payload.type === "string"
			? payload.type
			: typeof payload.eventType === "string"
				? payload.eventType
				: "unknown";
	const rawData =
		payload.data && typeof payload.data === "object"
			? (payload.data as Record<string, unknown>)
			: payload;
	const transaction = normalizePaymentTransaction(rawData);
	const eventId =
		typeof payload.id === "string"
			? payload.id
			: buildStableId("pay_event", eventType, transaction.id, rawBody);

	const existingEvent = await db
		.select()
		.from(paymentWebhookEvents)
		.where(eq(paymentWebhookEvents.id, eventId))
		.limit(1);

	if (existingEvent[0]?.processingStatus === "fulfilled") {
		return {
			status: "duplicate",
			transactionId: transaction.id,
		};
	}

	await recordWebhookEvent({
		eventId,
		eventType,
		transactionId: transaction.id || null,
		signature,
		payloadJson: rawBody,
		processingStatus: "received",
	});

	if (eventType !== "payment.succeeded") {
		await recordWebhookEvent({
			eventId,
			eventType,
			transactionId: transaction.id || null,
			signature,
			payloadJson: rawBody,
			processingStatus: "ignored",
		});
		return {
			status: "ignored",
			reason: `Unhandled event type ${eventType}.`,
			transactionId: transaction.id || null,
		};
	}

	try {
		const result = await fulfillSucceededTransaction({
			transaction,
			source: "webhook",
		});

		await recordWebhookEvent({
			eventId,
			eventType,
			transactionId: transaction.id || null,
			signature,
			payloadJson: rawBody,
			processingStatus:
				result.status === "fulfilled" ? "fulfilled" : result.status,
			errorMessage: result.reason ?? null,
		});

		return result;
	} catch (error) {
		await recordWebhookEvent({
			eventId,
			eventType,
			transactionId: transaction.id || null,
			signature,
			payloadJson: rawBody,
			processingStatus: "failed",
			errorMessage: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}

async function readLocalFulfillmentForRequest(
	checkoutRequest: PaymentCheckoutRequest | null,
): Promise<PaymentFulfillmentResult | null> {
	if (!checkoutRequest?.lastTransactionId) {
		return null;
	}

	const fulfillment = await db
		.select()
		.from(paymentFulfillments)
		.where(eq(paymentFulfillments.transactionId, checkoutRequest.lastTransactionId))
		.limit(1);

	if (!fulfillment[0]) {
		return null;
	}

	const entitlement = await db
		.select()
		.from(paymentEntitlements)
		.where(
			eq(
				paymentEntitlements.id,
				buildStableId(
					"pay_entitlement",
					checkoutRequest.appUserId,
					checkoutRequest.productId,
				),
			),
		)
		.limit(1);

	return {
		status: "fulfilled",
		checkoutRequestId: checkoutRequest.id,
		transactionId: fulfillment[0].transactionId,
		entitlementId: entitlement[0]?.id ?? null,
		businessEntity: fulfillment[0].businessEntity,
		businessRecordId: fulfillment[0].businessRecordId,
		accessLabel: entitlement[0]?.accessLabel ?? null,
		summary: fulfillment[0].summaryLabel,
	};
}

export async function reconcilePaymentSuccess(input: {
	request: Request;
	user: User | null;
}): Promise<PaymentFulfillmentResult> {
	const url = new URL(input.request.url);
	const checkoutRequestId = url.searchParams.get("checkout_request_id");
	const requestedProductId =
		url.searchParams.get("product_id") ?? url.searchParams.get("productId");
	const checkoutRequest = checkoutRequestId
		? (
				await db
					.select()
					.from(paymentCheckoutRequests)
					.where(eq(paymentCheckoutRequests.id, checkoutRequestId))
					.limit(1)
		  )[0] ?? null
		: null;

	const localResult = await readLocalFulfillmentForRequest(checkoutRequest);
	if (localResult) {
		return localResult;
	}

	if (!input.user && !checkoutRequest) {
		return {
			status: "pending",
			reason: "Missing local checkout context for reconciliation.",
		};
	}

	const externalBuyerUserId = checkoutRequest?.externalBuyerUserId ??
		(input.user ? toPaymentHubUserId(input.user.id) : null);
	const email = normalizeEmail(input.user?.email ?? null);
	const transactions = await listPaymentHubTransactions({ status: "succeeded" });

	for (const candidate of transactions) {
		const transaction = normalizePaymentTransaction(
			candidate as Record<string, unknown>,
		);

		if (!isSuccessfulTransactionStatus(transaction.status)) {
			continue;
		}
		if (requestedProductId && transaction.productId !== requestedProductId) {
			continue;
		}
		if (
			externalBuyerUserId &&
			transaction.userId &&
			transaction.userId !== externalBuyerUserId
		) {
			continue;
		}
		if (
			email &&
			transaction.customerEmail &&
			normalizeEmail(transaction.customerEmail) !== email
		) {
			continue;
		}

		return fulfillSucceededTransaction({
			transaction,
			source: "success_page",
		});
	}

	return {
		status: "pending",
		checkoutRequestId,
		reason: "Waiting for the payment transaction to be reconciled.",
	};
}
