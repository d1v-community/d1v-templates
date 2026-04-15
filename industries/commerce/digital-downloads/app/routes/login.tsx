import { useEffect, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { ThemeToggleButton } from "~/components/ThemeToggleButton";
import { ClientOnly } from "~/components/ClientOnly";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { getUserFromRequest } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (user) {
    return redirect("/");
  }
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const loginConfig = SITE_CONFIG.login;
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [info, setInfo] = useState("");
  const loginSignals = [
    { label: "Audience", value: loginConfig.audience },
    { label: "Surface", value: SITE_CONFIG.templateSurface.badge },
  ];
  const loginMetrics = SITE_CONFIG.heroMetrics.slice(0, 3);

  // Client-side guard: if token exists and is valid, redirect
  useEffect(() => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return;
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((d) => {
          if (d?.authenticated) {
            navigate("/", { replace: true });
          }
        })
        .catch(() => {
          // noop: 静默处理网络错误
        });
    } catch {
      // noop: 静默处理初始化错误
    }
  }, [navigate]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to send code");
      }

      // Show development code or success info
      if (data.dev && data.code) {
        setDevCode(String(data.code));
        setInfo("Development mode: your verification code is shown below.");
      } else {
        setDevCode(null);
        setInfo("Verification code sent. Please check your email.");
      }

      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Invalid code");
      }

      localStorage.setItem("auth-token", data.token);

      // Attempt to request Storage Access for third-party iframes (Safari/Chrome SAA)
      try {
        if (typeof document.hasStorageAccess === "function") {
          const hasAccess = await document.hasStorageAccess();
          if (!hasAccess && typeof document.requestStorageAccess === "function") {
            await document.requestStorageAccess();
          }
        }
      } catch {
        // ignore SAA failures
      }

      // Sync server cookie from Authorization if cookies were previously blocked
      try {
        await fetch("/api/auth/sync-cookie", { method: "POST" });
      } catch {
        // noop: 静默处理同步 cookie 失败
      }

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setCode("");
    setError("");
    setInfo("");
    setDevCode(null);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate("/");
  };

  return (
    <ClientOnly>
      <div className={`relative min-h-screen overflow-hidden ${theme.heroShell}`}>
        <div className={`absolute inset-0 ${theme.heroGlow}`} />
        <div className="absolute inset-x-0 top-0 h-32 bg-white/10 blur-3xl dark:bg-transparent" />

        <ThemeToggleButton className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6" />
        <button
          onClick={handleBack}
          className={`absolute left-4 top-4 z-20 inline-flex items-center gap-2 text-sm font-medium transition ${theme.navLink} sm:left-6 sm:top-6`}
          aria-label="Go back to previous page"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button>

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className={`grid w-full gap-5 lg:items-center xl:gap-7 ${theme.heroGrid}`}>
            <section className={`relative overflow-hidden rounded-[32px] p-7 sm:p-8 lg:min-h-[520px] lg:p-10 ${theme.showcaseShell}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
              <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-white/12 blur-3xl motion-safe:animate-pulse" />
              <div
                className="absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-white/8 blur-3xl motion-safe:animate-pulse"
                style={{ animationDelay: "700ms" }}
              />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="space-y-5">
                  <div className={`inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.eyebrow}`}>
                    {loginConfig.eyebrow}
                  </div>
                  <div className="space-y-4">
                    <p className={`text-[11px] font-medium uppercase tracking-[0.28em] ${theme.subEyebrow}`}>
                      {SITE_CONFIG.appTitle}
                    </p>
                    <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[2.85rem] lg:leading-[1.02]">
                      {loginConfig.title}
                    </h1>
                    <p className={`max-w-2xl text-sm leading-6 sm:text-base ${theme.body}`}>
                      {loginConfig.description}
                    </p>
                    <p className={`max-w-2xl text-sm leading-6 ${theme.body}`}>
                      {SITE_CONFIG.templateSurface.headline}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {loginSignals.map((signal) => (
                      <div
                        key={signal.label}
                        className={`rounded-2xl p-4 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
                      >
                        <p className="text-[11px] font-medium uppercase tracking-[0.22em] opacity-60">
                          {signal.label}
                        </p>
                        <p className={`mt-3 text-sm font-semibold leading-6 ${theme.metricValue}`}>
                          {signal.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {loginMetrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className={`rounded-2xl p-4 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full bg-current ${theme.metricValue} motion-safe:animate-pulse`}
                          style={{ animationDelay: `${index * 180}ms` }}
                        />
                        <p className="text-[11px] font-medium uppercase tracking-[0.22em] opacity-60">
                          {metric.label}
                        </p>
                      </div>
                      <p className={`mt-4 text-2xl font-semibold tracking-[-0.04em] ${theme.metricValue}`}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-xl">
              <div className={`rounded-[32px] p-6 sm:p-8 ${theme.showcaseShell}`}>
                <div className="space-y-3">
                  <div className={`inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.eyebrow}`}>
                    Secure sign-in
                  </div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                    Continue to your account
                  </h3>
                  <p className={`text-sm leading-6 ${theme.body}`}>
                    {step === "email"
                      ? loginConfig.emailHint
                      : "Enter the six-digit code sent to your inbox to finish sign-in."}
                  </p>
                </div>

                {error && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                  </div>
                )}

                {step === "email" ? (
                  <form onSubmit={handleSendCode} className="mt-8 space-y-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] opacity-70"
                      >
                        {loginConfig.emailLabel}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={loginConfig.emailPlaceholder}
                        className={`w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${theme.assistantInput}`}
                      />
                      <p className={`mt-3 text-sm leading-6 ${theme.body}`}>
                        {loginConfig.emailHint}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.assistantAction}`}
                    >
                      {loading ? "Sending code..." : "Send login code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="mt-8 space-y-5">
                    <div className={`rounded-2xl p-4 ${theme.metricShell}`}>
                      <p className={`text-sm leading-6 ${theme.body}`}>
                        We&apos;ve sent a verification code to
                      </p>
                      <p className="mt-1 text-base font-semibold">{email}</p>
                    </div>

                    {info && (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
                        {info}
                      </div>
                    )}

                    {devCode && (
                      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
                        <p className="font-medium">Development mode</p>
                        <p className="mt-1">
                          Your verification code is:{" "}
                          <span className="font-mono font-semibold">{devCode}</span>
                        </p>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="code"
                        className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] opacity-70"
                      >
                        Verification code
                      </label>
                      <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        placeholder="123456"
                        maxLength={6}
                        className={`w-full rounded-2xl border px-4 py-3 text-center font-mono text-2xl tracking-[0.45em] outline-none transition ${theme.assistantInput}`}
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${theme.secondaryButton}`}
                      >
                        Use another email
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.assistantAction}`}
                      >
                        {loading ? "Verifying..." : "Verify and continue"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendCode}
                      className={`w-full text-sm font-medium transition ${theme.navLink}`}
                    >
                      Didn&apos;t receive the code? Send it again.
                    </button>
                  </form>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                  <Link to="/" className={`transition ${theme.navLink}`}>
                    Return home
                  </Link>
                  <Link to="/pricing" className={`transition ${theme.navLink}`}>
                    Preview pricing
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
