import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWaitlistConfirmationEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const { error } = await supabaseAdmin.from('waitlist').insert({ email })
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'already_exists' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  try { await sendWaitlistConfirmationEmail(email) } catch { /* non-fatal */ }
  return NextResponse.json({ success: true })
}
