import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { EmptyState } from '~/components/sections/EmptyState';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { SITE_CONFIG } from '~/constants/site';
import type { AppHeaderUser } from '~/components/AppHeader';
import { requireUserOrRedirect } from '~/lib/auth-flow';

export const meta: MetaFunction = () => [
  { title: `Prompts · ${SITE_CONFIG.appTitle}` },
  { name: 'description', content: 'Reusable scripts, versioned for the workspace.' },
];

const PROMPTS = [
  { id: 'p-onboarding', name: 'Onboarding v3', uses: 412, status: 'Live', priority: 'live' as const },
  { id: 'p-renewal', name: 'Renewal script', uses: 168, status: 'Live', priority: 'live' as const },
  { id: 'p-escalation', name: 'Escalation triage', uses: 92, status: 'Review', priority: 'high' as const },
  { id: 'p-cold-start', name: 'Cold start fallback', uses: 71, status: 'Live', priority: 'live' as const },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({ user, prompts: PROMPTS });
}

export default function PromptsIndex() {
  const { user, prompts } = useLoaderData<typeof loader>();
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
  const reviewQueue = prompts.filter(p => p.priority === 'high');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`text-sm ${theme.body}`}>Review queue · {reviewQueue.length} need your attention</p>
        <button type="button" onClick={handleLogout} className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
          Logout
        </button>
      </div>
      {prompts.length === 0 ? (
        <EmptyState icon="📝" title="No prompts yet" description="Versioned scripts will appear here as the workspace matures." />
      ) : (
        <ul className="grid gap-2">
          {prompts.map(prompt => (
            <li
              key={prompt.id}
              className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${
                prompt.priority === 'high' ? theme.assistantShell : theme.listItemShell
              }`}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight">{prompt.name}</p>
                <p className={`mt-0.5 text-xs ${theme.sectionText}`}>{prompt.uses} runs</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.eyebrow}`}>
                {prompt.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
