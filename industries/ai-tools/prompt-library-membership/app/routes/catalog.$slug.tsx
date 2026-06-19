import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { and, desc, eq } from "drizzle-orm";

import { EmptyState } from "~/components/sections/EmptyState";
import { PageHeader } from "~/components/sections/PageHeader";
import { ReviewStars } from "~/components/ugc/ReviewStars";
import { db } from "~/db/db.server";
import { ugcReviews } from "~/db/schema";
import { SITE_CONFIG } from "~/constants/site";
import { getSiteThemeClasses } from "~/constants/site-theme";
import { requireUserOrRedirect } from "~/lib/auth-flow";

export const meta: MetaFunction = ({ params }) => [
  { title: `Pack · ${params.slug ?? ""} · ${SITE_CONFIG.appTitle}` },
  { name: "description", content: "Single prompt pack detail with reviews." },
];

interface ReviewRow {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  body: string;
  createdAt: string;
}

const PACK_NAMES: Record<string, string> = {
  "launch-os": "Launch OS",
  "research-radar": "Research Radar",
  "cold-outreach-kit": "Cold Outreach Kit",
  "content-engine": "Content Engine",
  "product-discovery": "Product Discovery",
  "support-triage": "Support Triage",
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const slug = params.slug ?? "";

  let reviews: ReviewRow[] = [];
  let avgRating = 0;
  try {
    const rows = await db
      .select()
      .from(ugcReviews)
      .where(and(eq(ugcReviews.contextKind, "pack"), eq(ugcReviews.contextSlug, slug)))
      .orderBy(desc(ugcReviews.createdAt));
    reviews = rows.map(r => ({
      id: r.id,
      authorName: r.authorName,
      authorInitials: r.authorInitials,
      rating: r.rating,
      body: r.body,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt ?? ""),
    }));
    if (reviews.length > 0) {
      avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }
  } catch (error) {
    console.error("Failed to load pack reviews:", error);
  }

  return json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
    },
    slug,
    packName: PACK_NAMES[slug] ?? slug,
    reviews,
    avgRating,
  });
}

export default function PackDetailRoute() {
  const { slug, packName, reviews, avgRating } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageHeader
        eyebrow={`Pack · ${slug}`}
        title={packName}
        description="Full workflow, ready to drop into your stack."
        back={{ href: "/catalog/library", label: "Library" }}
      />

      <section className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${theme.sectionShell}`}>
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">Member reviews</h2>
            <p className="mt-1 text-xs opacity-60">
              {reviews.length === 0 ? "Be the first to review" : `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`}
            </p>
          </div>
          {reviews.length > 0 ? (
            <ReviewStars value={Math.round(avgRating)} showValue size="md" />
          ) : null}
        </header>

        {reviews.length === 0 ? (
          <EmptyState
            icon="✶"
            title="No reviews yet"
            description="Use this pack for a day or two, then come back and share what worked."
            hint="rating + body"
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {reviews.map(r => (
              <li key={r.id} className={`flex flex-col gap-2 rounded-2xl p-4 ${theme.metricShell}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}
                    >
                      {r.authorInitials}
                    </span>
                    <p className="text-sm font-semibold tracking-tight">{r.authorName}</p>
                  </div>
                  <ReviewStars value={r.rating} size="sm" />
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}