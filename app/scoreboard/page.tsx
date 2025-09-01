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
      <main className="p-6 min-h-[60vh] bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
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
    <main className="p-6 grid gap-6 min-h-[60vh] bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scoreboard</h1>
        <nav className="print:hidden flex gap-2">
          <a href="/new" className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2">New</a>
          <a href="/my" className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2">My Submissions</a>
        </nav>
      </div>

      {rows.length === 0 ? (
        <p className="opacity-80">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <tr className="text-left">
                <th className="p-3 border-b border-gray-200 dark:border-gray-700 w-20">Rank</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700">User</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700 w-[40%]">Email</th>
                <th className="p-3 border-b border-gray-200 dark:border-gray-700 w-40">Submissions</th>
              </tr>
            </thead>
            <tbody className="text-gray-900 dark:text-gray-100">
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                >
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700 tabular-nums">{r.rank}</td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {r.avatar ? (
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 grid place-items-center text-sm bg-gray-100 dark:bg-gray-700">
                          {r.name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <a
                      className="hover:underline text-blue-600 dark:text-blue-400"
                      href={`mailto:${r.email}`}
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold tabular-nums">
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
