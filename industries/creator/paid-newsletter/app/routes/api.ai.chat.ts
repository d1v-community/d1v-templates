import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import {
	AiAssistantApiError,
	AiAssistantConfigError,
	createAiAssistantReply,
} from "~/services/ai.server";

const messageSchema = z.object({
	role: z.enum(["user", "assistant"]),
	content: z.string().trim().min(1).max(4000),
});

const requestSchema = z.object({
	messages: z.array(messageSchema).min(1).max(12),
});

function getErrorStatus(error: unknown): number {
	if (
		error instanceof AiAssistantApiError ||
		error instanceof AiAssistantConfigError
	) {
		return error.status;
	}

	return 500;
}

export async function action({ request }: ActionFunctionArgs) {
	try {
		if (request.method !== "POST") {
			return Response.json(
				{
					success: false,
					error: "Method not allowed.",
				},
				{ status: 405 },
			);
		}

		const body = await request.json();
		const input = requestSchema.parse(body);
		const result = await createAiAssistantReply(input.messages);

		return Response.json(
			{
				success: true,
				reply: result.reply,
				model: result.model,
				usage: result.usage,
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
			error instanceof Error ? error.message : "Failed to create AI reply.";

		return Response.json(
			{
				success: false,
				error: message,
			},
			{ status: getErrorStatus(error) },
		);
	}
}
