// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    // ✅ This exchanges the code and sets the sb-* session cookies on your domain
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Send them back into the app (your / page can redirect to /my)
  return NextResponse.redirect(new URL(next, url))
}
