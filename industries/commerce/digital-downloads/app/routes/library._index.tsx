import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { requireUserOrRedirect } from "~/lib/auth-flow";

import { AppFooter } from '~/components/AppFooter';
import { AppHeader, type AppHeaderUser } from '~/components/AppHeader';
import { EmptyState } from '~/components/sections/EmptyState';
import { PageHeader } from '~/components/sections/PageHeader';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export const meta: MetaFunction = () => [
  { title: `Library · ${APP_TITLE}` },
  { name: 'description', content: 'Buyer library for digital downloads.' },
];

const BUNDLES = [
  { slug: 'creator-kit', title: 'Creator kit', format: 'PDF / ZIP / Notion', license: 'Commercial', price: '$48', updated: '1d ago' },
  { slug: 'launch-bundle', title: 'Launch bundle', format: 'ZIP + Notion', license: 'Commercial', price: '$84', updated: '4d ago' },
  { slug: 'analyst-pack', title: 'Analyst pack', format: 'PDF + Sheets', license: 'Single team', price: '$36', updated: '2w ago' },
  { slug: 'founder-toolkit', title: 'Founder toolkit', format: 'Notion + ZIP', license: 'Commercial', price: '$120', updated: '3w ago' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, bundles: BUNDLES });
}

export default function LibraryIndex() {
  const { user, bundles } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<AppHeaderUser | null>(user);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(d => (d?.authenticated ? setClientUser(d.user) : setClientUser(null)))
      .catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } finally { navigate('/?signedOut=1', { replace: true }); }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={effectiveUser} onLogout={handleLogout} />
      <main className="flex-1">
        <PageHeader
          eyebrow="Buyer vault"
          title="Your downloads"
          description="Every bundle you've unlocked, in one place. Re-download files, review license, and pick up the latest version."
          back={{ href: '/', label: 'Home' }}
        />

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pb-16">
          {bundles.length === 0 ? (
            <EmptyState icon="📦" title="Vault is empty" description="Open the storefront and unlock your first bundle. It will appear here." hint="pricing → unlock → vault" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {bundles.map(bundle => (
                <Link
                  key={bundle.slug}
                  to={`/library/${bundle.slug}`}
                  className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{bundle.title}</h2>
                    <span className={`text-2xl font-semibold tracking-[-0.05em] ${theme.metricValue}`}>{bundle.price}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
                    <span>{bundle.format}</span>
                    <span className="opacity-30">·</span>
                    <span>{bundle.license}</span>
                  </div>
                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Updated {bundle.updated}</span>
                  <span className="absolute bottom-3 right-3 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 transition group-hover:opacity-100">Open →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
