// app/(auth)/login/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { supabaseBrowser } from '@/lib/supabaseClient'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

export default function LoginPage() {
  const sb = supabaseBrowser()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const widgetRef = useRef<HTMLDivElement | null>(null)

  // Render Turnstile widget after script loads
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
    // if script already present
    render()
    // re-render on visibility change (hot reload)
    document.addEventListener('visibilitychange', render, { once: true })
    return () => document.removeEventListener('visibilitychange', render)
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) { setError('Please complete the verification.'); return }
    if (!email || !password) { setError('Email and password are required.'); return }

    setLoading(true)
    try {
      // Verify Turnstile server-side first
      const verify = await fetch('/api/auth/turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const vr = await verify.json()
      if (!verify.ok || !vr?.success) {
        throw new Error(vr?.error || 'Verification failed')
      }

      // Now sign in with Supabase
      const { error: signErr } = await sb.auth.signInWithPassword({ email, password })
      if (signErr) throw new Error(signErr.message)

      // go to home (or /my)
      router.push('/my')
      router.refresh()
    } catch (e: any) {
      setError(e?.message || 'Login failed')
      // reset the widget
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
      <form onSubmit={onSubmit} className="w-full max-w-sm grid gap-4 border rounded-2xl p-5">
        <h1 className="text-xl font-bold">Sign in</h1>

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

        {/* Turnstile widget */}
        <div ref={widgetRef} className="my-1" />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="border rounded-xl px-4 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
