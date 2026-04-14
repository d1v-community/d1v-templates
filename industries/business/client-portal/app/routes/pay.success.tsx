import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { AppFooter } from "~/components/AppFooter";
import { AppHeader } from "~/components/AppHeader";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import { reconcilePaymentSuccess } from "~/services/payment-fulfillment.server";
import { getUserFromRequest } from "~/utils/auth.server";

export const meta: MetaFunction = () => {
	return [
		{ title: `Payment Success - ${APP_TITLE}` },
		{
			name: "description",
			content: SITE_CONFIG.paymentSuccess.description,
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getUserFromRequest(request);
	const url = new URL(request.url);
	const result = await reconcilePaymentSuccess({ request, user });

	return json({
		user,
		query: {
			checkoutRequestId: url.searchParams.get("checkout_request_id"),
			paymentLinkId:
				url.searchParams.get("id") ||
				url.searchParams.get("payment_link_id") ||
				url.searchParams.get("paymentLinkId"),
			productId:
				url.searchParams.get("productId") || url.searchParams.get("product_id"),
			sessionId:
				url.searchParams.get("session_id") || url.searchParams.get("sessionId"),
			userId: url.searchParams.get("userId") || url.searchParams.get("user_id"),
		},
		result,
	});
}

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

function FulfillmentStateCard({
	status,
	summary,
	reason,
	accessLabel,
}: {
	status: string;
	summary?: string | null;
	reason?: string;
	accessLabel?: string | null;
}) {
	const isFulfilled = status === "fulfilled" || status === "duplicate";

	return (
		<div
			className={`mt-8 rounded-2xl border p-5 ${
				isFulfilled
					? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20"
					: "border-amber-200 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20"
			}`}
		>
			<h2
				className={`text-sm font-semibold ${
					isFulfilled
						? "text-emerald-900 dark:text-emerald-200"
						: "text-amber-900 dark:text-amber-200"
				}`}
			>
				{isFulfilled ? "Fulfillment completed" : "Fulfillment pending"}
			</h2>
			<p
				className={`mt-2 text-sm leading-6 ${
					isFulfilled
						? "text-emerald-800 dark:text-emerald-300"
						: "text-amber-800 dark:text-amber-300"
				}`}
			>
				{summary || reason || "We are still reconciling your payment status."}
			</p>
			{accessLabel ? (
				<p
					className={`mt-3 text-xs font-medium uppercase tracking-[0.18em] ${
						isFulfilled
							? "text-emerald-700 dark:text-emerald-300"
							: "text-amber-700 dark:text-amber-300"
					}`}
				>
					{accessLabel}
				</p>
			) : null}
		</div>
	);
}

export default function PaySuccessPage() {
	const { query, result, user } = useLoaderData<typeof loader>();

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
			<AppHeader user={user} onLogout={handleLogout} />

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

					<FulfillmentStateCard
						status={result.status}
						summary={result.summary}
						reason={result.reason}
						accessLabel={result.accessLabel}
					/>

					<div className="mt-8 space-y-3">
						<DetailRow label="Checkout Request ID" value={query.checkoutRequestId} />
						<DetailRow label="Payment Link ID" value={query.paymentLinkId} />
						<DetailRow label="Product ID" value={query.productId} />
						<DetailRow label="Session ID" value={query.sessionId} />
						<DetailRow label="User ID" value={query.userId} />
						<DetailRow label="Transaction ID" value={result.transactionId ?? null} />
						<DetailRow label="Business Entity" value={result.businessEntity ?? null} />
						<DetailRow label="Business Record ID" value={result.businessRecordId ?? null} />
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
