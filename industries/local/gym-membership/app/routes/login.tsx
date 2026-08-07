import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';
export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/membership');
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
          if (d?.authenticated) navigate('/membership', { replace: true });
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
        d.dev && d.code ? 'Development member code generated.' : 'Member code sent to your inbox.'
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
      navigate('/membership');
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
      <main className="min-h-screen bg-[#11110f] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-between border-y border-white/50 py-3 text-xs font-black uppercase">
          <Link to="/">← FlexPass</Link>
          <span className="text-[#ff7a42]">Member checkpoint</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-md items-center">
          <section className="w-full border border-white/30 bg-[#181815] p-6 sm:p-8">
            <p className="inline-block bg-[#ff5a1f] px-2 py-1 text-xs font-black uppercase">
              {config.eyebrow}
            </p>
            <h1 className="mt-6 text-4xl font-black uppercase leading-[0.94]">
              Your next session starts here.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/65">
              {step === 'email' ? config.emailHint : `Enter the member code sent to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border border-[#ff5a1f] bg-[#361c14] px-4 py-3 text-sm text-[#ffb49a]"
              >
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-black uppercase text-[#ff7a42]"
                  >
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border border-white/35 bg-black px-4 py-3 text-white outline-none focus:border-[#ff5a1f]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#ff5a1f] px-4 py-3 text-sm font-black uppercase text-white disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send member code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? (
                  <p className="border-y border-white/30 px-4 py-3 text-sm text-white/70">{info}</p>
                ) : null}
                {devCode ? (
                  <p className="bg-[#ff5a1f] px-4 py-3 font-mono text-sm text-white">
                    DEV / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label
                    htmlFor="code"
                    className="mb-2 block text-xs font-black uppercase text-[#ff7a42]"
                  >
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
                    className="w-full rounded-md border border-white/35 bg-black px-4 py-3 text-center font-mono text-2xl text-white outline-none focus:border-[#ff5a1f]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#ff5a1f] px-4 py-3 text-sm font-black uppercase text-white disabled:opacity-50"
                >
                  {loading ? 'Checking…' : 'Activate member access'}
                </button>
                <div className="flex justify-between text-sm text-white/60">
                  <button type="button" onClick={reset}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Resend
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-white/30 pt-5 text-xs font-black uppercase text-white/60">
              <Link to="/pricing">Join</Link>
              <Link to="/">Training floor</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
