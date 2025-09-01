'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Header() {
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    const supabase = supabaseBrowser()
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    location.href = '/(auth)/login'
  }
  return (
    <header className="p-4 border-b flex items-center gap-4">
      <Link href="/">Home</Link>
      <Link href="/new">New Submission</Link>
      <Link href="/my">My Submissions</Link>
      <div className="ml-auto">
        {email ? (
          <button onClick={logout} className="rounded-xl px-3 py-1 border">Sign out</button>
        ) : (
          <Link href="/(auth)/login" className="rounded-xl px-3 py-1 border">Sign in</Link>
        )}
      </div>
    </header>
  )
}
