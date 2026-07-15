import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
	redirect,
} from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { AppFooter } from "~/components/AppFooter";
import { AppHeader } from "~/components/AppHeader";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";
import {
	type PaymentHubApiError,
	type PaymentHubConfigError,
	listPaymentHubProducts,
	type PaymentHubProduct,
	type PaymentHubProductPrice,
} from "~/services/payment.server";
import { createManagedPaymentCheckout } from "~/services/payment-fulfillment.server";
import { getUserFromRequest, requireUser } from "~/utils/auth.server";
import {
	getEnvWarningMessage,
	getPaymentCancelUrl,
	getPaymentHubConfigWarningMessage,
	getPaymentSuccessUrl,
} from "~/utils/env.server";

export const meta: MetaFunction = () => {
	return [
		{ title: `Pricing - ${APP_TITLE}` },
		{
			name: "description",
			content: SITE_CONFIG.pricing.description,
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const user = await getUserFromRequest(request);
	const envWarning = getEnvWarningMessage();
	const paymentWarning = getPaymentHubConfigWarningMessage();
	const url = new URL(request.url);
	const requestedProductId = url.searchParams.get("productId")?.trim() || null;

	try {
		const products = await listPaymentHubProducts();
		const featuredProduct =
			products.find((product) => product.id === requestedProductId) ??
			products[0] ??
			null;

		return json({
			user,
			products,
			featuredProductId: featuredProduct?.id ?? null,
			envWarning,
			paymentWarning,
			loadError: null,
		});
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to load products from Payment Hub.";

		return json({
			user,
			products: [] as PaymentHubProduct[],
			featuredProductId: null,
			envWarning,
			paymentWarning,
			loadError: message,
		});
	}
}

export async function action({ request }: ActionFunctionArgs) {
	const user = await requireUser(request);
	const formData = await request.formData();

	const productId = String(formData.get("productId") ?? "").trim();

	if (!productId) {
		return json(
			{ success: false, error: "Missing product id." },
			{ status: 400 },
		);
	}

	try {
		const checkout = await createManagedPaymentCheckout({
			user,
			productId,
			successUrl: getPaymentSuccessUrl(),
			cancelUrl: getPaymentCancelUrl(),
			requireBuyerEmail: true,
			requireBuyerName: false,
		});
		const paymentLink = checkout.paymentLink;

		if (!paymentLink.url) {
			return json(
				{ success: false, error: "Payment Hub did not return a checkout url." },
				{ status: 502 },
			);
		}

		return redirect(paymentLink.url);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to create payment link.";

		const status =
			typeof error === "object" &&
			error !== null &&
			"status" in error &&
			typeof (
				error as
					| PaymentHubApiError
					| (PaymentHubConfigError & { status?: unknown })
			).status === "number"
				? Number(
						(
							error as
								| PaymentHubApiError
								| (PaymentHubConfigError & { status: number })
						).status,
					)
				: 500;

		return json({ success: false, error: message }, { status });
	}
}

function formatAmount(price?: PaymentHubProductPrice | null) {
	if (!price?.amount) return "Contact sales";

	const amount = Number(price.amount);
	if (Number.isNaN(amount)) {
		return `${price.amount} ${String(price.currency ?? "").toUpperCase()}`.trim();
	}

	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: (price.currency || "USD").toUpperCase(),
		}).format(amount);
	} catch {
		return `${amount.toFixed(2)} ${(price.currency || "USD").toUpperCase()}`;
	}
}

function formatBilling(price?: PaymentHubProductPrice | null) {
	if (!price) return "Custom pricing";

	if (price.type === "recurring" && price.interval) {
		return `Billed every ${price.interval}`;
	}

	if (price.type === "one_time") {
		return "One-time payment";
	}

	return "Flexible billing";
}

function getProductPrice(product: PaymentHubProduct) {
	return product.price ?? product.prices?.[0] ?? null;
}

function getDisplayProductName(product: PaymentHubProduct) {
	const raw = String(product.name ?? "").trim();
	if (!raw || /remix|template|pricing/i.test(raw)) {
		return SITE_CONFIG.pricing.defaultProductName;
	}
	return raw;
}

