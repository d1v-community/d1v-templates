import type { ActionFunctionArgs } from "@remix-run/node";
import { handlePaymentHubWebhook } from "~/services/payment-fulfillment.server";

export async function action({ request }: ActionFunctionArgs) {
	try {
		const result = await handlePaymentHubWebhook(request);
		return Response.json({ success: true, result });
	} catch (error) {
		if (error instanceof Response) {
			return error;
		}

		return Response.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : "Failed to process webhook.",
			},
			{ status: 500 },
		);
	}
}
