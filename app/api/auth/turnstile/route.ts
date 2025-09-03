import { NextResponse } from 'next/server'
export const runtime = 'nodejs'
type VerifyResp = { success: boolean; 'error-codes'?: string[] }

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const form = new URLSearchParams()
    form.append('secret', secret)
    form.append('response', token)

    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const data = (await r.json()) as VerifyResp
    if (!data.success) {
      return NextResponse.json({ success: false, error: data['error-codes']?.join(', ') || 'verification_failed' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'server_error' }, { status: 500 })
  }
}
