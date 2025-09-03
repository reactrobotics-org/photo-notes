// app/api/debug/env/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '(unset)'
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '(unset)'
  // project ref is the subdomain before .supabase.co
  const ref = url.includes('supabase.co')
    ? url.split('https://')[1]?.split('.')[0]
    : '(n/a)'

  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: url,
    PROJECT_REF: ref,
    NEXT_PUBLIC_SUPABASE_ANON_KEY_PREFIX: anon ? anon.slice(0, 10) + '…' : '(unset)',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV || '(n/a)',
  })
}
