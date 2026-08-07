import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';
export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/issues');
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
          if (d?.authenticated) navigate('/issues', { replace: true });
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
          ? 'Development subscriber code generated.'
          : 'Subscriber code sent to your inbox.'
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
      navigate('/issues');
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
      <main className="min-h-screen bg-[#faf9f5] px-5 py-7 text-black sm:px-8">
        <div className="mx-auto max-w-6xl border-y-4 border-black py-3 text-center">
          <Link to="/" className="font-serif text-4xl font-bold">
            BriefClub
          </Link>
          <div className="mt-3 flex justify-between border-t border-black pt-3 text-xs uppercase">
            <span>Subscriber desk</span>
            <span>Private edition</span>
          </div>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-md items-center">
          <section className="w-full border-b-4 border-t-4 border-black py-8">
            <p className="text-xs font-bold uppercase text-[#184ac9]">{config.eyebrow}</p>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight">
              Read the full edition.
            </h1>
            <p className="mt-4 font-serif text-base leading-7 text-[#555]">
              {step === 'email' ? config.emailHint : `Enter the subscriber code sent to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border-2 border-black px-4 py-3 text-sm text-[#b22323]"
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
                    className="w-full rounded-md border-2 border-black bg-white px-4 py-3 outline-none focus:border-[#184ac9]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#184ac9] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send subscriber code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? <p className="border-y border-black px-4 py-3 text-sm">{info}</p> : null}
                {devCode ? (
                  <p className="bg-[#e8edfb] px-4 py-3 font-mono text-sm">
                    DEV / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label htmlFor="code" className="mb-2 block text-xs font-bold uppercase">
                    Subscriber code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-center font-mono text-2xl outline-none focus:border-[#184ac9]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#184ac9] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Checking…' : 'Open full edition'}
                </button>
                <div className="flex justify-between text-sm">
                  <button type="button" onClick={reset}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Resend
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-black pt-5 text-xs font-bold uppercase">
              <Link to="/pricing">Subscribe</Link>
              <Link to="/">Front page</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
