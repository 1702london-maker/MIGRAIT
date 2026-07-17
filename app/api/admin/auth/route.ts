import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'migrait_admin_2026'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set('migrait_admin', 'true', { httpOnly: true, sameSite: 'strict' as const, maxAge: 60 * 60 * 8 })
  return res
}

export async function GET() {
  const cookieStore = cookies()
  const isAdmin = cookieStore.get('migrait_admin')?.value === 'true'
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true })
}
