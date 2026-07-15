import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { ClientOnly } from '~/components/ClientOnly';
import { SITE_CONFIG } from '~/constants/site';
import { getUserFromRequest } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (await getUserFromRequest(request)) return redirect('/library');
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
          if (d?.authenticated) navigate('/library', { replace: true });
        })
        .catch(() => undefined);
    } catch {
      /* optional storage */
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
          ? 'Development copy: use the code below.'
          : 'A reading-room code is on its way.'
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
        /* optional */
      }
      try {
        await fetch('/api/auth/sync-cookie', { method: 'POST' });
      } catch {
        /* best effort */
      }
      navigate('/library');
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
      <main className="min-h-screen bg-[#f3efe7] px-5 py-8 text-[#281f25] sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between border-y-2 border-[#281f25] py-3 text-xs uppercase">
          <Link to="/">← PromptVault</Link>
          <span>Archive access / 01</span>
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-md items-center">
          <section className="w-full border-2 border-[#281f25] bg-[#f3efe7] p-6 sm:p-8">
            <p className="font-serif text-lg italic text-[#b51f55]">{config.eyebrow}</p>
            <h1 className="mt-5 font-serif text-4xl leading-tight">Open your member shelf.</h1>
            <p className="mt-4 text-sm leading-6 text-[#675a62]">
              {step === 'email' ? config.emailHint : `Use the code sent to ${email}.`}
            </p>
            {error ? (
              <p
                role="alert"
                className="mt-6 border border-[#b51f55] bg-[#ead5dd] px-4 py-3 text-sm text-[#8b173f]"
              >
                {error}
              </p>
            ) : null}
            {step === 'email' ? (
              <form onSubmit={sendCode} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs uppercase">
                    {config.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={config.emailPlaceholder}
                    className="w-full rounded-md border-2 border-[#281f25] bg-transparent px-4 py-3 outline-none focus:border-[#b51f55]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#b51f55] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Request archive code'}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyCode} className="mt-8 space-y-5">
                {info ? <p className="border border-[#281f25] px-4 py-3 text-sm">{info}</p> : null}
                {devCode ? (
                  <p className="bg-[#e2c9d3] px-4 py-3 font-mono text-sm">
                    DEV CODE / <strong>{devCode}</strong>
                  </p>
                ) : null}
                <div>
                  <label htmlFor="code" className="mb-2 block text-xs uppercase">
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
                    className="w-full rounded-md border-2 border-[#281f25] bg-transparent px-4 py-3 text-center font-mono text-2xl outline-none focus:border-[#b51f55]"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-md bg-[#b51f55] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {loading ? 'Opening…' : 'Enter the vault'}
                </button>
                <div className="flex justify-between text-sm text-[#675a62]">
                  <button type="button" onClick={resetEmail}>
                    Change email
                  </button>
                  <button type="button" onClick={sendCode}>
                    Send again
                  </button>
                </div>
              </form>
            )}
            <div className="mt-8 flex gap-5 border-t border-[#281f25] pt-5 text-xs uppercase">
              <Link to="/pricing">Membership</Link>
              <Link to="/">Index</Link>
            </div>
          </section>
        </div>
      </main>
    </ClientOnly>
  );
}
