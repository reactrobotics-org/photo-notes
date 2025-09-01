// app/api/submissions/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'
const MAX_DESC = 500

export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
      // @ts-expect-error Next 15 cookies typing mismatch
      cookies: () => cookieStore,
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json().catch(() => null)
    const image_path = String(body?.image_path || '').trim()
    const description = String(body?.description || '').trim()

    if (!image_path) return NextResponse.json({ error: 'Missing image_path' }, { status: 400 })
    if (!description) return NextResponse.json({ error: 'Missing description' }, { status: 400 })
    if (description.length > MAX_DESC) {
      return NextResponse.json({ error: `Description exceeds ${MAX_DESC} characters` }, { status: 400 })
    }

    const { error } = await supabase
      .from('submissions')
      .insert({ user_id: user.id, image_path, description })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unhandled error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
