// Client-only fetch interceptor to attach Authorization header
// to same-origin API requests using token from localStorage.

declare global {
  interface Window {
    __authFetchInstalled?: boolean;
  }
}

export function installAuthFetchInterceptor(options?: {
  pathPrefix?: string;
  headerName?: string;
  storageKey?: string;
}) {
  if (typeof window === "undefined") return; // SSR guard
  if (window.__authFetchInstalled) return;

  const pathPrefix = options?.pathPrefix ?? "/api/";
  const headerName = options?.headerName ?? "Authorization";
  const storageKey = options?.storageKey ?? "auth-token";

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const urlObj = new URL(
        typeof input === "string" || input instanceof URL ? input.toString() : (input as Request).url,
        window.location.origin
      );

      const sameOrigin = urlObj.origin === window.location.origin;
      const isApi = urlObj.pathname.startsWith(pathPrefix);
      // Remix data requests generally include the _data search param
      const isRemixData = urlObj.searchParams.has("_data");

      if (sameOrigin && (isApi || isRemixData)) {
        const token = localStorage.getItem(storageKey);

        if (token) {
          const existingHeaders = new Headers(
            typeof input === "object" && !(typeof input === "string") && !(input instanceof URL)
              ? (input as Request).headers
              : undefined
          );
          if (init?.headers) {
            new Headers(init.headers).forEach((v, k) => existingHeaders.set(k, v));
          }

          if (!existingHeaders.has(headerName)) {
            existingHeaders.set(headerName, `Bearer ${token}`);
          }

          const nextInit: RequestInit = { ...(init || {}), headers: existingHeaders };
          return originalFetch(input, nextInit);
        }
      }
    } catch {
      // fall through to original fetch if anything goes wrong
    }

    return originalFetch(input, init);
  };

  window.__authFetchInstalled = true;
}
