// app/(auth)/login/page.tsx
'use client'

import { supabaseBrowser } from '@/lib/supabaseClient'

export default function LoginPage() {
  const supabase = supabaseBrowser()

  const signInGoogle = async () => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL
          ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001'))

    console.log('[login] redirectTo:', `${origin}/auth/callback`)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="p-6 grid place-items-center min-h-[60vh]">
      <button onClick={signInGoogle} className="border rounded-xl px-4 py-2">
        Sign in with Google
      </button>
    </main>
  )
}
