'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export default function LiveDashboardPage() {
  const { id } = useParams<{ id: string }>()
  const [migration, setMigration] = useState<any>(null)
  const [wl, setWl] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [notFound, setNotFound] = useState(false)

  const load = async () => {
    const { data: m } = await supabase.from('migrations').select('*, projects(name, organisations(id))').eq('id', id).single()
    if (!m) { setNotFound(true); return }
    setMigration(m)
    const orgId = m.projects?.organisations?.id
    if (orgId) {
      const { data: w } = await supabase.from('white_label').select('*').eq('organisation_id', orgId).single()
      setWl(w)
    }
    const { data: l } = await supabase.from('migration_logs').select('*').eq('migration_id', id).order('created_at', { ascending: false }).limit(10)
    setLogs(l || [])
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [id])

  if (notFound) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-[#6B7A8D]">Migration not found.</p>
    </div>
  )

  if (!migration) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-[#6B7A8D]">Loading…</p>
    </div>
  )

  const primaryColour = wl?.primary_colour || '#E11D48'
  const title = wl?.dashboard_title || 'Migration Dashboard'
  const pct = Math.round((migration.processed_records / Math.max(migration.total_records, 1)) * 100)

  const statusColor: Record<string, string> = {
    running: 'text-green-600', completed: 'text-green-600', failed: 'text-red-600', paused: 'text-amber-600', pending: 'text-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-[#E8ECF0] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {wl?.logo_url
            ? <img src={wl.logo_url} alt="" className="h-8" />
            : <span className="font-black text-xl" style={{ color: primaryColour }}>migr<span className="text-[#0A0E1A]">ait</span></span>
          }
          <span className="text-sm font-medium text-[#6B7A8D]">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold capitalize ${statusColor[migration.status] || 'text-gray-600'}`}>● {migration.status}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0E1A]">{migration.projects?.name}</h1>
          {migration.started_at && <p className="text-sm text-[#6B7A8D] mt-0.5">Started {format(new Date(migration.started_at), 'dd MMM yyyy HH:mm')}</p>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Records', value: migration.total_records?.toLocaleString() || '0' },
            { label: 'Processed', value: migration.processed_records?.toLocaleString() || '0' },
            { label: 'Successful', value: migration.successful_records?.toLocaleString() || '0' },
            { label: 'Failed', value: migration.failed_records?.toLocaleString() || '0' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E8ECF0] rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-[#0A0E1A]">{s.value}</p>
              <p className="text-xs text-[#6B7A8D] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-[#0A0E1A]">Progress — {pct}%</span>
            <div className="text-sm text-[#6B7A8D] space-x-4">
              <span>{Number(migration.records_per_second || 0).toFixed(0)} rec/s</span>
              {migration.estimated_completion && <span>ETA {format(new Date(migration.estimated_completion), 'HH:mm:ss')}</span>}
            </div>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: primaryColour }} />
          </div>
        </div>

        {/* Activity feed */}
        {logs.length > 0 && (
          <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-[#0A0E1A] mb-4">Recent Activity</h2>
            <div className="space-y-2">
              {logs.map(l => (
                <div key={l.id} className="flex items-start gap-3 text-xs py-2 border-b border-[#E8ECF0] last:border-0">
                  <span className={l.status === 'success' ? 'text-green-600' : 'text-[#E11D48]'}>●</span>
                  <span className="text-[#6B7A8D]">{l.entity_type}</span>
                  <span className="text-[#0A0E1A]">{l.status === 'success' ? 'Record migrated successfully' : l.error_message}</span>
                  <span className="ml-auto text-[#6B7A8D]">{format(new Date(l.created_at), 'HH:mm:ss')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {!wl && (
        <footer className="text-center py-6 text-xs text-[#6B7A8D]">
          Powered by <a href="/" className="text-[#E11D48] hover:underline font-medium">Migrait</a>
        </footer>
      )}
    </div>
  )
}
