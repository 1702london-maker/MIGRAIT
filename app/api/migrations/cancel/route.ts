import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { migration_id } = await req.json()
  await supabase.from('migrations').update({ status: 'failed', error_message: 'Cancelled by user', completed_at: new Date().toISOString() }).eq('id', migration_id)
  return NextResponse.json({ ok: true })
}
