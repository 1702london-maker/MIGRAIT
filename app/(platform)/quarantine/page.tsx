'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { statusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SlideOver } from '@/components/ui/SlideOver'
import { format } from 'date-fns'
import { ExportButton } from '@/components/ExportButton'

export default function QuarantinePage() {
  const [records, setRecords] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data: u } = await supabase.auth.getUser()
    if (!u.user) return
    const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', u.user.id).single()
    if (!p?.organisation_id) { setLoading(false); return }
    const { data } = await supabase.from('quarantine').select('*').eq('organisation_id', p.organisation_id).order('created_at', { ascending: false })
    setRecords(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const ignore = async (id: string) => {
    await supabase.from('quarantine').update({ status: 'ignored' }).eq('id', id)
    load()
  }

  const bulkIgnore = async () => {
    await supabase.from('quarantine').update({ status: 'ignored' }).in('id', selected)
    setSelected([])
    load()
  }

  const filtered = filter === 'all' ? records : records.filter(r => r.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#0A0E1A]">Quarantine</h1>
        <div className="flex items-center gap-2">
          {selected.length > 0 && <Button size="sm" variant="outline" onClick={bulkIgnore}>Ignore {selected.length} selected</Button>}
          <ExportButton
            data={filtered.map(r => ({
              id: r.id,
              entity_type: r.entity_type,
              record_id: r.record_id,
              error_reason: r.error_reason,
              status: r.status,
              created_at: r.created_at,
              ...Object.fromEntries(Object.entries(r.source_data || {}).map(([k, v]) => [`source_${k}`, v]))
            }))}
            filename="quarantine-records"
          />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-[#E8ECF0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E11D48]">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="fixed">Fixed</option>
            <option value="ignored">Ignored</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E8ECF0] rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center text-[#6B7A8D]">Loading…</div> : filtered.length === 0 ? (
          <div className="p-12 text-center"><p className="text-[#6B7A8D]">No quarantined records.</p></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider bg-gray-50">
                <th className="px-4 py-3"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(r => r.id) : [])} /></th>
                {['Entity', 'Record ID', 'Error', 'Preview', 'Status', 'Created', 'Actions'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECF0]">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(r.id)} onChange={e => setSelected(prev => e.target.checked ? [...prev, r.id] : prev.filter(x => x !== r.id))} /></td>
                  <td className="px-4 py-3 text-sm text-[#0A0E1A]">{r.entity_type}</td>
                  <td className="px-4 py-3 text-xs font-mono text-[#6B7A8D]">{r.record_id?.slice(0, 12)}…</td>
                  <td className="px-4 py-3 text-sm text-[#E11D48]">{r.error_reason}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7A8D]">
                    {Object.entries(r.source_data || {}).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7A8D]">{format(new Date(r.created_at), 'dd MMM HH:mm')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditing(r)} className="text-xs text-[#E11D48] hover:underline font-medium">Fix</button>
                      <button onClick={() => ignore(r.id)} className="text-xs text-[#6B7A8D] hover:underline">Ignore</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SlideOver open={!!editing} onClose={() => setEditing(null)} title="Fix Record">
        {editing && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-[#6B7A8D] uppercase mb-2">Error</p>
              <p className="text-sm text-[#E11D48]">{editing.error_reason}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#6B7A8D] uppercase mb-2">Source Data</p>
              <pre className="bg-gray-50 border border-[#E8ECF0] rounded-lg p-3 text-xs overflow-auto">{JSON.stringify(editing.source_data, null, 2)}</pre>
            </div>
            <Button onClick={async () => {
              await supabase.from('quarantine').update({ status: 'fixed' }).eq('id', editing.id)
              setEditing(null); load()
            }}>Mark as Fixed</Button>
          </div>
        )}
      </SlideOver>
    </div>
  )
}
