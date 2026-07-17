import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { runMigrationEngine } from '@/lib/migration-engine'

export async function POST(req: NextRequest) {
  // Get auth token from request
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { project_id } = await req.json()
  const { data: profile } = await supabaseAdmin.from('profiles').select('organisation_id').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: migration, error } = await supabaseAdmin.from('migrations').insert({
    project_id,
    organisation_id: profile.organisation_id,
    status: 'pending',
    total_records: 0,
    processed_records: 0,
    successful_records: 0,
    failed_records: 0
  }).select().single()

  if (error || !migration) return NextResponse.json({ error: 'Failed to create migration' }, { status: 500 })

  await supabaseAdmin.from('activity_logs').insert({
    organisation_id: profile.organisation_id,
    user_id: user.id,
    action: 'migration_started',
    entity_type: 'migration',
    entity_id: migration.id,
    metadata: { project_id }
  }).maybeSingle()

  // Fire and forget
  runMigrationEngine(migration.id, project_id, profile.organisation_id)

  return NextResponse.json({ migration_id: migration.id })
}
