import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { json, type MetaFunction, type LoaderFunctionArgs, type SerializeFrom } from "@remix-run/node";
import { getUserFromRequest } from "~/utils/auth.server";
import { getEnvWarningMessage } from "~/utils/env.server";
import { AppHeader } from "~/components/AppHeader";
import { AppFooter } from "~/components/AppFooter";
import { DevLoadingCard } from "~/components/DevLoadingCard";
import { SITE_CONFIG } from "~/constants/site";

export const meta: MetaFunction = () => {
  return [
    { title: `Home - ${SITE_CONFIG.appTitle}` },
    { name: "description", content: SITE_CONFIG.siteDescription },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserFromRequest(request);
  const envWarning = getEnvWarningMessage();

  return json({ user, envWarning });
};

type LoaderData = SerializeFrom<typeof loader>;

export default function Index() {
  const { user, envWarning } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<LoaderData["user"]>(user);

  useEffect(() => {
    // Ensure client reflects latest auth state (token/cookie changes)
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.authenticated) setClientUser(d.user);
        else setClientUser(null);
      })
      .catch(() => {
        // noop: 静默处理网络错误
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      try {
        localStorage.removeItem("auth-token");
      } catch {
        // noop: 静默处理清理 token 失败
      }
      navigate("/login", { replace: true });
    }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {envWarning ? (
        <div className="w-full bg-red-50 border-b border-red-200 text-red-700 text-sm text-center py-2 px-4 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200">
          {envWarning}
        </div>
      ) : null}

      <AppHeader user={effectiveUser} onLogout={handleLogout} />

      <main className="flex-1 min-h-0">
        <DevLoadingCard />
      </main>

      <AppFooter />
    </div>
  );
}
