import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';
export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/downloads');
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
          if (d?.authenticated) navigate('/downloads', { replace: true });
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
          ? 'Development retrieval code generated.'
          : 'Retrieval code sent to your purchase email.'
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
      navigate('/downloads');
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
      <main className="min-h-screen bg-[#f1f0ea] px-5 py-8 text-black sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-between border-y-4 border-black py-3 text-xs font-black uppercase">
          <Link to="/">← DownloadPort</Link>
          <span>Buyer retrieval / .ZIP</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-md items-center">
          <section className="w-full border-2 border-black bg-[#f1df33] p-6 sm:p-8">
            <p className="inline-block bg-[#1746d1] px-2 py-1 text-xs font-bold uppercase text-white">
              {config.eyebrow}
            </p>
            <h1 className="mt-6 text-4xl font-black uppercase leading-[0.98]">
              Retrieve your files.
            </h1>
            <p className="mt-4 text-sm leading-6">
              {step === 'email' ? config.emailHint : `Enter the code sent to ${email}.`}
            </p>
            {error ? (
              <p role="alert" className="mt-6 border-2 border-black bg-white px-4 py-3 text-sm">
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-black uppercase">
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border-2 border-black bg-white px-4 py-3 outline-none focus:border-[#1746d1]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-black px-4 py-3 text-sm font-black uppercase text-white disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send retrieval code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? (
                  <p className="border-2 border-black bg-white px-4 py-3 text-sm">{info}</p>
                ) : null}
                {devCode ? (
                  <p className="bg-[#1746d1] px-4 py-3 font-mono text-sm text-white">
                    DEV / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label htmlFor="code" className="mb-2 block text-xs font-black uppercase">
                    Access code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-md border-2 border-black bg-white px-4 py-3 text-center font-mono text-2xl outline-none focus:border-[#1746d1]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-black px-4 py-3 text-sm font-black uppercase text-white disabled:opacity-50"
                >
                  {loading ? 'Checking…' : 'Open downloads'}
                </button>
                <div className="flex justify-between text-sm font-bold">
                  <button type="button" onClick={reset}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Resend
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t-2 border-black pt-5 text-xs font-black uppercase">
              <Link to="/pricing">Catalog</Link>
              <Link to="/">Home</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
