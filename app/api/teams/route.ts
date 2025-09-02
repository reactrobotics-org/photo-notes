// app/api/teams/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
        cookies: async () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data, error } = await supabase.rpc('my_teams')
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ teams: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unhandled error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({
        cookies: async () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json().catch(() => null)
    const name = String(body?.name || '').trim()
    if (!name) return NextResponse.json({ error: 'Team name required' }, { status: 400 })

    const { data, error } = await supabase
      .from('teams')
      .insert({ name, created_by: user.id })
      .select('id, name')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ team: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unhandled error' }, { status: 500 })
  }
}
