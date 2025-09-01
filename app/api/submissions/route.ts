// app/api/submissions/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  try {
    // Get the cookies store ONCE, then pass a sync getter
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
      // @ts-expect-error Next 15 cookies typing mismatch
      cookies: () => cookieStore,
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body?.image_path || !body?.description) {
      return NextResponse.json(
        { error: 'Missing image_path/description' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        image_path: body.image_path,
        description: body.description,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Unhandled error' },
      { status: 500 }
    )
  }
}