function getDisplayProductDescription(product: PaymentHubProduct) {
	const raw = String(product.description ?? "").trim();
	if (!raw || /remix|template|smoke|local pricing|payment hub/i.test(raw)) {
		return SITE_CONFIG.pricing.defaultProductDescription;
	}
	return raw;
}

function ProductCard({
	product,
	isFeatured,
}: {
	product: PaymentHubProduct;
	isFeatured: boolean;
}) {
	const price = getProductPrice(product);

	return (
		<div
			className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
				isFeatured
					? "border-blue-300 shadow-blue-100 dark:border-sky-700 dark:shadow-none"
					: "border-slate-200 dark:border-slate-800"
			}`}
		>
			<div className="space-y-3">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
							{getDisplayProductName(product)}
						</h2>
						<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
							{getDisplayProductDescription(product)}
						</p>
					</div>

					{product.active === false ? (
						<span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
							Inactive
						</span>
					) : (
						<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
							Active
						</span>
					)}
				</div>

				<div className="rounded-xl bg-slate-50 px-4 py-4 dark:bg-slate-800/60">
					<div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
						{formatAmount(price)}
					</div>
					<div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
						{formatBilling(price)}
					</div>
				</div>

				<div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
					<div className="flex items-center justify-between gap-4">
						<span>Product ID</span>
						<code className="max-w-[16rem] truncate rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
							{product.id}
						</code>
					</div>

					{price?.currency ? (
						<div className="flex items-center justify-between gap-4">
							<span>Currency</span>
							<span className="font-medium uppercase text-slate-800 dark:text-slate-200">
								{price.currency}
							</span>
						</div>
					) : null}
				</div>
			</div>

			<div className="mt-6">
				<Link
					to={`/pricing?productId=${encodeURIComponent(product.id)}`}
					className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
				>
					{isFeatured
						? SITE_CONFIG.pricing.viewingDetailsLabel
						: SITE_CONFIG.pricing.viewDetailsLabel}
				</Link>
			</div>
		</div>
	);
}

export default function PricingPage() {
	const {
		user,
		products,
		featuredProductId,
		envWarning,
		paymentWarning,
		loadError,
	} = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	const [clientUser, setClientUser] = useState(user);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [checkoutError, setCheckoutError] = useState("");
	const featuredProduct =
		products.find((product) => product.id === featuredProductId) ?? null;
	const featuredPrice = featuredProduct ? getProductPrice(featuredProduct) : null;
	const effectiveUser = clientUser ?? user;

	useEffect(() => {
		const token = localStorage.getItem("auth-token");
		if (!token) {
			setClientUser(user);
			return;
		}

		fetch("/api/auth/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => (response.ok ? response.json() : null))
			.then((data) => {
				if (data?.authenticated) {
					setClientUser(data.user);
					return fetch("/api/auth/sync-cookie", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}).catch(() => null);
				}
				setClientUser(null);
				return null;
			})
			.catch(() => {
				// noop
			});
	}, [user]);

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

	const handleCheckout = async (productId: string) => {
		const token = localStorage.getItem("auth-token");
		if (!token) {
			window.location.href = "/login";
			return;
		}

		setCheckoutError("");
		setCheckoutLoading(true);

		try {
			const response = await fetch("/api/pay/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ productId }),
			});

			const data = await response.json();
			if (!response.ok || !data?.success || !data?.checkoutUrl) {
				throw new Error(data?.error || "Failed to create checkout link.");
			}

			window.location.href = data.checkoutUrl;
		} catch (error) {
			setCheckoutError(
				error instanceof Error
					? error.message
					: "Failed to create checkout link.",
			);
		} finally {
			setCheckoutLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			{envWarning ? (
				<div className="w-full border-b border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
					{envWarning}
				</div>
			) : null}

			{paymentWarning ? (
				<div className="w-full border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
					{paymentWarning}
				</div>
			) : null}

			<AppHeader user={effectiveUser} onLogout={handleLogout} />

			<main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<section className="mx-auto max-w-3xl text-center">
					<div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
						{SITE_CONFIG.pricing.badge}
					</div>
					<h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
						{featuredPrice
							? `${SITE_CONFIG.pricing.headline} ${formatAmount(featuredPrice)}`
							: SITE_CONFIG.pricing.headline}
					</h1>
					<p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
						{SITE_CONFIG.pricing.description}
					</p>

					<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
						<Link
							to="/"
							className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
						>
							Back to home
						</Link>
						{effectiveUser ? (
							<span className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
								{SITE_CONFIG.pricing.readyLabelPrefix}{" "}
								{effectiveUser.displayName ||
									effectiveUser.username ||
									effectiveUser.email}
							</span>
						) : (
							<Link
								to="/login"
								className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600"
							>
								{SITE_CONFIG.pricing.loginButtonLabel}
							</Link>
						)}
					</div>
				</section>

				{loadError ? (
					<section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-red-200 bg-white p-6 text-left shadow-sm dark:border-red-900 dark:bg-slate-900">
						<h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
							Unable to load products
						</h2>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
							{loadError}
						</p>
						<p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
							{SITE_CONFIG.pricing.loadErrorHint}
						</p>
					</section>
				) : null}

				{featuredProduct ? (
					<section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
							<div>
								<div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
									{SITE_CONFIG.pricing.featuredLabel}
								</div>
								<h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
									{getDisplayProductName(featuredProduct)}
								</h2>
								<p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
									{getDisplayProductDescription(featuredProduct)}
								</p>

								<div className="mt-6 grid gap-4 sm:grid-cols-3">
									<div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
										<div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
											Price
										</div>
										<div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
											{formatAmount(featuredPrice)}
										</div>
									</div>
									<div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
										<div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
											Billing
										</div>
										<div className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
											{formatBilling(featuredPrice)}
										</div>
									</div>
									<div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
										<div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
											Access
										</div>
										<div className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
											{SITE_CONFIG.pricing.accessLabel}
										</div>
									</div>
								</div>
							</div>

							<div className="rounded-3xl bg-slate-950 p-6 text-white dark:bg-slate-50 dark:text-slate-950">
								<div className="text-sm font-medium text-white/70 dark:text-slate-600">
									{SITE_CONFIG.pricing.checkoutLabel}
								</div>
								<div className="mt-3 text-4xl font-semibold tracking-tight">
									{formatAmount(featuredPrice)}
								</div>
								<p className="mt-3 text-sm leading-6 text-white/70 dark:text-slate-600">
									{effectiveUser
										? SITE_CONFIG.pricing.checkoutUserDescription
										: SITE_CONFIG.pricing.checkoutGuestDescription}
								</p>

								<div className="mt-6">
									{effectiveUser ? (
										<button
											type="button"
											onClick={() => void handleCheckout(featuredProduct.id)}
											disabled={
												checkoutLoading ||
												isSubmitting ||
												featuredProduct.active === false
											}
											className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
										>
											{checkoutLoading
												? "Opening checkout..."
												: SITE_CONFIG.pricing.buyButtonLabel}
										</button>
									) : (
										<Link
											to="/login"
											className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
										>
											{SITE_CONFIG.pricing.loginButtonLabel}
										</Link>
									)}
								</div>

								{checkoutError ? (
									<div className="mt-4 rounded-2xl border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-100 dark:border-red-300/30 dark:bg-red-500/10 dark:text-red-700">
										{checkoutError}
									</div>
								) : null}
							</div>
						</div>
					</section>
				) : null}

				<section className="mt-10 flex items-center justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
							Available products
						</h2>
						<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
							Select any product to open its pricing details and create checkout.
						</p>
					</div>
				</section>

				<section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							isFeatured={product.id === featuredProductId}
						/>
					))}
				</section>

				{!loadError && products.length === 0 ? (
					<section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
							{SITE_CONFIG.pricing.emptyStateTitle}
						</h2>
						<p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
							{SITE_CONFIG.pricing.emptyStateDescription}
						</p>
					</section>
				) : null}
			</main>

			<AppFooter />
		</div>
	);
}
