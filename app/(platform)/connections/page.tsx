'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { format } from 'date-fns'
import { Plus, Database, FileSpreadsheet, Cloud, Settings, Trash2 } from 'lucide-react'

const icons: Record<string, any> = {
  sql_server: Database, csv: FileSpreadsheet, excel: FileSpreadsheet,
  dynamics365: Cloud, salesforce: Cloud, sap: Settings, legacy_crm: Settings,
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data: u } = await supabase.auth.getUser()
    if (!u.user) return
    const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', u.user.id).single()
    if (!p?.organisation_id) { setLoading(false); return }
    const { data } = await supabase.from('connections').select('*').eq('organisation_id', p.organisation_id).order('created_at', { ascending: false })
    setConnections(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('connections').delete().eq('id', deleteId)
    setDeleteId(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A0E1A]">Connections</h1>
        <Link href="/app/connections/new"><Button><Plus size={16} className="mr-1 inline" />Add Connection</Button></Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : connections.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#6B7A8D] mb-3">No connections yet.</p>
          <Link href="/app/connections/new"><Button>Add your first connection</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map(c => {
            const Icon = icons[c.type] || Settings
            return (
              <div key={c.id} className="bg-white border border-[#E8ECF0] rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon size={20} className="text-[#6B7A8D]" />
                  </div>
                  <div className="flex items-center gap-2">
                    {c.is_destination && <Badge variant="info">Destination</Badge>}
                    <button onClick={() => setDeleteId(c.id)} className="text-[#6B7A8D] hover:text-[#E11D48]"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-[#0A0E1A]">{c.name}</h3>
                <p className="text-xs text-[#6B7A8D] mt-0.5 uppercase tracking-wider">{c.type.replace('_', ' ')}</p>
                <p className="text-xs text-[#6B7A8D] mt-2">{format(new Date(c.created_at), 'dd MMM yyyy')}</p>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Connection">
        <p className="text-[#6B7A8D] text-sm mb-6">This will permanently delete this connection. Any projects using it will need to be reconfigured.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
