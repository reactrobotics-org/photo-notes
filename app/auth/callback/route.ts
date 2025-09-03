// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  // Finalize the Supabase session cookies
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: async () => cookieStore })
  await supabase.auth.getUser()

  const url = new URL(req.url)
  const next = url.searchParams.get('next') || '/my'
  return NextResponse.redirect(new URL(next, url.origin))
}
