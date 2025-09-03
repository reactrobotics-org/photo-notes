// components/UserBar.tsx
'use client'

import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../lib/supabaseClient'

type Props = {
  email?: string | null
  displayName?: string | null
  avatarUrl?: string | null
}

export default function UserBar({ email, displayName, avatarUrl }: Props) {
  const router = useRouter()
  const sb = supabaseBrowser()

  const onSignOut = async () => {
    await sb.auth.signOut()
    router.push('/(auth)/login')
    router.refresh()
  }

  const label = displayName || email || 'User'
  const initial = (label?.[0] || '?').toUpperCase()

  return (
    <div className="flex items-center gap-3">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="w-8 h-8 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 grid place-items-center text-xs font-semibold">
          {initial}
        </div>
      )}
      <div className="hidden sm:block text-sm leading-tight">
        <div className="font-medium">{displayName || email}</div>
        {displayName && email && <div className="opacity-70">{email}</div>}
      </div>
      <button
        onClick={onSignOut}
        className="border rounded-xl px-3 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
      >
        Sign out
      </button>
    </div>
  )
}
