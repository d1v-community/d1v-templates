import { useState, type FormEvent } from "react";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";

type ChatMessage = {
	role: "user" | "assistant";
	content: string;
};

interface AiAssistantPanelProps {
	warningMessage?: string | null;
}

export function AiAssistantPanel({
	warningMessage = null,
}: AiAssistantPanelProps) {
	const assistant = SITE_CONFIG.aiAssistant;
	const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	if (!assistant?.enabled) return null;

	const disabled = Boolean(warningMessage);
	const renderedMessages: ChatMessage[] = [
		{ role: "assistant", content: assistant.welcomeMessage },
		...messages,
	];

	const handlePromptClick = (prompt: string) => {
		if (loading || disabled) return;
		setInput(prompt);
		setError("");
	};

	const handleReset = () => {
		setMessages([]);
		setInput("");
		setError("");
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const prompt = input.trim();
		if (!prompt || loading || disabled) return;

		const nextMessages: ChatMessage[] = [...messages, { role: "user", content: prompt }];

		setMessages(nextMessages);
		setInput("");
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api/ai/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: nextMessages,
				}),
			});

			const data = (await response.json()) as {
				success?: boolean;
				reply?: string;
				error?: string;
			};

			if (!response.ok || !data.success || !data.reply) {
				throw new Error(data.error || "Failed to get AI reply.");
			}

			setMessages([
				...nextMessages,
				{
					role: "assistant",
					content: data.reply,
				},
			]);
		} catch (submitError) {
			setMessages(messages);
			setInput(prompt);
			setError(
				submitError instanceof Error
					? submitError.message
					: "Failed to get AI reply.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section
			id="assistant"
			className={`py-16 ${theme.assistantSection}`}
		>
			<div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
				<div className="space-y-6">
					<div className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${theme.assistantBadge}`}>
						{assistant.badge}
					</div>
					<div>
						<h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
							{assistant.title}
						</h2>
						<p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
							{assistant.description}
						</p>
					</div>
					<div className={`rounded-3xl p-5 shadow-sm ${theme.assistantShell}`}>
						<p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
							Ask about
						</p>
						<div className="mt-4 flex flex-wrap gap-2">
							{assistant.suggestedPrompts.map((prompt) => (
								<button
									key={prompt}
									type="button"
									onClick={() => handlePromptClick(prompt)}
									disabled={loading || disabled}
									className="rounded-full border border-current/10 bg-white/70 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-current/30 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:text-slate-200 dark:hover:text-white"
								>
									{prompt}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className={`overflow-hidden rounded-[2rem] shadow-xl ${theme.assistantShell}`}>
					<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
						<div>
							<p className="text-sm font-medium text-slate-950 dark:text-white">
								{assistant.assistantName}
							</p>
							<p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
								Live AI concierge
							</p>
						</div>
						<button
							type="button"
							onClick={handleReset}
							disabled={loading}
							className="text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:text-white"
						>
							{assistant.resetLabel}
						</button>
					</div>

					<div className="space-y-4 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(241,245,249,0.82))] px-6 py-6 dark:bg-[linear-gradient(180deg,_rgba(15,23,42,0.9),_rgba(2,6,23,0.95))]">
						{warningMessage ? (
							<div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
								{warningMessage}
							</div>
						) : null}

						<div className="max-h-[28rem] space-y-4 overflow-y-auto pr-1">
							{renderedMessages.map((message, index) => {
								const isAssistant = message.role === "assistant";

								return (
									<div
										key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
										className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
									>
										<div
											className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
												isAssistant
													? "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
													: theme.assistantUserBubble
											}`}
										>
											{message.content}
										</div>
									</div>
								);
							})}

							{loading ? (
								<div className="flex justify-start">
									<div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
										Thinking...
									</div>
								</div>
							) : null}
						</div>

						{error ? (
							<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
								{error}
							</div>
						) : null}
					</div>

					<form
						onSubmit={handleSubmit}
						className="border-t border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900"
					>
						<div className="flex flex-col gap-3 sm:flex-row">
							<textarea
								value={input}
								onChange={(event) => setInput(event.target.value)}
								placeholder={assistant.placeholder}
								rows={3}
								disabled={loading || disabled}
								className={`min-h-[92px] flex-1 resize-none rounded-3xl border px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${theme.assistantInput}`}
							/>
							<button
								type="submit"
								disabled={loading || disabled || !input.trim()}
								className={`inline-flex min-w-[11rem] items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.assistantAction}`}
							>
								{loading ? "Working..." : assistant.submitLabel}
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
