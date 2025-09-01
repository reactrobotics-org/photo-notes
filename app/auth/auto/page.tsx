// app/auth/auto/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AutoSignIn() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const run = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        window.location.replace('/my')
        return
      }
      if (!started) {
        setStarted(true)
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${location.origin}/auth/callback` }
        })
      }
    }
    run()
  }, [started])

  return <main className="p-6">Redirecting to Google…</main>
}
