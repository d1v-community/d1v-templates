import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { getSiteThemeClasses } from "~/constants/site-theme";
import { SITE_CONFIG } from "~/constants/site";

interface ReviewStarsProps {
  /** Currently selected rating (1-5). */
  value: number;
  /** Optional action endpoint. When provided, stars become a clickable form. */
  action?: string;
  /** Hidden field name. Defaults to "rating". */
  name?: string;
  /** Show the numeric value next to stars. */
  showValue?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Size variant. */
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
} as const;

export function ReviewStars({
  value,
  action,
  name = "rating",
  showValue = false,
  disabled = false,
  size = "md",
}: ReviewStarsProps) {
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const fetcher = useFetcher<{ ok: boolean; rating: number }>();
  const interactive = Boolean(action) && !disabled;

  // Optimistic rating while submitting
  const optimisticRating = fetcher.formData
    ? Number(fetcher.formData.get(name) ?? value)
    : (fetcher.data?.rating ?? value);

  // Hover preview state
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue > 0 ? hoverValue : optimisticRating;

  // Pop animation key — re-key on each click
  const [popKey, setPopKey] = useState(0);
  useEffect(() => {
    if (fetcher.state === "submitting") setPopKey(k => k + 1);
  }, [fetcher.state]);

  const stars = (
    <div className={`flex items-center gap-0.5 ${sizeMap[size]}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          aria-hidden
          className={`transition-all duration-200 motion-safe:group-hover/stars:scale-110 ${
            n <= displayValue ? "text-amber-500" : "text-slate-300 dark:text-slate-700"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (!interactive) {
    return (
      <div className="inline-flex items-center gap-2">
        {stars}
        {showValue ? (
          <span className={`text-xs font-semibold ${theme.sectionText}`}>{value.toFixed(1)} / 5</span>
        ) : null}
      </div>
    );
  }

  return (
    <fetcher.Form
      method="post"
      action={action}
      className="group/stars flex items-center gap-1"
      onMouseLeave={() => setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="submit"
          name={name}
          value={n}
          onMouseEnter={() => setHoverValue(n)}
          onClick={() => setPopKey(k => k + 1)}
          className="transition motion-safe:hover:scale-110 motion-safe:active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded"
          aria-label={`Rate ${n} out of 5`}
        >
          <span
            key={popKey === 0 ? `static-${n}` : `pop-${popKey}-${n}`}
            aria-hidden
            className={`block transition-all duration-200 ${
              n <= displayValue ? "text-amber-500 motion-safe:animate-[ugc-scale-pop_0.35s_ease-out]" : "text-slate-300 dark:text-slate-700 hover:text-amber-300"
            }`}
          >
            ★
          </span>
        </button>
      ))}
      {showValue ? (
        <span
          key={`count-${optimisticRating}`}
          className={`ml-2 text-xs font-semibold motion-safe:animate-[ugc-count-bounce_0.3s_ease-out] ${theme.sectionText}`}
        >
          {optimisticRating.toFixed(1)} / 5
        </span>
      ) : null}
    </fetcher.Form>
  );
}
