import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@remix-run/node';
import { getUserFromRequest } from '~/utils/auth.server';
import { getEnvWarningMessage } from '~/utils/env.server';
import { SiteHome } from '~/components/SiteHome';
import { SITE_CONFIG } from '~/constants/site';
import { getIndustryHome } from '~/lib/auth-flow';
import { getTemplateSnapshot } from '~/services/template-data.server';
import { toPublicTemplateSnapshot } from '~/utils/template-snapshot';

export const meta: MetaFunction = () => {
  return [
    { title: `Home - ${SITE_CONFIG.appTitle}` },
    { name: 'description', content: SITE_CONFIG.siteDescription },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserFromRequest(request);
  const envWarning = getEnvWarningMessage();
  const url = new URL(request.url);
  const signedOut = url.searchParams.get('signedOut') === '1';
  const firstLogin = url.searchParams.get('welcome') === '1';
  let snapshot = null;
  let snapshotWarning = null;

  try {
    const liveSnapshot = await getTemplateSnapshot();
    snapshot = user ? liveSnapshot : toPublicTemplateSnapshot(liveSnapshot);
  } catch (error) {
    snapshotWarning = error instanceof Error ? error.message : 'Failed to load template snapshot.';
  }

  return json({
    user,
    warnings: [envWarning, snapshotWarning].filter((warning): warning is string =>
      Boolean(warning)
    ),
    snapshot,
    signedOut,
    firstLogin,
    industryHome: getIndustryHome(),
  });
};

type LoaderData = SerializeFrom<typeof loader>;

export default function Index() {
  const { user, warnings, snapshot, signedOut, firstLogin, industryHome } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [clientUser, setClientUser] = useState<LoaderData['user']>(user);
  const lastSyncedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    // Only sync when the local token actually changes. Otherwise the server-rendered
    // user is the source of truth and we avoid a one-frame "logged-out → logged-in" flicker.
    let token: string | null = null;
    try {
      token = localStorage.getItem('auth-token');
    } catch {
      // ignore
    }
    if (!token || token === lastSyncedTokenRef.current) return;
    lastSyncedTokenRef.current = token;

    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d && d.authenticated) setClientUser(d.user);
        else setClientUser(null);
      })
      .catch(() => undefined);
  }, []);

  // Welcome handshake: if the user just completed first login, offer onboarding exactly once.
  useEffect(() => {
    if (!firstLogin) return;
    try {
      const seen = localStorage.getItem('d1v-onboarded');
      if (seen) return;
    } catch {
      // ignore
    }
    // Send first-time users through onboarding before landing on the workspace.
    navigate('/onboarding', { replace: true });
  }, [firstLogin, navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      try {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('d1v-onboarded');
        localStorage.removeItem('d1v-display-name');
        localStorage.removeItem('d1v-goal');
      } catch {
        // noop
      }
      navigate('/?signedOut=1', { replace: true });
    }
  };

  const effectiveUser = clientUser ?? user;

  return (
    <SiteHome
      snapshot={snapshot}
      user={effectiveUser ?? undefined}
      onLogout={handleLogout}
      warnings={warnings}
      showSignedOutToast={signedOut}
    />
  );
}
