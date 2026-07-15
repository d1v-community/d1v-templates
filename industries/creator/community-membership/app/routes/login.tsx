import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';
export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/community');
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
          if (d?.authenticated) navigate('/community', { replace: true });
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
          ? 'Development member code generated.'
          : 'Member code sent. Check your inbox.'
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
      navigate('/community');
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
      <main className="min-h-screen bg-[#f4e9d8] px-5 py-8 text-[#19382c] sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-between border-b-2 border-[#19382c] pb-4 text-xs uppercase">
          <Link to="/">← InnerCircle</Link>
          <span>Member door / weekly</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-md items-center">
          <section className="w-full bg-[#19382c] p-6 text-[#f4e9d8] sm:p-8">
            <p className="font-serif text-lg italic text-[#f3b24a]">{config.eyebrow}</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight">Come back inside the circle.</h1>
            <p className="mt-4 text-sm leading-6 text-[#c9d1c5]">
              {step === 'email' ? config.emailHint : `Use the member code sent to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border border-[#d94b38] bg-[#41221d] px-4 py-3 text-sm text-[#ffc1b7]"
              >
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs uppercase text-[#f3b24a]">
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border border-[#8eaa9f] bg-[#10271f] px-4 py-3 text-white outline-none focus:border-[#f3b24a]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#f3b24a] px-4 py-3 text-sm font-bold text-[#19382c] disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send member code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? <p className="border border-[#8eaa9f] px-4 py-3 text-sm">{info}</p> : null}
                {devCode ? (
                  <p className="bg-[#d94b38] px-4 py-3 font-mono text-sm text-white">
                    DEV / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label htmlFor="code" className="mb-2 block text-xs uppercase text-[#f3b24a]">
                    Member code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-md border border-[#8eaa9f] bg-[#10271f] px-4 py-3 text-center font-mono text-2xl text-white outline-none focus:border-[#f3b24a]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#f3b24a] px-4 py-3 text-sm font-bold text-[#19382c] disabled:opacity-50"
                >
                  {loading ? 'Opening…' : 'Enter the circle'}
                </button>
                <div className="flex justify-between text-sm text-[#c9d1c5]">
                  <button type="button" onClick={reset}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Send again
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-[#8eaa9f] pt-5 text-xs uppercase text-[#c9d1c5]">
              <Link to="/pricing">Join</Link>
              <Link to="/">Public edition</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
