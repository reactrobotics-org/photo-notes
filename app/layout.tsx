// app/layout.tsx
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import UserBar from '../components/UserBar'
import type { ReactNode } from 'react'
// If you have global styles, keep this import:
// import './globals.css'

const ADMIN_EMAIL = 'dale@reactrobotics.org'

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Server-side: fetch the current user
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  // Try to enrich from profiles if present
  let displayName: string | null | undefined = user?.user_metadata?.full_name || null
  let avatarUrl: string | null | undefined = user?.user_metadata?.avatar_url || null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle()
    displayName = profile?.display_name || displayName || user.email
    avatarUrl = profile?.avatar_url || avatarUrl || null
  }

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL

  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/80 backdrop-blur border-b">
          <div className="mx-auto max-w-5xl h-14 px-4 flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link href="/" className="font-bold px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900">
                Photo Notes
              </Link>
              {user && (
                <>
                  <Link href="/new" className="px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900">New</Link>
                  <Link href="/my" className="px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900">My</Link>
                  <Link href="/scoreboard" className="px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900">Scoreboard</Link>
                  {isAdmin && (
                    <Link href="/admin/teams" className="px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900">
                      Teams
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="ml-auto">
              {user ? (
                <UserBar email={user.email} displayName={displayName} avatarUrl={avatarUrl} />
              ) : (
                <Link href="/(auth)/login" className="border rounded-xl px-3 py-1">Sign in</Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  )
}
