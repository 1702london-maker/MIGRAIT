import { NextRequest, NextResponse } from 'next/server'
import { sendTeamInviteEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { email, inviterName, orgName, role, token } = await req.json()
  if (!email || !token) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  try {
    await sendTeamInviteEmail(email, inviterName || 'A teammate', orgName || 'your organisation', role || 'member', token)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
