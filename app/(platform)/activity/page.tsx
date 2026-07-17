'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

const actionLabels: Record<string, string> = {
  migration_started: 'Started a migration',
  migration_chunk_complete: 'Migration chunk completed',
  migration_complete: 'Migration completed',
  migration_failed: 'Migration failed',
  project_created: 'Created a project',
  connection_added: 'Added a connection',
  team_invite_sent: 'Sent a team invite',
  settings_updated: 'Updated settings',
}

function humanAction(action: string): string {
  return actionLabels[action] || action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user.id).single()
      if (!profile?.organisation_id) { setLoading(false); return }
      const { data } = await supabase.from('activity_logs').select('*, profiles(full_name, email)').eq('organisation_id', profile.organisation_id).order('created_at', { ascending: false }).limit(200)
      setLogs(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const actionTypes = Array.from(new Set(logs.map(l => l.action)))

  const filtered = logs.filter(l => {
    const matchesFilter = filter === 'all' || l.action === filter
    const matchesSearch = !search || l.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || l.profiles?.email?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#0A0E1A]">Activity Log</h1>
        <div className="flex items-center gap-2">
          <input
            type="text" placeholder="Search by user..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-[#E8ECF0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E11D48]"
          />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-[#E8ECF0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E11D48]">
            <option value="all">All actions</option>
            {actionTypes.map(a => <option key={a} value={a}>{humanAction(a)}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E8ECF0] rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center text-[#6B7A8D]">Loading...</div> : filtered.length === 0 ? (
          <div className="p-12 text-center"><p className="text-[#6B7A8D]">No activity found.</p></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider bg-gray-50 border-b border-[#E8ECF0]">
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Entity</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Details</th>
                <th className="px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECF0]">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-[#0A0E1A]">{humanAction(log.action)}</td>
                  <td className="px-5 py-3 text-sm text-[#6B7A8D] capitalize">{log.entity_type}</td>
                  <td className="px-5 py-3 text-sm text-[#6B7A8D]">{log.profiles?.full_name || log.profiles?.email || 'System'}</td>
                  <td className="px-5 py-3 text-xs text-[#6B7A8D] font-mono max-w-xs truncate">
                    {log.metadata && Object.keys(log.metadata).length > 0 ? Object.entries(log.metadata).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ') : '—'}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#6B7A8D] whitespace-nowrap">{format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
