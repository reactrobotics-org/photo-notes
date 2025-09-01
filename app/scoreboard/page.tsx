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

  const { data, error } = await supabase.rpc('scoreboard')
  const rowsTyped = (data ?? []) as ScoreRow[]

  if (error) {
    return (
      <main className="min-h-[60vh] p-6 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <h1 className="text-2xl font-bold">Scoreboard</h1>
        <p className="mt-3 text-red-600 dark:text-red-400">Error: {error.message}</p>
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
    <main className="min-h-[60vh] p-6 bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scoreboard</h1>
        <nav className="print:hidden flex gap-2">
          <a href="/new" className="border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2">New</a>
          <a href="/my" className="border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2">My Submissions</a>
        </nav>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6">No submissions yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[720px] w-full border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
            <thead className="bg-neutral-100 dark:bg-neutral-800">
              <tr className="text-left">
                <th className="p-3 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 w-20">Rank</th>
                <th className="p-3 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100">User</th>
                <th className="p-3 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 w-[40%]">Email</th>
                <th className="p-3 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 w-40">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="odd:bg-white even:bg-neutral-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
                >
                  <td className="p-3 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {r.rank}
                  </td>
                  <td className="p-3 border-b border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100">
                    <div className="flex items-center gap-3">
                      {r.avatar ? (
                        // Using <img> keeps it simple; add next/image later if you want optimization
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 grid place-items-center text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100">
                          {r.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                    <a
                      className="hover:underline text-blue-700 dark:text-blue-300"
                      href={`mailto:${r.email}`}
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="p-3 border-b border-neutral-200 dark:border-neutral-700 font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                    {r.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
