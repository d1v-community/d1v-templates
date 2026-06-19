import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { SceneBackground } from '~/components/sections/SceneBackground';
import { ThemeToggleButton } from '~/components/ThemeToggleButton';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getIndustryHome, safeReturnTo } from '~/lib/auth-flow';
import { getUserFromRequest } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (user) {
    const url = new URL(request.url);
    const returnTo = safeReturnTo(url.searchParams.get('returnTo'), getIndustryHome());
    return redirect(returnTo);
  }
  const url = new URL(request.url);
  const industryHome = getIndustryHome();
  return json({
    returnTo: safeReturnTo(url.searchParams.get('returnTo'), industryHome),
    industryHome,
  });
}

type LoaderData = ReturnType<typeof useLoaderData<typeof loader>>;

export default function Login() {
  const navigate = useNavigate();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const loginConfig = SITE_CONFIG.login;
  const { returnTo, industryHome } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'email' | 'code' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [info, setInfo] = useState('');

  // If we're already authenticated client-side (token in localStorage), bounce.
  useEffect(() => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;
      fetch('/api/auth/me')
        .then(response => (response.ok ? response.json() : null))
        .then(data => {
          if (data?.authenticated) {
            const target = safeReturnTo(searchParams.get('returnTo'), industryHome);
            navigate(target, { replace: true });
          }
        })
        .catch(() => undefined);
    } catch {
      // ignore
    }
  }, [navigate, searchParams, industryHome]);

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to send code');

      if (data.dev && data.code) {
        setDevCode(String(data.code));
        setInfo('Development mode — code shown below.');
      } else {
        setDevCode(null);
        setInfo('Code sent. Check your inbox.');
      }
      setStep('code');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Invalid code');

      localStorage.setItem('auth-token', data.token);

      try {
        if (typeof document.hasStorageAccess === 'function') {
          const hasAccess = await document.hasStorageAccess();
          if (!hasAccess && typeof document.requestStorageAccess === 'function') {
            await document.requestStorageAccess();
          }
        }
      } catch {
        // ignore SAA failures
      }

      try {
        await fetch('/api/auth/sync-cookie', { method: 'POST' });
      } catch {
        // noop
      }

      // Brief "✓ Welcome back" state before redirect, so the transition doesn't feel like a jump.
      setStep('done');
      const target = safeReturnTo(searchParams.get('returnTo'), industryHome);
      // First-time login: route through /?welcome=1 so _index can hand the user off to /onboarding.
      let isFirstLogin = false;
      try {
        isFirstLogin = localStorage.getItem('d1v-first-login') === '1';
        if (isFirstLogin) localStorage.removeItem('d1v-first-login');
      } catch {
        // ignore
      }
      const finalTarget = isFirstLogin && !returnTo ? `/?welcome=1` : target;
      window.setTimeout(() => {
        navigate(finalTarget, { replace: true });
      }, 480);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError('');
    setInfo('');
    setDevCode(null);
  };

  // First-time login hints go through onboarding; the entry flag is set right before we leave.
  useEffect(() => {
    if (step === 'done') return;
    // If the URL didn't include a returnTo, the user is likely a first-time signup.
    // We flag that here so the destination page can offer onboarding.
    if (!returnTo) {
      try { localStorage.setItem('d1v-first-login', '1'); } catch { /* ignore */ }
    }
  }, [step, returnTo]);

  return (
    <div className={`relative min-h-screen overflow-hidden ${theme.heroShell}`}>
      <SceneBackground kind={SITE_CONFIG.home.industry.sceneKind} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2">
          <Link to="/" className={`text-base font-semibold tracking-tight transition-colors ${theme.logo}`}>
            {APP_TITLE}
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className={`text-sm font-medium transition ${theme.navLink}`}>
              {SITE_CONFIG.navigation.pricingLabel}
            </Link>
            <ThemeToggleButton />
          </div>
        </div>

        <div className="flex flex-1 items-center py-6 sm:py-8">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-end">
            <section className="max-w-3xl space-y-6">
              <div className={`inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}`}>
                {loginConfig.eyebrow}
              </div>

              <div className="space-y-3">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${theme.subEyebrow}`}>
                  {APP_TITLE} · {SITE_CONFIG.home.industry.workspaceName}
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] sm:text-5xl lg:text-[3.4rem] lg:leading-[1]">
                  {returnTo ? 'Continue where you were.' : loginConfig.title}
                </h1>
                <p className={`max-w-xl text-sm leading-relaxed sm:text-base ${theme.body}`}>
                  {returnTo
                    ? 'Sign in to keep the workflow you started.'
                    : SITE_CONFIG.home.industry.greeting}
                </p>
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {loginConfig.trustPoints.map(point => (
                  <li
                    key={point}
                    className={`flex items-start gap-2 rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed ${theme.metricShell}`}
                  >
                    <span className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-semibold ${theme.eyebrow}`}>
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`relative rounded-[2rem] p-6 sm:p-7 ${theme.showcaseShell}`}>
              <div className="space-y-2">
                <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.eyebrow}`}>
                  Secure login
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                  {step === 'done' ? 'Welcome back' : 'Continue'}
                </h2>
                <p className={`text-sm uppercase tracking-[0.2em] ${theme.body}`}>
                  {step === 'email'
                    ? 'Email'
                    : step === 'code'
                      ? 'Verification code'
                      : 'Signing you in…'}
                </p>
              </div>

              {error ? (
                <div
                  role="alert"
                  className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 motion-safe:animate-[shake_0.3s_ease-in-out]"
                >
                  {error}
                </div>
              ) : null}

              {step === 'done' ? (
                <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${theme.eyebrow}`}>
                    ✓
                  </span>
                  <p className={`text-sm leading-relaxed ${theme.sectionText}`}>
                    {`Taking you back${returnTo ? '' : ` to ${SITE_CONFIG.home.industry.workspaceName.toLowerCase()}`}…`}
                  </p>
                </div>
              ) : null}

              {step === 'email' ? (
                <form onSubmit={handleSendCode} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] opacity-70"
                    >
                      {loginConfig.emailLabel}
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      required
                      autoFocus
                      placeholder={loginConfig.emailPlaceholder}
                      className={`w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${theme.assistantInput}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.assistantAction}`}
                  >
                    {loading ? 'Sending…' : 'Send code'}
                  </button>

                  <p className={`text-[12px] leading-relaxed ${theme.body}`}>{loginConfig.emailHint}</p>
                </form>
              ) : null}

              {step === 'code' ? (
                <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
                  <div className={`rounded-[1.5rem] p-4 ${theme.metricShell}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">Inbox</p>
                    <p className="mt-2 text-sm font-semibold">{email}</p>
                  </div>

                  {info ? (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
                      {info}
                    </div>
                  ) : null}

                  {devCode ? (
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
                      <span className="font-mono font-semibold">{devCode}</span>
                    </div>
                  ) : null}

                  <div>
                    <label
                      htmlFor="code"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] opacity-70"
                    >
                      Code
                    </label>
                    <input
                      id="code"
                      type="text"
                      value={code}
                      onChange={event => setCode(event.target.value)}
                      required
                      autoFocus
                      placeholder="123456"
                      maxLength={6}
                      className={`w-full rounded-2xl border px-4 py-3 text-center font-mono text-2xl tracking-[0.45em] outline-none transition ${theme.assistantInput}`}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${theme.secondaryButton}`}
                    >
                      Change email
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.assistantAction}`}
                    >
                      {loading ? 'Verifying…' : 'Verify'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendCode}
                    className={`w-full text-sm font-medium transition ${theme.navLink}`}
                  >
                    Send again
                  </button>
                </form>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <Link to="/" className={`transition ${theme.navLink}`}>
                  Home
                </Link>
                <Link to="/pricing" className={`transition ${theme.navLink}`}>
                  {SITE_CONFIG.navigation.pricingLabel}
                </Link>
                {returnTo ? (
                  <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.subEyebrow}`}>
                    <span aria-hidden>↩</span> returning to {returnTo}
                  </span>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
