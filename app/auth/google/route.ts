// app/auth/google/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const origin = new URL(request.url).origin
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` }
  })
  if (error) {
    return new NextResponse(`OAuth init failed: ${error.message}`, { status: 500 })
  }
  // data.url is the Google/Supabase authorize URL
  return NextResponse.redirect(data.url)
}
