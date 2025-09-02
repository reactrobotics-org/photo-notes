// app/admin/teams/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import TeamsAdmin from '../../../components/TeamsAdmin' // ← relative import (no @)

const ADMIN_EMAIL = 'dale@reactrobotics.org'

export default async function AdminTeamsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const email = (user.email || '').toLowerCase()
  const isAdmin = email === ADMIN_EMAIL

  if (!isAdmin) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Forbidden</h1>
        <p className="mt-2">You do not have access to this page.</p>
      </main>
    )
  }

  return (
    <main className="p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams Admin</h1>
        <nav className="print:hidden flex gap-2">
          <a href="/new" className="border rounded-xl px-3 py-2">New</a>
          <a href="/my" className="border rounded-xl px-3 py-2">My Submissions</a>
          <a href="/scoreboard" className="border rounded-xl px-3 py-2">Scoreboard</a>
        </nav>
      </div>
      <TeamsAdmin />
    </main>
  )
}
