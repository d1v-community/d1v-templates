import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';
export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/courses');
  return null;
}
export default function Login() {
  const navigate = useNavigate();
  const config = SITE_CONFIG.login;
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [info, setInfo] = useState('');
  useEffect(() => {
    try {
      if (!localStorage.getItem('auth-token')) return;
      fetch('/api/auth/me')
        .then(r => r.json())
        .then(d => {
          if (d?.authenticated) navigate('/courses', { replace: true });
        })
        .catch(() => undefined);
    } catch {
      /* optional */
    }
  }, [navigate]);
  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || 'Failed to send code');
      setDevCode(d.dev && d.code ? String(d.code) : null);
      setInfo(
        d.dev && d.code
          ? 'Development learning code generated.'
          : 'Learning code sent to your inbox.'
      );
      setStep('code');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error || 'Invalid code');
      localStorage.setItem('auth-token', d.token);
      try {
        if (
          typeof document.hasStorageAccess === 'function' &&
          !(await document.hasStorageAccess()) &&
          typeof document.requestStorageAccess === 'function'
        )
          await document.requestStorageAccess();
      } catch {
        /* optional */
      }
      try {
        await fetch('/api/auth/sync-cookie', { method: 'POST' });
      } catch {
        /* best effort */
      }
      navigate('/courses');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setStep('email');
    setCode('');
    setError('');
    setInfo('');
    setDevCode(null);
  };
  return (
    <ClientOnly>
      <main className="min-h-screen bg-[#fbfbf8] px-5 py-8 text-[#302f2b] sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-between border-b border-[#deddd8] pb-4 text-xs text-[#77746d]">
          <Link to="/">← LessonLoop</Link>
          <span>Study note / access</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-md items-center">
          <section className="w-full border border-[#deddd8] bg-white p-6 sm:p-9">
            <p className="font-serif text-lg italic text-[#b44b34]">{config.eyebrow}</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight">Continue where you left off.</h1>
            <p className="mt-4 text-sm leading-7 text-[#77746d]">
              {step === 'email'
                ? config.emailHint
                : `Enter the quiet six-digit code sent to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border border-[#b44b34] bg-[#fff5f1] px-4 py-3 text-sm text-[#943a27]"
              >
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs text-[#77746d]">
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border border-[#bcbab3] bg-[#fbfbf8] px-4 py-3 outline-none focus:border-[#b44b34]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#302f2b] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send learning code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? (
                  <p className="border-y border-[#deddd8] px-4 py-3 text-sm text-[#77746d]">
                    {info}
                  </p>
                ) : null}
                {devCode ? (
                  <p className="bg-[#f4e9e4] px-4 py-3 font-mono text-sm">
                    DEV / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label htmlFor="code" className="mb-2 block text-xs text-[#77746d]">
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-md border border-[#bcbab3] bg-[#fbfbf8] px-4 py-3 text-center font-mono text-2xl outline-none focus:border-[#b44b34]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#302f2b] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'Checking…' : 'Return to learning'}
                </button>
                <div className="flex justify-between text-sm text-[#77746d]">
                  <button type="button" onClick={reset}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Send again
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-[#deddd8] pt-5 text-xs text-[#77746d]">
              <Link to="/pricing">Membership</Link>
              <Link to="/">Course library</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
