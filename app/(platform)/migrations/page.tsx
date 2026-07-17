'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { statusBadge } from '@/components/ui/Badge'
import { format } from 'date-fns'

export default function MigrationsPage() {
  const [migrations, setMigrations] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: u } = await supabase.auth.getUser()
      if (!u.user) return
      const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', u.user.id).single()
      if (!p?.organisation_id) { setLoading(false); return }

      const { data } = await supabase
        .from('migrations')
        .select('*, projects(name)')
        .eq('organisation_id', p.organisation_id)
        .order('created_at', { ascending: false })
      setMigrations(data || [])
      setLoading(false)

      const sub = supabase
        .channel('migrations-list')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'migrations', filter: `organisation_id=eq.${p.organisation_id}` }, payload => {
          setMigrations(prev => {
            const idx = prev.findIndex(m => m.id === (payload.new as any).id)
            if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], ...payload.new }; return n }
            return [payload.new as any, ...prev]
          })
        })
        .subscribe()
      return () => { sub.unsubscribe() }
    }
    load()
  }, [])

  const filtered = filter === 'all' ? migrations : migrations.filter(m => m.status === filter)

  const duration = (m: any) => {
    if (!m.started_at) return '—'
    const end = m.completed_at ? new Date(m.completed_at) : new Date()
    const secs = Math.floor((end.getTime() - new Date(m.started_at).getTime()) / 1000)
    if (secs < 60) return `${secs}s`
    return `${Math.floor(secs / 60)}m ${secs % 60}s`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A0E1A]">Migrations</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-[#E8ECF0] rounded-lg px-3 py-2 text-sm text-[#0A0E1A] focus:outline-none focus:border-[#E11D48]">
          {['all', 'running', 'completed', 'failed', 'paused', 'pending'].map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-[#E8ECF0] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B7A8D]">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#6B7A8D]">No migrations found.</p>
            <Link href="/app/projects" className="mt-2 inline-block text-sm text-[#E11D48] hover:underline">Start from a project</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider bg-gray-50">
                  {['ID', 'Project', 'Status', 'Total', 'Successful', 'Failed', 'Rec/s', 'Started', 'Duration'].map(h => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8ECF0]">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-[#6B7A8D] font-mono">{m.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#0A0E1A]">{m.projects?.name || '—'}</td>
                    <td className="px-4 py-3">{statusBadge(m.status)}</td>
                    <td className="px-4 py-3 text-sm">{m.total_records?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{m.successful_records?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-[#E11D48]">{m.failed_records?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{Number(m.records_per_second || 0).toFixed(0)}</td>
                    <td className="px-4 py-3 text-sm text-[#6B7A8D]">{m.started_at ? format(new Date(m.started_at), 'dd MMM HH:mm') : '—'}</td>
                    <td className="px-4 py-3 text-sm text-[#6B7A8D]">{duration(m)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/app/migrations/${m.id}`} className="text-xs text-[#E11D48] hover:underline font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
