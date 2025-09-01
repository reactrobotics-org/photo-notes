'use client'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function LoginPage() {
  const signIn = async () => {
    const supabase = supabaseBrowser()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
  }
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <button onClick={signIn} className="mt-4 rounded-xl px-4 py-2 border">
        Continue with Google
      </button>
    </main>
  )
}
