'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { statusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { format } from 'date-fns'
import { Plus, Search, Trash2 } from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data: p } = await supabase.auth.getUser()
    if (!p.user) return
    const { data: prof } = await supabase.from('profiles').select('organisation_id').eq('id', p.user.id).single()
    if (!prof?.organisation_id) { setLoading(false); return }
    const { data } = await supabase
      .from('projects')
      .select('*, source:connections!projects_source_connection_id_fkey(name,type), destination:connections!projects_destination_connection_id_fkey(name,type)')
      .eq('organisation_id', prof.organisation_id)
      .order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('projects').delete().eq('id', deleteId)
    setDeleteId(null)
    load()
  }

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A0E1A]">Projects</h1>
        <Link href="/app/projects/new">
          <Button><Plus size={16} className="mr-1 inline" />Create Project</Button>
        </Link>
      </div>

      <div className="bg-white border border-[#E8ECF0] rounded-xl">
        <div className="p-4 border-b border-[#E8ECF0]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7A8D]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full pl-9 pr-4 py-2 border border-[#E8ECF0] rounded-lg text-sm text-[#0A0E1A] placeholder:text-[#6B7A8D] focus:outline-none focus:border-[#E11D48]"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#6B7A8D]">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#6B7A8D] mb-3">No projects found.</p>
            <Link href="/app/projects/new"><Button>Create your first project</Button></Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECF0]">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-[#0A0E1A]">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-[#6B7A8D]">{p.source?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-[#6B7A8D]">{p.destination?.name || '—'}</td>
                  <td className="px-6 py-4">{statusBadge(p.status)}</td>
                  <td className="px-6 py-4 text-sm text-[#6B7A8D]">{format(new Date(p.created_at), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/app/projects/${p.id}`} className="text-xs text-[#E11D48] hover:underline font-medium">View</Link>
                      <Link href={`/app/projects/${p.id}`} className="text-xs text-[#6B7A8D] hover:underline">Edit</Link>
                      <button onClick={() => setDeleteId(p.id)} className="text-[#6B7A8D] hover:text-[#E11D48]"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
        <p className="text-[#6B7A8D] text-sm mb-6">This will permanently delete the project and all its migrations. This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
