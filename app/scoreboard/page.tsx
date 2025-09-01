// app/scoreboard/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

type ScoreRow = {
  user_id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  submissions_count: number
}

export default async function ScoreboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Let rpc infer types; cast the data to our shape.
  const { data, error } = await supabase.rpc('scoreboard')
  const rowsTyped = (data ?? []) as ScoreRow[]

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Scoreboard</h1>
        <p className="text-red-600 mt-3">Error: {error.message}</p>
      </main>
    )
  }

  const rows = rowsTyped.map((r, i) => ({
    rank: i + 1,
    id: r.user_id,
    name: r.display_name ?? r.email ?? '(unknown)',
    email: r.email ?? '',
    avatar: r.avatar_url ?? '',
    count: Number(r.submissions_count || 0),
  }))

  return (
    <main className="p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scoreboard</h1>
        <nav className="print:hidden flex gap-2">
          <a href="/new" className="border rounded-xl px-3 py-2">New</a>
          <a href="/my" className="border rounded-xl px-3 py-2">My Submissions</a>
        </nav>
      </div>

      {rows.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3 border-b w-20">Rank</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b w-[40%]">Email</th>
                <th className="p-3 border-b w-40">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-3 border-b tabular-nums">{r.rank}</td>
                  <td className="p-3 border-b">
                    <div className="flex items-center gap-3">
                      {r.avatar ? (
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-10 h-10 rounded-full object-cover border"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full border grid place-items-center text-sm bg-gray-100">
                          {r.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b">
                    <a className="hover:underline" href={`mailto:${r.email}`}>{r.email}</a>
                  </td>
                  <td className="p-3 border-b font-semibold tabular-nums">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
