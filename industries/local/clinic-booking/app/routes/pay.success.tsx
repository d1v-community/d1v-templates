import type { MetaFunction } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { AppFooter } from "~/components/AppFooter";
import { AppHeader } from "~/components/AppHeader";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";

export const meta: MetaFunction = () => {
	return [
		{ title: `Payment Success - ${APP_TITLE}` },
		{
			name: "description",
			content: SITE_CONFIG.paymentSuccess.description,
		},
	];
};

function DetailRow({ label, value }: { label: string; value: string | null }) {
	if (!value) return null;

	return (
		<div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800/60">
			<span className="text-slate-500 dark:text-slate-400">{label}</span>
			<span className="max-w-[16rem] truncate font-medium text-slate-900 dark:text-slate-100">
				{value}
			</span>
		</div>
	);
}

export default function PaySuccessPage() {
	const [searchParams] = useSearchParams();

	const paymentLinkId =
		searchParams.get("id") ||
		searchParams.get("payment_link_id") ||
		searchParams.get("paymentLinkId");

	const productId =
		searchParams.get("productId") || searchParams.get("product_id");

	const sessionId =
		searchParams.get("session_id") || searchParams.get("sessionId");

	const userId = searchParams.get("userId") || searchParams.get("user_id");

	const handleLogout = async () => {
		try {
			await fetch("/api/auth/logout", { method: "POST" });
		} finally {
			try {
				localStorage.removeItem("auth-token");
			} catch {
				// noop
			}
			window.location.href = "/login";
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<AppHeader user={null} onLogout={handleLogout} />

			<main className="mx-auto flex max-w-3xl flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
						<svg
							className="h-8 w-8 text-emerald-600 dark:text-emerald-300"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M20 6 9 17l-5-5" />
						</svg>
					</div>

					<div className="mt-6 text-center">
						<p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
							{SITE_CONFIG.paymentSuccess.eyebrow}
						</p>
						<h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
							{SITE_CONFIG.paymentSuccess.title}
						</h1>
						<p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
							{SITE_CONFIG.paymentSuccess.description}
						</p>
					</div>

					<div className="mt-8 space-y-3">
						<DetailRow label="Payment Link ID" value={paymentLinkId} />
						<DetailRow label="Product ID" value={productId} />
						<DetailRow label="Session ID" value={sessionId} />
						<DetailRow label="User ID" value={userId} />
					</div>

					<div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-sky-900 dark:bg-sky-950/30">
						<h2 className="text-sm font-semibold text-blue-900 dark:text-sky-200">
							{SITE_CONFIG.paymentSuccess.nextStepsTitle}
						</h2>
						<ul className="mt-3 space-y-2 text-sm leading-6 text-blue-800 dark:text-sky-300">
							{SITE_CONFIG.paymentSuccess.nextSteps.map((item) => (
								<li key={item}>• {item}</li>
							))}
						</ul>
					</div>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Link
							to="/pricing"
							className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600"
						>
							{SITE_CONFIG.paymentSuccess.primaryButtonLabel}
						</Link>
						<Link
							to="/"
							className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
						>
							{SITE_CONFIG.paymentSuccess.secondaryButtonLabel}
						</Link>
					</div>
				</div>
			</main>

			<AppFooter />
		</div>
	);
}
