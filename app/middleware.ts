// middleware.ts
import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const url = req.nextUrl
  const isAuthPage =
    url.pathname.startsWith('/(auth)/login') ||
    url.pathname.startsWith('/auth/callback') ||
    url.pathname.startsWith('/api/auth/turnstile')
  const isStatic =
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/images')

  if (!session && !isAuthPage && !isStatic) {
    const redirectUrl = new URL('/(auth)/login', req.url)
    redirectUrl.searchParams.set('next', url.pathname + url.search)
    return NextResponse.redirect(redirectUrl)
  }
  return res
}

export const config = { matcher: ['/((?!.*\\.).*)'] }
