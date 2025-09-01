// app/api/submissions/[id]/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'
const MAX_DESC = 500

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
      // @ts-expect-error Next 15 cookies typing mismatch
      cookies: () => cookieStore,
    })

    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 })
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json().catch(() => null)
    const description = String(body?.description || '').trim()
    if (!description) return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    if (description.length > MAX_DESC) return NextResponse.json({ error: `Max ${MAX_DESC} characters` }, { status: 400 })

    const { data, error } = await supabase
      .from('submissions')
      .update({ description })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unhandled error (PATCH)'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
      // @ts-expect-error Next 15 cookies typing mismatch
      cookies: () => cookieStore,
    })

    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 })
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: row, error: fetchErr } = await supabase
      .from('submissions')
      .select('id, user_id, image_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 })
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { error: storageErr } = await supabase.storage.from('photos').remove([row.image_path])
    if (storageErr) return NextResponse.json({ error: `Storage delete failed: ${storageErr.message}` }, { status: 400 })

    const { error: dbErr } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unhandled error (DELETE)'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
