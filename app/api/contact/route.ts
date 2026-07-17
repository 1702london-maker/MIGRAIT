import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendDemoRequestConfirmationEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (!body.full_name || !body.email || !body.company) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('demo_requests').insert(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try { await sendDemoRequestConfirmationEmail(body.email, body.full_name) } catch { /* non-fatal */ }
  return NextResponse.json({ success: true })
}
