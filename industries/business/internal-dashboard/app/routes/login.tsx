import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/dashboard');
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
          if (d?.authenticated) navigate('/dashboard', { replace: true });
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
          ? 'Development access code generated.'
          : 'Access code sent to your work email.'
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
        await fetch('/api/auth/sync-cookie', { method: 'POST', credentials: 'include' });
      } catch {
        /* best effort */
      }
      navigate('/dashboard');
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
      <main className="min-h-screen bg-[#f7f8f5] px-5 py-8 text-[#17233d] sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-between border-b-2 border-[#17233d] pb-4 text-xs font-bold uppercase">
          <Link to="/">← OpsCanvas</Link>
          <span className="text-[#e05d35]">Authorized reporting</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-md items-center">
          <section className="w-full border border-[#cfd4cc] bg-white p-6 sm:p-8">
            <div className="flex justify-between text-xs font-bold uppercase">
              <span>{config.eyebrow}</span>
              <span className="text-[#e05d35]">01 / Access</span>
            </div>
            <h1 className="mt-7 text-4xl font-semibold leading-tight">
              Enter the operations report.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#657087]">
              {step === 'email' ? config.emailHint : `Confirm the code delivered to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border border-[#e05d35] bg-[#fff0ea] px-4 py-3 text-sm text-[#a43f20]"
              >
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase">
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border border-[#9da6b6] bg-[#f7f8f5] px-4 py-3 outline-none focus:border-[#e05d35]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#17233d] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send staff access code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? <p className="border border-[#cfd4cc] px-4 py-3 text-sm">{info}</p> : null}
                {devCode ? (
                  <p className="bg-[#edf0ec] px-4 py-3 font-mono text-sm">
                    DEV / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label htmlFor="code" className="mb-2 block text-xs font-bold uppercase">
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
                    className="w-full rounded-md border border-[#9da6b6] bg-[#f7f8f5] px-4 py-3 text-center font-mono text-2xl outline-none focus:border-[#e05d35]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#17233d] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Verifying…' : 'Open report'}
                </button>
                <div className="flex justify-between text-sm text-[#657087]">
                  <button type="button" onClick={reset}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Resend
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-[#cfd4cc] pt-5 text-xs uppercase text-[#657087]">
              <Link to="/pricing">Plans</Link>
              <Link to="/">Overview</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
