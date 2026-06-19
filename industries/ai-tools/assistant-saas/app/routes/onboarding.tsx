import { json, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Form, useLoaderData, useNavigate, useNavigation } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { AppFooter } from '~/components/AppFooter';
import { AppHeader } from '~/components/AppHeader';
import { PageHeader } from '~/components/sections/PageHeader';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getIndustryHome, requireUserOrRedirect } from '~/lib/auth-flow';

export const meta: MetaFunction = () => [
  { title: `Welcome · ${APP_TITLE}` },
  { name: 'description', content: 'Set up your workspace in two steps.' },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  return json({
    user,
    industryHome: getIndustryHome(),
    workspaceName: SITE_CONFIG.home.industry.workspaceName,
    greeting: SITE_CONFIG.home.industry.greeting,
    firstRunHints: SITE_CONFIG.home.industry.firstRunHint,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUserOrRedirect(request);
  const formData = await request.formData();
  const name = String(formData.get('displayName') ?? '').trim();
  const goal = String(formData.get('goal') ?? '').trim();
  // Stash locally; in a real backend this would persist to the user profile.
  // Returning JSON keeps the UX simple: the client clears the first-login flag and routes on.
  return json({ ok: true, name, goal, userId: user.id });
}

export default function Onboarding() {
  const { user, industryHome, workspaceName, greeting, firstRunHints } = useLoaderData<typeof loader>();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [step, setStep] = useState<1 | 2>(1);
  const [displayName, setDisplayName] = useState<string>(user.displayName ?? user.username ?? '');
  const [goal, setGoal] = useState<string>('');

  useEffect(() => {
    // Guard: if the onboarded flag is set, this user already finished. Bounce to workspace.
    try {
      const seen = localStorage.getItem('d1v-onboarded');
      if (seen) navigate(`${industryHome}?ready=1`, { replace: true });
    } catch {
      // ignore
    }
  }, [navigate, industryHome]);

  const handleFinish = () => {
    try {
      localStorage.setItem('d1v-onboarded', '1');
      // Stash the chosen displayName + goal for the rest of the session.
      localStorage.setItem('d1v-display-name', displayName);
      localStorage.setItem('d1v-goal', goal);
    } catch {
      // ignore
    }
    // Industry home receives `?ready=1`; AppHeader shows a one-shot "Workspace ready" toast.
    navigate(`${industryHome}?ready=1`, { replace: true });
  };

  const effectiveDisplay = user.displayName || user.username || user.email || 'there';
  const hints = firstRunHints ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AppHeader user={user} onLogout={() => undefined} />
      <main className="flex-1">
        <PageHeader
          eyebrow={`Step ${step} of 2`}
          title={step === 1 ? `Welcome${effectiveDisplay ? `, ${effectiveDisplay}` : ''}.` : "What's the one thing you want to ship first?"}
          description={step === 1 ? `${greeting} Let's set up your ${workspaceName.toLowerCase()} in two short steps.` : "Pick the outcome that brings you back tomorrow. We'll tune onboarding around it."}
        />

        <div className="mx-auto w-full max-w-2xl px-5 sm:px-8 lg:px-10 pb-16 space-y-6">
          <div className={`flex items-center gap-2 rounded-full p-1.5 ${theme.listItemShell}`}>
            {[1, 2].map(n => (
              <div
                key={n}
                className={`flex-1 rounded-full px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                  step === n ? theme.eyebrow : 'opacity-50'
                }`}
              >
                {n}. {n === 1 ? 'Name' : 'First move'}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <form
              onSubmit={event => {
                event.preventDefault();
                if (displayName.trim()) setStep(2);
              }}
              className={`rounded-3xl p-6 sm:p-8 ${theme.sectionShell}`}
            >
              <label htmlFor="displayName" className="block text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                What should we call you?
              </label>
              <input
                id="displayName"
                value={displayName}
                onChange={event => setDisplayName(event.target.value)}
                required
                autoFocus
                placeholder={user.email ?? 'Avery'}
                className={`mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${theme.assistantInput}`}
              />
              <p className={`mt-3 text-[12px] leading-relaxed ${theme.body}`}>
                Shown across the {workspaceName.toLowerCase()} instead of your email. You can change it any time.
              </p>
              <div className="mt-6 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!displayName.trim()}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.primaryButton}`}
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            <Form
              method="post"
              onSubmit={event => {
                event.preventDefault();
                handleFinish();
              }}
              className={`rounded-3xl p-6 sm:p-8 ${theme.sectionShell}`}
            >
              <input type="hidden" name="displayName" value={displayName} />
              <input type="hidden" name="goal" value={goal} />
              <fieldset>
                <legend className="block text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                  Pick your first move
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {hints.map(option => {
                    const active = goal === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setGoal(option.id)}
                        className={`flex flex-col items-start gap-1 rounded-2xl p-4 text-left transition motion-safe:hover:-translate-y-0.5 ${
                          active ? theme.assistantShell : theme.metricShell
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-tight">{option.label}</span>
                        <span className={`text-xs leading-relaxed ${theme.sectionText}`}>{option.detail}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <p className={`mt-4 text-[12px] leading-relaxed ${theme.body}`}>
                You can switch this later. It just changes what the {workspaceName.toLowerCase()} surfaces first.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${theme.secondaryButton}`}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!goal || isSubmitting}
                  className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.primaryButton}`}
                >
                  {isSubmitting ? 'Setting up…' : `Open my ${workspaceName.toLowerCase()}`}
                </button>
              </div>
            </Form>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
