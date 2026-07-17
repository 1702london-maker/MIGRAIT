'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { statusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { MigrationProgressChart } from '@/components/charts/MigrationProgressChart'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Copy, Check } from 'lucide-react'

interface ChartPoint { time: string; records: number }

export default function MigrationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [migration, setMigration] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [pauseOpen, setPauseOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const pct = migration ? Math.round((migration.processed_records / Math.max(migration.total_records, 1)) * 100) : 0
  const eta = migration?.estimated_completion ? format(new Date(migration.estimated_completion), 'HH:mm:ss') : '—'

  useEffect(() => {
    supabase.from('migrations').select('*, projects(name)').eq('id', id).single().then(({ data }) => {
      setMigration(data)
      if (data) {
        setChartData([{ time: format(new Date(data.created_at), 'HH:mm'), records: data.processed_records || 0 }])
      }
    })
    supabase.from('migration_logs').select('*').eq('migration_id', id).order('created_at', { ascending: false }).limit(20).then(({ data }) => setLogs(data || []))

    const migSub = supabase
      .channel(`migration-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'migrations', filter: `id=eq.${id}` }, ({ new: n }) => {
        setMigration((prev: any) => ({ ...prev, ...n }))
        setChartData(prev => [...prev.slice(-59), { time: format(new Date(), 'HH:mm:ss'), records: (n as any).processed_records || 0 }])
      })
      .subscribe()

    const logSub = supabase
      .channel(`migration-logs-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'migration_logs', filter: `migration_id=eq.${id}` }, ({ new: n }) => {
        setLogs(prev => [n as any, ...prev].slice(0, 20))
      })
      .subscribe()

    return () => { migSub.unsubscribe(); logSub.unsubscribe() }
  }, [id])

  const action = async (endpoint: string) => {
    await fetch(`/api/migrations/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ migration_id: id }),
    })
    setPauseOpen(false); setCancelOpen(false)
  }

  const copyShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/live/${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!migration) return <div className="text-[#6B7A8D]">Loading…</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-[#0A0E1A]">Migration {id.slice(0, 8)}…</h1>
            {statusBadge(migration.status)}
          </div>
          <p className="text-sm text-[#6B7A8D]">
            Project: <Link href={`/app/projects/${migration.project_id}`} className="text-[#E11D48] hover:underline">{migration.projects?.name}</Link>
            {migration.started_at && <> · Started {format(new Date(migration.started_at), 'dd MMM yyyy HH:mm')}</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={copyShare}>
            {copied ? <Check size={14} className="mr-1 inline text-green-600" /> : <Copy size={14} className="mr-1 inline" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
          {migration.status === 'running' && (
            <Button size="sm" variant="outline" onClick={() => setPauseOpen(true)}>Pause</Button>
          )}
          {migration.status === 'paused' && (
            <Button size="sm" onClick={() => action('resume')}>Resume</Button>
          )}
          {['running', 'paused', 'pending', 'validating'].includes(migration.status) && (
            <Button size="sm" variant="ghost" onClick={() => setCancelOpen(true)}>Cancel</Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: migration.total_records?.toLocaleString() || '0', color: 'text-[#0A0E1A]' },
          { label: 'Processed', value: migration.processed_records?.toLocaleString() || '0', color: 'text-blue-600' },
          { label: 'Successful', value: migration.successful_records?.toLocaleString() || '0', color: 'text-green-600' },
          { label: 'Failed', value: migration.failed_records?.toLocaleString() || '0', color: 'text-[#E11D48]' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E8ECF0] rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7A8D]">{k.label}</p>
            <p className={`text-3xl font-black mt-1 ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#0A0E1A]">Progress — {pct}%</span>
          <div className="flex items-center gap-4 text-sm text-[#6B7A8D]">
            <span>{Number(migration.records_per_second || 0).toFixed(0)} rec/s</span>
            <span>ETA: {eta}</span>
          </div>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E11D48] rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#0A0E1A] mb-4">Records Over Time</h2>
        <MigrationProgressChart data={chartData} />
      </div>

      {/* Error Log */}
      <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#0A0E1A]">Recent Errors</h2>
          <Link href="/app/quarantine" className="text-xs text-[#E11D48] hover:underline">View quarantine</Link>
        </div>
        {logs.filter(l => l.status !== 'success').length === 0 ? (
          <p className="text-sm text-[#6B7A8D]">No errors yet.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {logs.filter(l => l.status !== 'success').map(l => (
              <div key={l.id} className="flex items-start gap-3 py-2 border-b border-[#E8ECF0] text-xs">
                <span className="text-[#E11D48] font-mono">{l.record_id}</span>
                <span className="text-[#6B7A8D]">{l.entity_type}</span>
                <span className="text-[#0A0E1A]">{l.error_message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal open={pauseOpen} onClose={() => setPauseOpen(false)} title="Pause Migration">
        <p className="text-[#6B7A8D] text-sm mb-6">The migration will pause after the current batch completes. You can resume it at any time.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setPauseOpen(false)}>Cancel</Button>
          <Button onClick={() => action('pause')}>Pause Migration</Button>
        </div>
      </Modal>
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Migration">
        <p className="text-[#6B7A8D] text-sm mb-6">This will permanently cancel the migration. Records already migrated will not be rolled back.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setCancelOpen(false)}>Go back</Button>
          <Button onClick={() => action('cancel')}>Cancel Migration</Button>
        </div>
      </Modal>
    </div>
  )
}
