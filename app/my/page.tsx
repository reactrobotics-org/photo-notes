// app/my/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import PrintButton from '@/components/PrintButton'
import MySubmissionsList, { type SubmissionOut } from '@/components/MySubmissionsList'

type Row = { id: string; image_path: string; description: string; created_at: string }

const PAGE_SIZE = 10

export default async function MySubmissionsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data, error, count } = await supabase
    .from('submissions')
    .select('id,image_path,description,created_at', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  if (error) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">My Submissions</h1>
          <PrintButton />
        </div>
        <p className="text-red-600 mt-2">Error: {error.message}</p>
      </main>
    )
  }

  const rows: Row[] = data ?? []

  const paths = rows.map(r => r.image_path)
  const urlMap = new Map<string, string>()
  if (paths.length) {
    const { data: signed } =
      await supabase.storage.from('photos').createSignedUrls(paths, 3600)
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl) urlMap.set(s.path, s.signedUrl)
    }
  }

  const initialRows: SubmissionOut[] = rows.map(r => ({
    id: r.id,
    description: r.description,
    createdAt: r.created_at,
    imageUrl: urlMap.get(r.image_path) || '',
  }))

  const total = count ?? initialRows.length
  const initialNextOffset =
    initialRows.length < PAGE_SIZE ? null : PAGE_SIZE

  return (
    <main className="p-6 grid gap-6">
      <div className="flex items-center justify-between print:mb-2">
        <h1 className="text-xl font-bold">My Submissions</h1>
        <PrintButton />
      </div>

      <MySubmissionsList
        initialRows={initialRows}
        initialNextOffset={initialNextOffset}
        pageSize={PAGE_SIZE}
      />
    </main>
  )
}
