import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import {
	type PaymentHubApiError,
	type PaymentHubConfigError,
} from "~/services/payment.server";
import { createManagedPaymentCheckout } from "~/services/payment-fulfillment.server";
import { requireUser } from "~/utils/auth.server";
import { getPaymentCancelUrl, getPaymentSuccessUrl } from "~/utils/env.server";

const requestSchema = z.object({
	productId: z.string().min(1, "productId is required"),
	successUrl: z.string().url().optional(),
	cancelUrl: z.string().url().optional(),
	requireBuyerEmail: z.boolean().optional(),
	requireBuyerName: z.boolean().optional(),
});

function getErrorStatus(error: unknown): number {
	if (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		typeof (
			error as
				| PaymentHubApiError
				| (PaymentHubConfigError & { status?: unknown })
		).status === "number"
	) {
		return Number(
			(
				error as
					| PaymentHubApiError
					| (PaymentHubConfigError & { status: number })
			).status,
		);
	}

	return 500;
}

export async function action({ request }: ActionFunctionArgs) {
	try {
		const user = await requireUser(request);
		const body = await request.json();
		const input = requestSchema.parse(body);

		const checkout = await createManagedPaymentCheckout({
			user,
			productId: input.productId,
			successUrl: input.successUrl ?? getPaymentSuccessUrl(),
			cancelUrl: input.cancelUrl ?? getPaymentCancelUrl(),
			requireBuyerEmail: input.requireBuyerEmail ?? true,
			requireBuyerName: input.requireBuyerName ?? false,
		});
		const paymentLink = checkout.paymentLink;

		if (!paymentLink.url) {
			return Response.json(
				{
					success: false,
					error: "Payment Hub did not return a checkout url.",
				},
				{ status: 502 },
			);
		}

		return Response.json(
			{
				success: true,
				checkoutUrl: paymentLink.url,
				checkoutRequestId: checkout.checkoutRequestId,
				paymentLink,
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{
					success: false,
					error: "Invalid request body",
					details: error.flatten(),
				},
				{ status: 400 },
			);
		}

		const message =
			error instanceof Error ? error.message : "Failed to create payment link.";

		return Response.json(
			{
				success: false,
				error: message,
			},
			{ status: getErrorStatus(error) },
		);
	}
}
