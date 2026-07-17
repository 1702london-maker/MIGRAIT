import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const TOTAL_RECORDS = 50000
const ENTITIES = ['Contact', 'Account', 'Opportunity', 'Activity', 'Lead']
const ERROR_REASONS = ['Invalid email format', 'Required field missing', 'Duplicate record ID', 'Date format mismatch']

export async function POST(req: NextRequest) {
  const { project_id } = await req.json()

  // Get organisation_id from project
  const { data: project } = await supabase.from('projects').select('organisation_id').eq('id', project_id).single()
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Create migration record
  const { data: migration, error } = await supabase.from('migrations').insert({
    project_id,
    organisation_id: project.organisation_id,
    status: 'pending',
    total_records: TOTAL_RECORDS,
    processed_records: 0,
    successful_records: 0,
    failed_records: 0,
    records_per_second: 0,
  }).select().single()

  if (error || !migration) return NextResponse.json({ error: 'Failed to create migration' }, { status: 500 })

  // Run validation first, then simulate engine in background
  runMigrationSimulation(migration.id, project_id)

  return NextResponse.json({ migration_id: migration.id })
}

async function runMigrationSimulation(migrationId: string, _projectId: string) {
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

  // Validation phase
  await supabase.from('migrations').update({ status: 'validating' }).eq('id', migrationId)
  await delay(2000)

  // Insert validation report
  const totalChecked = TOTAL_RECORDS
  const failed = Math.floor(totalChecked * 0.01)
  const warnings = Math.floor(totalChecked * 0.03)
  await supabase.from('validation_reports').insert({
    migration_id: migrationId,
    total_checked: totalChecked,
    passed: totalChecked - failed - warnings,
    warnings,
    failed,
    results: [
      { field: 'email', status: 'passed', message: 'All email addresses valid.' },
      { field: 'phone', status: 'warning', message: `${warnings} records missing optional phone.` },
      { field: 'lastname', status: 'failed', message: `${failed} records have invalid characters.` },
    ],
  })

  await supabase.from('migrations').update({ status: 'validated' }).eq('id', migrationId)
  await delay(1000)

  // Running phase
  const startedAt = new Date().toISOString()
  await supabase.from('migrations').update({ status: 'running', started_at: startedAt }).eq('id', migrationId)

  let processed = 0
  let successful = 0
  let failedRecords = 0
  const batchSize = 2000
  const interval = 1500

  while (processed < TOTAL_RECORDS) {
    // Check current status (in case paused/cancelled)
    const { data: current } = await supabase.from('migrations').select('status').eq('id', migrationId).single()
    if (!current || current.status === 'failed') break
    if (current.status === 'paused') {
      await delay(2000)
      continue
    }

    const thisBatch = Math.min(batchSize, TOTAL_RECORDS - processed)
    const thisSuccess = Math.floor(thisBatch * (0.97 + Math.random() * 0.02))
    const thisFail = thisBatch - thisSuccess
    processed += thisBatch
    successful += thisSuccess
    failedRecords += thisFail

    const rps = Math.floor(batchSize / (interval / 1000) * (0.8 + Math.random() * 0.4))
    const remaining = TOTAL_RECORDS - processed
    const eta = new Date(Date.now() + (remaining / rps) * 1000).toISOString()

    await supabase.from('migrations').update({
      processed_records: processed,
      successful_records: successful,
      failed_records: failedRecords,
      records_per_second: rps,
      estimated_completion: eta,
    }).eq('id', migrationId)

    // Insert some log entries
    const logsToInsert = []
    const entity = ENTITIES[Math.floor(Math.random() * ENTITIES.length)]
    for (let i = 0; i < Math.min(3, thisSuccess); i++) {
      logsToInsert.push({ migration_id: migrationId, record_id: `REC-${processed - thisBatch + i + 1}`, entity_type: entity, status: 'success' as const })
    }
    if (thisFail > 0) {
      logsToInsert.push({
        migration_id: migrationId,
        record_id: `REC-${processed}`,
        entity_type: entity,
        status: 'failed' as const,
        error_message: ERROR_REASONS[Math.floor(Math.random() * ERROR_REASONS.length)],
      })
      // Add to quarantine
      const { data: orgData } = await supabase.from('migrations').select('organisation_id').eq('id', migrationId).single()
      if (orgData?.organisation_id) {
        await supabase.from('quarantine').insert({
          migration_id: migrationId,
          organisation_id: orgData.organisation_id,
          entity_type: entity,
          record_id: `REC-${processed}`,
          source_data: { firstname: 'Test', lastname: 'Record<invalid>', email: '' },
          error_reason: ERROR_REASONS[Math.floor(Math.random() * ERROR_REASONS.length)],
        })
      }
    }
    if (logsToInsert.length > 0) {
      await supabase.from('migration_logs').insert(logsToInsert)
    }

    await delay(interval)
  }

  // Completed
  const { data: finalCheck } = await supabase.from('migrations').select('status').eq('id', migrationId).single()
  if (finalCheck?.status === 'running') {
    await supabase.from('migrations').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      processed_records: TOTAL_RECORDS,
      successful_records: successful,
      failed_records: failedRecords,
      records_per_second: 0,
    }).eq('id', migrationId)
  }
}
