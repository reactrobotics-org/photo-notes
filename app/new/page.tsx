// app/new/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import NewSubmissionForm from '@/components/NewSubmissionForm'

export default async function NewPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return (
    <main className="p-6 grid gap-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">New Submission</h1>
      <NewSubmissionForm />
    </main>
  )
}
