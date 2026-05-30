import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ThemeToggleButton } from '~/components/ThemeToggleButton';
import { APP_TITLE } from '~/constants/app';
import { SITE_CONFIG } from '~/constants/site';
import { getSiteThemeClasses } from '~/constants/site-theme';
import { getUserFromRequest } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (user) {
    return redirect('/');
  }
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const theme = getSiteThemeClasses(SITE_CONFIG.theme.family);
  const loginConfig = SITE_CONFIG.login;
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [info, setInfo] = useState('');

  useEffect(() => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      fetch('/api/auth/me')
        .then(response => response.json())
        .then(data => {
          if (data?.authenticated) {
            navigate('/', { replace: true });
          }
        })
        .catch(() => {
          // noop: 静默处理网络错误
        });
    } catch {
      // noop: 静默处理初始化错误
    }
  }, [navigate]);

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to send code');
      }

      if (data.dev && data.code) {
        setDevCode(String(data.code));
        setInfo('Development mode');
      } else {
        setDevCode(null);
        setInfo('Code sent');
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
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Invalid code');
      }

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
        // noop: 静默处理同步 cookie 失败
      }

      navigate('/');
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

  return (
    <div className={`relative min-h-screen overflow-hidden ${theme.heroShell}`}>
      <div className={`absolute inset-0 ${theme.heroGlow}`} />
      <div className="absolute inset-x-0 top-0 h-36 bg-white/10 blur-3xl dark:bg-white/5" />
      <div className="absolute -left-20 top-20 h-44 w-44 rounded-full bg-white/12 blur-3xl motion-safe:animate-pulse dark:bg-white/8" />
      <div
        className="absolute -right-10 bottom-16 h-52 w-52 rounded-full bg-white/12 blur-3xl motion-safe:animate-pulse dark:bg-white/8"
        style={{ animationDelay: '1000ms' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2">
          <Link
            to="/"
            className={`text-base font-semibold tracking-tight transition-colors ${theme.logo}`}
          >
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
              <div
                className={`inline-flex rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}`}
              >
                {loginConfig.eyebrow}
              </div>

              <div className="space-y-3">
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${theme.subEyebrow}`}
                >
                  {APP_TITLE}
                </p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] sm:text-5xl lg:text-[4.2rem] lg:leading-[0.94]">
                  {loginConfig.title}
                </h1>
              </div>

              <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.22em]">
                <span className={`rounded-full px-3 py-1.5 ${theme.metricShell}`}>
                  {loginConfig.audience}
                </span>
                <span className={`rounded-full px-3 py-1.5 ${theme.metricShell}`}>
                  {SITE_CONFIG.templateSurface.badge}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {SITE_CONFIG.heroMetrics.slice(0, 3).map(metric => (
                  <div
                    key={metric.label}
                    className={`rounded-[1.6rem] p-4 transition duration-300 motion-safe:hover:-translate-y-1 ${theme.metricShell}`}
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] opacity-60">
                      {metric.label}
                    </p>
                    <p
                      className={`mt-3 text-2xl font-semibold tracking-[-0.05em] ${theme.metricValue}`}
                    >
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`rounded-[2rem] p-6 sm:p-7 ${theme.showcaseShell}`}>
              <div className="space-y-2">
                <div
                  className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${theme.eyebrow}`}
                >
                  Secure login
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Continue</h2>
                <p className={`text-sm uppercase tracking-[0.2em] ${theme.body}`}>
                  {step === 'email' ? 'Email' : 'Verification code'}
                </p>
              </div>

              {error ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
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
                      placeholder={loginConfig.emailPlaceholder}
                      className={`w-full rounded-2xl border px-4 py-3 text-base outline-none transition ${theme.assistantInput}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.assistantAction}`}
                  >
                    {loading ? 'Sending...' : 'Send code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
                  <div className={`rounded-[1.5rem] p-4 ${theme.metricShell}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                      Inbox
                    </p>
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
                      {loading ? 'Verifying...' : 'Verify'}
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
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <Link to="/" className={`transition ${theme.navLink}`}>
                  Home
                </Link>
                <Link to="/pricing" className={`transition ${theme.navLink}`}>
                  Pricing
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
