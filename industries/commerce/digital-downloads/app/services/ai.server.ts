import http from "node:http";
import https from "node:https";

import { SITE_CONFIG } from "~/constants/site";
import { env, hasAiAssistantConfig } from "~/utils/env.server";

export type AiAssistantRole = "system" | "user" | "assistant";

export interface AiAssistantMessage {
	role: AiAssistantRole;
	content: string;
}

export interface AiAssistantChatResult {
	reply: string;
	model?: string;
	usage?: unknown;
}

export class AiAssistantConfigError extends Error {
	status: number;

	constructor(message: string, status = 500) {
		super(message);
		this.name = "AiAssistantConfigError";
		this.status = status;
	}
}

export class AiAssistantApiError extends Error {
	status: number;
	details: unknown;

	constructor(message: string, status = 500, details: unknown = null) {
		super(message);
		this.name = "AiAssistantApiError";
		this.status = status;
		this.details = details;
	}
}

function assertAiAssistantEnabled() {
	if (!SITE_CONFIG.aiAssistant?.enabled) {
		throw new AiAssistantConfigError(
			"AI assistant is not enabled for this template.",
			404,
		);
	}
}

function assertAiAssistantConfig() {
	assertAiAssistantEnabled();

	if (!hasAiAssistantConfig()) {
		throw new AiAssistantConfigError(
			"Missing D1V_PAI_BASE_URL or D1V_PAI_API_KEY environment variable.",
			500,
		);
	}
}

function getAuthHeaders(): HeadersInit {
	assertAiAssistantConfig();

	return {
		Authorization: `Bearer ${env.D1V_PAI_API_KEY}`,
		"Content-Type": "application/json",
		Accept: "application/json",
	};
}

function buildPaiUrl(path: string): string {
	const normalizedBase = env.D1V_PAI_BASE_URL.replace(/\/+$/, "");
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${normalizedBase}${normalizedPath}`;
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

async function aiAssistantRequest<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const url = new URL(buildPaiUrl(path));
	const transport = url.protocol === "http:" ? http : https;
	const baseHeaders = getAuthHeaders() as Record<string, string>;
	const headers: Record<string, string> = {
		Authorization: String(baseHeaders.Authorization ?? ""),
		"Content-Type": String(baseHeaders["Content-Type"] ?? "application/json"),
		Accept: String(baseHeaders.Accept ?? "application/json"),
	};
	const body = typeof init?.body === "string" ? init.body : undefined;

	return await new Promise<T>((resolve, reject) => {
		const request = transport.request(
			url,
			{
				method: init?.method ?? "GET",
				headers: body
					? {
							...headers,
							"Content-Length": Buffer.byteLength(body),
						}
					: headers,
				timeout: 90000,
			},
			(response) => {
				let text = "";
				response.setEncoding("utf8");
				response.on("data", (chunk) => {
					text += chunk;
				});
				response.on("end", () => {
					const payload = text
						? (() => {
								try {
									return JSON.parse(text) as unknown;
								} catch {
									return text;
								}
							})()
						: null;

					if ((response.statusCode ?? 500) >= 400) {
						const message =
							typeof payload === "object" &&
							payload !== null &&
							"error" in payload &&
							typeof (payload as { error?: unknown }).error === "string"
								? (payload as { error: string }).error
								: `AI assistant request failed with status ${response.statusCode ?? 500}`;

						reject(
							new AiAssistantApiError(
								message,
								response.statusCode ?? 500,
								payload,
							),
						);
						return;
					}

					resolve(payload as T);
				});
			},
		);

		request.on("timeout", () => {
			request.destroy(new Error("AI assistant upstream request timed out."));
		});

		request.on("error", (error) => {
			reject(
				new AiAssistantApiError(
					error instanceof Error ? error.message : "AI assistant request failed.",
					502,
				),
			);
		});

		if (body) {
			request.write(body);
		}
		request.end();
	});
}

function extractMessageText(content: unknown): string {
	if (typeof content === "string") return content.trim();

	if (Array.isArray(content)) {
		return content
			.map((part) => {
				if (
					part &&
					typeof part === "object" &&
					"type" in part &&
					(part as { type?: unknown }).type === "text" &&
					"text" in part &&
					typeof (part as { text?: unknown }).text === "string"
				) {
					return (part as { text: string }).text.trim();
				}

				return "";
			})
			.filter(Boolean)
			.join("\n")
			.trim();
	}

	return "";
}

export async function createAiAssistantReply(
	messages: AiAssistantMessage[],
): Promise<AiAssistantChatResult> {
	assertAiAssistantConfig();

	const assistant = SITE_CONFIG.aiAssistant!;
	const payload = (await aiAssistantRequest<{
		choices?: Array<{
			message?: {
				content?: string | Array<{ type?: string; text?: string }>;
			};
		}>;
		model?: string;
		usage?: unknown;
	}>("/chat/completions", {
		method: "POST",
		body: JSON.stringify({
			model: assistant.model ?? "kimi-k2.5",
			messages: [
				{
					role: "system",
					content: assistant.systemPrompt,
				},
				...messages,
			],
			stream: false,
		}),
	})) ?? { choices: [] };

	const reply = extractMessageText(payload.choices?.[0]?.message?.content);

	if (!reply) {
		throw new AiAssistantApiError(
			"D1V PAI did not return an assistant reply.",
			502,
			payload,
		);
	}

	return {
		reply,
		model: payload.model ?? assistant.model,
		usage: payload.usage,
	};
}
