import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

import { AppFooter } from "~/components/AppFooter";
import { AppHeader, type AppHeaderUser } from "~/components/AppHeader";
import { WorkspaceLayout, type WorkspaceTab } from "~/components/workspace/WorkspaceLayout";
import { getIndustryHome, requireUserOrRedirect } from "~/lib/auth-flow";

const TABS: WorkspaceTab[] = [
  {
    "label": "Book",
    "to": "/book",
    "end": true
  },
  {
    "label": "New",
    "to": "/book/new"
  },
  {
    "label": "Doctors",
    "to": "/book/doctors"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, industryHome: getIndustryHome() });
}

export default function BookLayout() {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d?.authenticated ? setClientUser(d.user) : setClientUser(null)))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      navigate("/?signedOut=1", { replace: true });
    }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1 min-h-0">
        <WorkspaceLayout
          tabs={TABS}
          eyebrow={TABS[0].label}
          title=""
          description=""
        >
          <Outlet />
        </WorkspaceLayout>
      </main>
      <AppFooter />
    </div>
  );
}
