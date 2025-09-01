// app/api/submissions/list/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = Math.max(1, Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 50))
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10))

    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
      // @ts-expect-error Next 15 cookies typing mismatch
      cookies: () => cookieStore,
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: rows, error, count } = await supabase
      .from('submissions')
      .select('id,image_path,description,created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const paths = (rows ?? []).map(r => r.image_path)
    const { data: signedData } = await supabase.storage.from('photos').createSignedUrls(paths, 3600)
    const map = new Map<string, string>()
    for (const s of signedData ?? []) if (s.path && s.signedUrl) map.set(s.path, s.signedUrl)

    const out = (rows ?? []).map(r => ({
      id: r.id,
      description: r.description,
      createdAt: r.created_at,
      imageUrl: map.get(r.image_path) || '',
    }))

    const total = count ?? out.length
    const nextOffset = offset + out.length
    const hasMore = nextOffset < total

    return NextResponse.json({
      rows: out,
      nextOffset: hasMore ? nextOffset : null,
      total,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unhandled error' }, { status: 500 })
  }
}
