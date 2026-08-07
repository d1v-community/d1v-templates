import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/portal');
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
          if (d?.authenticated) navigate('/portal', { replace: true });
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
          ? 'Development invitation code generated.'
          : 'Your private access code has been sent.'
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
      navigate('/portal');
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
      <main className="min-h-screen bg-[#fbfaf8] px-5 py-8 text-[#291b20] sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-between border-b border-[#cfc7c8] pb-4 text-xs uppercase text-[#8b2f43]">
          <Link to="/">← ClientRoom</Link>
          <span>Private service suite</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-md items-center">
          <section className="w-full border border-[#d8d2cf] bg-white p-6 shadow-[0_24px_70px_rgba(41,27,32,0.09)] sm:p-9">
            <p className="font-serif text-lg italic text-[#8b2f43]">{config.eyebrow}</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight">
              Welcome back to your client room.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#6e6266]">
              {step === 'email' ? config.emailHint : `Enter the private code sent to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border border-[#8b2f43] bg-[#f7e9ec] px-4 py-3 text-sm text-[#7a2437]"
              >
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs uppercase text-[#8b2f43]">
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border border-[#cfc7c8] bg-[#fbfaf8] px-4 py-3 outline-none focus:border-[#8b2f43]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#8b2f43] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send private access code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? (
                  <p className="border border-[#d8d2cf] px-4 py-3 text-sm text-[#6e6266]">{info}</p>
                ) : null}
                {devCode ? (
                  <p className="bg-[#f2e9eb] px-4 py-3 font-mono text-sm">
                    DEV CODE / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label htmlFor="code" className="mb-2 block text-xs uppercase text-[#8b2f43]">
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
                    className="w-full rounded-md border border-[#cfc7c8] bg-[#fbfaf8] px-4 py-3 text-center font-mono text-2xl outline-none focus:border-[#8b2f43]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#8b2f43] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'Opening…' : 'Enter client room'}
                </button>
                <div className="flex justify-between text-sm text-[#6e6266]">
                  <button type="button" onClick={reset}>
                    Use another email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Send again
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-[#d8d2cf] pt-5 text-xs uppercase text-[#8b2f43]">
              <Link to="/pricing">Service plans</Link>
              <Link to="/">Home</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
