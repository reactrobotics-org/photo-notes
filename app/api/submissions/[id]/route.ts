// app/api/submissions/[id]/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

// Next 15 async dynamic APIs: params must be awaited
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
    const description: string = (body?.description ?? '').toString().trim()
    if (!description) return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    if (description.length > 2000) return NextResponse.json({ error: 'Max 2000 characters' }, { status: 400 })

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
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unhandled error (PATCH)' }, { status: 500 })
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

    // 1) Fetch row (confirm ownership + get image path)
    const { data: row, error: fetchErr } = await supabase
      .from('submissions')
      .select('id, user_id, image_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 400 })
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // 2) Delete storage object
    const { error: storageErr } = await supabase.storage.from('photos').remove([row.image_path])
    if (storageErr) {
      return NextResponse.json({ error: `Storage delete failed: ${storageErr.message}` }, { status: 400 })
    }

    // 3) Delete DB row
    const { error: dbErr } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unhandled error (DELETE)' }, { status: 500 })
  }
}
