'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { statusBadge } from '@/components/ui/Badge'
import { FieldMapper } from '@/components/FieldMapper'
import { format } from 'date-fns'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [migrations, setMigrations] = useState<any[]>([])
  const [validation, setValidation] = useState<any>(null)
  const [orgId, setOrgId] = useState('')
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: u } = await supabase.auth.getUser()
      if (!u.user) return
      const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', u.user.id).single()
      setOrgId(p?.organisation_id || '')

      const { data: proj } = await supabase
        .from('projects')
        .select('*, source:connections!projects_source_connection_id_fkey(name,type), destination:connections!projects_destination_connection_id_fkey(name,type)')
        .eq('id', id)
        .single()
      setProject(proj)

      const { data: migs } = await supabase.from('migrations').select('*').eq('project_id', id).order('created_at', { ascending: false })
      setMigrations(migs || [])

      if (migs && migs.length > 0) {
        const { data: v } = await supabase.from('validation_reports').select('*').eq('migration_id', migs[0].id).single()
        setValidation(v)
      }
    }
    load()
  }, [id])

  const startMigration = async () => {
    setStarting(true)
    const res = await fetch('/api/migrations/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: id }),
    })
    const data = await res.json()
    if (data.migration_id) router.push(`/app/migrations/${data.migration_id}`)
    setStarting(false)
  }

  if (!project) return <div className="text-[#6B7A8D]">Loading…</div>

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'fieldmapper', label: 'Field Mapper' },
    { id: 'validation', label: 'Validation' },
    { id: 'migrations', label: 'Migrations' },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-[#0A0E1A]">{project.name}</h1>
            {statusBadge(project.status)}
          </div>
          {project.description && <p className="text-[#6B7A8D] text-sm">{project.description}</p>}
        </div>
        <Button onClick={startMigration} disabled={starting}>
          {starting ? 'Starting…' : '▶ Start Migration'}
        </Button>
      </div>

      <Tabs tabs={tabs}>
        {(tab) => (
          <>
            {tab === 'overview' && (
              <div className="bg-white border border-[#E8ECF0] rounded-xl p-6 space-y-4">
                {[
                  ['Source Connection', project.source?.name || '—'],
                  ['Source Type', project.source?.type || '—'],
                  ['Destination Connection', project.destination?.name || '—'],
                  ['Destination Type', project.destination?.type || '—'],
                  ['Created', project.created_at ? format(new Date(project.created_at), 'dd MMM yyyy HH:mm') : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-4 py-2 border-b border-[#E8ECF0] last:border-0">
                    <span className="text-sm font-medium text-[#6B7A8D] w-48">{k}</span>
                    <span className="text-sm text-[#0A0E1A]">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'fieldmapper' && orgId && (
              <FieldMapper projectId={id} organisationId={orgId} />
            )}
            {tab === 'validation' && (
              <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
                {validation ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Checked', value: validation.total_checked, color: 'text-[#0A0E1A]' },
                        { label: 'Passed', value: validation.passed, color: 'text-green-600' },
                        { label: 'Warnings', value: validation.warnings, color: 'text-amber-600' },
                        { label: 'Failed', value: validation.failed, color: 'text-[#E11D48]' },
                      ].map(s => (
                        <div key={s.label} className="text-center border border-[#E8ECF0] rounded-xl p-4">
                          <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                          <p className="text-xs text-[#6B7A8D] mt-1">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {(validation.results || []).slice(0, 10).map((r: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b border-[#E8ECF0] text-sm">
                          <span className={r.status === 'passed' ? 'text-green-600' : r.status === 'warning' ? 'text-amber-600' : 'text-[#E11D48]'}>●</span>
                          <span className="font-medium text-[#0A0E1A]">{r.field}</span>
                          <span className="text-[#6B7A8D]">{r.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#6B7A8D] text-sm mb-3">No validation report yet. Start a migration to run validation.</p>
                    <Button onClick={startMigration} disabled={starting}>{starting ? 'Starting…' : 'Start Migration'}</Button>
                  </div>
                )}
              </div>
            )}
            {tab === 'migrations' && (
              <div className="bg-white border border-[#E8ECF0] rounded-xl">
                {migrations.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[#6B7A8D] text-sm mb-3">No migrations yet.</p>
                    <Button onClick={startMigration} disabled={starting}>{starting ? 'Starting…' : 'Start Migration'}</Button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider">
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Total Records</th>
                        <th className="px-6 py-3">Successful</th>
                        <th className="px-6 py-3">Failed</th>
                        <th className="px-6 py-3">Started</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8ECF0]">
                      {migrations.map(m => (
                        <tr key={m.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3">{statusBadge(m.status)}</td>
                          <td className="px-6 py-3 text-sm">{m.total_records?.toLocaleString()}</td>
                          <td className="px-6 py-3 text-sm text-green-600">{m.successful_records?.toLocaleString()}</td>
                          <td className="px-6 py-3 text-sm text-[#E11D48]">{m.failed_records?.toLocaleString()}</td>
                          <td className="px-6 py-3 text-sm text-[#6B7A8D]">{m.started_at ? format(new Date(m.started_at), 'dd MMM HH:mm') : '—'}</td>
                          <td className="px-6 py-3">
                            <Link href={`/app/migrations/${m.id}`} className="text-xs text-[#E11D48] hover:underline font-medium">View</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  )
}
