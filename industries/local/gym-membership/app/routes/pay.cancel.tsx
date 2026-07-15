import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AppFooter } from "~/components/AppFooter";
import { APP_TITLE } from "~/constants/app";
import { SITE_CONFIG } from "~/constants/site";

export const meta: MetaFunction = () => {
	return [
		{ title: `Payment Cancelled - ${APP_TITLE}` },
		{
			name: "description",
			content: SITE_CONFIG.paymentCancel.description,
		},
	];
};

export default function PayCancelPage() {
	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
				<div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
						<svg
							viewBox="0 0 24 24"
							className="h-7 w-7"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<path
								d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0Z"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>

					<div className="mt-6 text-center">
						<p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
							{SITE_CONFIG.paymentCancel.eyebrow}
						</p>
						<h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
							{SITE_CONFIG.paymentCancel.title}
						</h1>
						<p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
							{SITE_CONFIG.paymentCancel.description}
						</p>
					</div>

					<div className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
						<p className="font-medium text-slate-900 dark:text-slate-100">
							{SITE_CONFIG.paymentCancel.reasonsTitle}
						</p>
						<ul className="mt-3 list-disc space-y-1.5 pl-5">
							{SITE_CONFIG.paymentCancel.reasons.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Link
							to="/pricing"
							className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-600"
						>
							{SITE_CONFIG.paymentCancel.primaryButtonLabel}
						</Link>
						<Link
							to="/"
							className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
						>
							{SITE_CONFIG.paymentCancel.secondaryButtonLabel}
						</Link>
					</div>
				</div>
			</main>

			<AppFooter />
		</div>
	);
}
