import { useEffect, useRef, useState, type FormEvent } from "react";
import { SITE_CONFIG } from "~/constants/site";

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const disabled = Boolean(warningMessage);
  const renderedMessages: ChatMessage[] = [
    { role: "assistant", content: assistant?.welcomeMessage ?? "" },
    ...messages,
  ];

  useEffect(() => {
    if (!assistant?.enabled) return;

    threadEndRef.current?.scrollIntoView({
      behavior: renderedMessages.length > 1 || loading ? "smooth" : "auto",
      block: "end",
    });
  }, [assistant?.enabled, loading, renderedMessages.length]);

  if (!assistant?.enabled) return null;

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
      className="border-t border-slate-200 bg-white py-16 text-slate-950 dark:border-white/10 dark:bg-[#08111f] dark:text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b79d71] dark:border-white/14 dark:bg-white/5">
            {assistant.badge}
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {assistant.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
              {assistant.description}
            </p>
          </div>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_18px_50px_rgba(2,6,23,0.22)]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Recommended prompts
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {assistant.suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  disabled={loading || disabled}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/14 dark:bg-black/20 dark:text-slate-200 dark:hover:border-white/24 dark:hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#b79d71]/30 bg-[linear-gradient(180deg,rgba(183,157,113,0.18),rgba(183,157,113,0.06))] p-5 dark:border-[#b79d71]/30 dark:bg-[linear-gradient(180deg,rgba(183,157,113,0.18),rgba(183,157,113,0.06))]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#917953] dark:text-[#d2be97]">
              Desk standard
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
              The desk should resolve routine questions fast, explain status clearly, and escalate only what truly needs human ownership.
            </p>
          </article>
        </div>

        <div className="flex min-h-[70svh] flex-col overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,40,0.96),rgba(9,14,28,0.96))] dark:shadow-[0_28px_90px_rgba(2,6,23,0.34)] sm:min-h-[76svh] lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:min-h-[42rem]">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">{assistant.assistantName}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Account desk online
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

          <div className="flex min-h-0 flex-1 flex-col gap-4 bg-slate-50/50 px-6 py-6 dark:bg-[linear-gradient(180deg,rgba(12,19,34,0.96),rgba(6,10,20,0.96))]">
            {warningMessage ? (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-200">
                {warningMessage}
              </div>
            ) : null}

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 pb-2">
              {renderedMessages.map((message, index) => {
                const isAssistant = message.role === "assistant";

                return (
                  <div
                    key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
                    className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-[1.6rem] px-4 py-3 text-sm leading-7 ${
                        isAssistant
                          ? "border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                          : "bg-[#b79d71] text-[#0f1728]"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}

              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    Reviewing the account context...
                  </div>
                </div>
              ) : null}
              <div ref={threadEndRef} aria-hidden="true" />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-auto border-t border-slate-200 bg-white/95 px-6 py-5 supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur dark:border-white/10 dark:bg-[rgba(9,17,31,0.96)] dark:supports-[backdrop-filter]:bg-[rgba(9,17,31,0.88)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={assistant.placeholder}
                rows={3}
                disabled={loading || disabled}
                className="min-h-[92px] flex-1 resize-none rounded-[1.6rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-[#b79d71] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/12 dark:bg-white/5 dark:text-white dark:focus:bg-white/8"
              />
              <button
                type="submit"
                disabled={loading || disabled || !input.trim()}
                className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-[#b79d71] px-5 py-3 text-sm font-medium text-[#0f1728] transition hover:bg-[#c9b389] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Coordinating..." : assistant.submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
