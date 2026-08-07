import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { getUserFromRequest } from '~/utils/auth.server';

const APP_H5_PATH = '/app';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromRequest(request);
  if (user) return redirect(APP_H5_PATH);
  return null;
}

export default function Login() {
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
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => (r.ok ? r.json() : null))
        .then(d => {
          if (d?.authenticated) window.location.assign(APP_H5_PATH);
        })
        .catch(() => {});
    } catch {
      // ignore localStorage access issues
    }
  }, []);

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

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
        data.dev ? 'Development mode: code returned in API response.' : 'Verification code sent.'
      );
      setStep('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      try {
        if (
          typeof document.hasStorageAccess === 'function' &&
          !(await document.hasStorageAccess()) &&
          typeof document.requestStorageAccess === 'function'
        ) {
          await document.requestStorageAccess();
        }
      } catch {
        // Bearer auth remains available when Storage Access is denied.
      }
      const response = await fetch('/api/auth/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!data.success || !data.token) throw new Error(data.error || 'Invalid code');

      localStorage.setItem('auth-token', data.token);

      await fetch('/api/auth/sync-cookie', {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: `Bearer ${data.token}` },
      }).catch(() => {});

      window.location.assign(APP_H5_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.22),_transparent_35%),linear-gradient(180deg,#111827_0%,#020617_100%)] px-6 py-16 text-stone-50">
      <div className="mx-auto max-w-md rounded-[2rem] border border-stone-800 bg-stone-950/85 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.28em] text-orange-300">Web Login</p>
          <h1 className="mt-3 text-3xl font-semibold">Shared email auth</h1>
          <p className="mt-3 text-sm leading-6 text-stone-400">
            Use this screen as the reference implementation for the Taro and Flutter clients.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {step === 'email' ? (
          <form className="space-y-5" onSubmit={handleSendCode}>
            <div>
              <label
                className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-stone-400"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                placeholder="name@example.com"
                className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none transition focus:border-orange-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-400 py-3 font-medium text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send code'}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleVerifyCode}>
            <div>
              <p className="text-sm text-stone-400">Verification code sent to</p>
              <p className="mt-2 font-medium">{email}</p>
            </div>

            {info ? (
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
                {info}
              </div>
            ) : null}

            {devCode ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <p className="mb-1 font-medium">Development code</p>
                <p>
                  <span className="font-mono font-semibold">{devCode}</span>
                </p>
              </div>
            ) : null}

            <div>
              <label
                className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-stone-400"
                htmlFor="code"
              >
                Code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                value={code}
                onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                placeholder="6 digits"
                className="w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 outline-none transition focus:border-orange-400"
              />
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-[1fr_auto]">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-400 py-3 font-medium text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setDevCode(null);
                  setInfo('');
                }}
                className="w-full rounded-xl border border-stone-700 px-4 py-3 text-sm font-medium text-stone-200 sm:w-auto"
              >
                Edit email
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
