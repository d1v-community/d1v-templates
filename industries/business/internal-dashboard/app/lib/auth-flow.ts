import { redirect } from '@remix-run/node';

import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';

const RESERVED_FALLBACKS = new Set(['/login', '/logout', '/api/auth/logout']);

/**
 * Sanitize a `returnTo` value: only allow same-origin relative paths.
 * Anything else (absolute URLs, protocol-relative, mailto, etc.) falls back to the
 * provided industry home.
 */
export function safeReturnTo(value: string | null | undefined, fallback: string): string {
  if (!value || typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  if (RESERVED_FALLBACKS.has(value)) return fallback;
  return value;
}

/**
 * Read the configured industry home (e.g. /console, /library). Falls back to `/`.
 */
export function getIndustryHome(): string {
  return SITE_CONFIG.home.industry?.homeHref ?? '/';
}

/**
 * Loader guard for any protected page. If the user is not signed in, redirect to
 * /login?returnTo=... pointing back at the current page.
 */
export async function requireUserOrRedirect(
  request: Request,
  fallback: string = getIndustryHome(),
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    const url = new URL(request.url);
    const returnTo = url.pathname + url.search;
    throw redirect(`/login?returnTo=${encodeURIComponent(returnTo)}&from=${encodeURIComponent(fallback)}`);
  }
  return user;
}
