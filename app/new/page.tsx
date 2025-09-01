// app/new/page.tsx
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import NewSubmissionForm from '@/components/NewSubmissionForm'

export default async function NewPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/') // your / route should kick off OAuth
  return <NewSubmissionForm userId={user.id!} />
}
