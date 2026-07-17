import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

const ALLOWED_TABLES = ['organisations', 'profiles', 'migrations', 'projects', 'waitlist', 'demo_requests', 'quarantine', 'activity_logs', 'email_logs', 'notifications']

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const isAdmin = cookieStore.get('migrait_admin')?.value === 'true'
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const table = req.nextUrl.searchParams.get('table')
  if (!table || !ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from(table).select('*').order('created_at', { ascending: false }).limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
