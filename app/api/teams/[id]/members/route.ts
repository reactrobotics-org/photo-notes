// app/api/teams/[id]/members/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'
type Ctx = { params: Promise<{ id: string }> }

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
        cookies: async () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json().catch(() => null)
    const email = String(body?.email || '').trim()
    const role = (String(body?.role || 'member').toLowerCase() === 'owner') ? 'owner' : 'member'
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const { error } = await supabase.rpc('add_member_by_email', { p_team_id: id, p_email: email, p_role: role })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unhandled error' }, { status: 500 })
  }
}
