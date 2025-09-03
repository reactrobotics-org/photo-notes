// app/(auth)/login/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { supabaseBrowser } from '@/lib/supabaseClient'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      <span className="text-xs uppercase tracking-wider opacity-70">or</span>
      <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
    </div>
  )
}

export default function LoginPage() {
  const sb = supabaseBrowser()
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/my'

  // email/password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Turnstile
  const widgetRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const render = () => {
      // @ts-ignore
      if ((window as any).turnstile && widgetRef.current && SITE_KEY) {
        // @ts-ignore
        (window as any).turnstile.render(widgetRef.current, {
          sitekey: SITE_KEY,
          theme: 'auto',
          callback: (t: string) => setToken(t),
          'timeout-callback': () => setToken(null),
          'error-callback': () => setToken(null),
        })
      }
    }
    render()
    document.addEventListener('visibilitychange', render, { once: true })
    return () => document.removeEventListener('visibilitychange', render)
  }, [])

  // Google OAuth
  const onGoogle = async () => {
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  }

  // Email + Password
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) { setError('Please complete the verification.'); return }
    if (!email || !password) { setError('Email and password are required.'); return }

    setLoading(true)
    try {
      // Verify Turnstile server-side
      const verify = await fetch('/api/auth/turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const vr = await verify.json()
      if (!verify.ok || !vr?.success) {
        throw new Error(vr?.error || 'Verification failed')
      }

      // Sign in (no signup flow)
      const { error: signErr } = await sb.auth.signInWithPassword({ email, password })
      if (signErr) throw new Error(signErr.message)

      router.push(next)
      router.refresh()
    } catch (e: any) {
      setError(e?.message || 'Login failed')
      // @ts-ignore
      (window as any).turnstile?.reset?.()
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="w-full max-w-sm grid gap-4 border rounded-2xl p-5">
        <h1 className="text-xl font-bold">Sign in</h1>

        {/* Google */}
        <button
          onClick={onGoogle}
          className="border rounded-xl px-4 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Continue with Google
        </button>

        <Divider />

        {/* Email + Password */}
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              autoComplete="username"
              className="border rounded-xl px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              className="border rounded-xl px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {/* Turnstile widget (only for email+password) */}
          <div ref={widgetRef} className="my-1" />

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="border rounded-xl px-4 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs opacity-70">
            No self-signup. If you need access or a password reset, contact the admin.
          </p>
        </form>
      </div>
    </main>
  )
}
