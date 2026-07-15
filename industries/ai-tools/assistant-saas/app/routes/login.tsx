import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/console');
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
        .then(response => response.json())
        .then(data => {
          if (data?.authenticated) navigate('/console', { replace: true });
        })
        .catch(() => undefined);
    } catch {
      /* local storage may be unavailable */
    }
  }, [navigate]);

  const sendCode = async (event: React.FormEvent) => {
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
      if (!data.success) throw new Error(data.error || 'Failed to send code');
      setDevCode(data.dev && data.code ? String(data.code) : null);
      setInfo(
        data.dev && data.code
          ? 'Development mode: use the code below.'
          : 'Verification code sent. Check your email.'
      );
      setStep('code');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
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
      if (!data.success) throw new Error(data.error || 'Invalid code');
      localStorage.setItem('auth-token', data.token);
      try {
        if (
          typeof document.hasStorageAccess === 'function' &&
          !(await document.hasStorageAccess()) &&
          typeof document.requestStorageAccess === 'function'
        )
          await document.requestStorageAccess();
      } catch {
        /* storage access is optional */
      }
      try {
        await fetch('/api/auth/sync-cookie', { method: 'POST' });
      } catch {
        /* cookie sync is best effort */
      }
      navigate('/console');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resetEmail = () => {
    setStep('email');
    setCode('');
    setError('');
    setInfo('');
    setDevCode(null);
  };

  return (
    <ClientOnly>
      <main className="min-h-screen bg-[#10120f] px-5 py-8 text-[#eef3e8] sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between border-b border-[#badf43]/40 pb-4 font-mono text-xs uppercase text-[#badf43]">
          <Link to="/">← SignalDesk</Link>
          <span>Secure operator access</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-md items-center">
          <section className="w-full border border-[#60685b] bg-[#181b16] p-6 sm:p-8">
            <div className="flex items-center justify-between font-mono text-xs text-[#badf43]">
              <span>{config.eyebrow}</span>
              <span>● READY</span>
            </div>
            <h1 className="mt-8 text-3xl font-semibold leading-tight">
              Continue to the operator console.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#aab3a4]">
              {step === 'email' ? config.emailHint : `Enter the six-digit code sent to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border border-[#ff765f] bg-[#351d18] px-4 py-3 text-sm text-[#ff9b89]"
              >
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-mono text-xs uppercase text-[#badf43]"
                  >
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border border-[#60685b] bg-[#10120f] px-4 py-3 text-white outline-none transition focus:border-[#badf43]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#badf43] px-4 py-3 text-sm font-bold text-[#10120f] disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send access code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? (
                  <p className="border border-[#60685b] px-4 py-3 text-sm text-[#c8d0c2]">{info}</p>
                ) : null}
                {devCode ? (
                  <p className="border border-[#badf43] bg-[#20271a] px-4 py-3 font-mono text-sm">
                    DEV CODE / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label
                    htmlFor="code"
                    className="mb-2 block font-mono text-xs uppercase text-[#badf43]"
                  >
                    Verification code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={event => setCode(event.target.value)}
                    placeholder="123456"
                    className="w-full rounded-md border border-[#60685b] bg-[#10120f] px-4 py-3 text-center font-mono text-2xl outline-none focus:border-[#badf43]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#badf43] px-4 py-3 text-sm font-bold text-[#10120f] disabled:opacity-50"
                >
                  {loading ? 'Verifying…' : 'Verify and continue'}
                </button>
                <div className="flex justify-between text-sm text-[#aab3a4]">
                  <button type="button" onClick={resetEmail}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Resend code
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-[#60685b] pt-5 text-xs text-[#aab3a4]">
              <Link to="/pricing">Pricing</Link>
              <Link to="/">Home</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
