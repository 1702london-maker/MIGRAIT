'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { format } from 'date-fns'
import { GitBranch, Trash2 } from 'lucide-react'

export default function FieldMapsPage() {
  const [maps, setMaps] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copyMap, setCopyMap] = useState<any | null>(null)
  const [targetProject, setTargetProject] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data: u } = await supabase.auth.getUser()
    if (!u.user) return
    const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', u.user.id).single()
    if (!p?.organisation_id) { setLoading(false); return }
    const [{ data: m }, { data: proj }] = await Promise.all([
      supabase.from('field_maps').select('*').eq('organisation_id', p.organisation_id).eq('is_template', true).order('created_at', { ascending: false }),
      supabase.from('projects').select('id,name').eq('organisation_id', p.organisation_id),
    ])
    setMaps(m || [])
    setProjects(proj || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('field_maps').delete().eq('id', deleteId)
    setDeleteId(null); load()
  }

  const handleCopy = async () => {
    if (!copyMap || !targetProject) return
    const orgRes = await supabase.auth.getUser()
    const pRes = await supabase.from('profiles').select('organisation_id').eq('id', orgRes.data.user!.id).single()
    await supabase.from('field_maps').insert({
      project_id: targetProject,
      organisation_id: pRes.data!.organisation_id,
      name: `${copyMap.name} (copy)`,
      source_entity: copyMap.source_entity,
      destination_entity: copyMap.destination_entity,
      mappings: copyMap.mappings,
      is_template: false,
    })
    setCopyMap(null); setTargetProject('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A0E1A]">Field Map Templates</h1>
      </div>

      {loading ? <div className="text-[#6B7A8D]">Loading…</div> : maps.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#E8ECF0] rounded-xl">
          <GitBranch size={32} className="text-[#6B7A8D] mx-auto mb-3" />
          <p className="text-[#6B7A8D] mb-2">No saved templates yet.</p>
          <p className="text-sm text-[#6B7A8D]">Open a project, map fields, and check "Save as template".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {maps.map(m => (
            <div key={m.id} className="bg-white border border-[#E8ECF0] rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <GitBranch size={20} className="text-[#E11D48]" />
                <button onClick={() => setDeleteId(m.id)} className="text-[#6B7A8D] hover:text-[#E11D48]"><Trash2 size={14} /></button>
              </div>
              <h3 className="font-semibold text-[#0A0E1A]">{m.name}</h3>
              <p className="text-xs text-[#6B7A8D] mt-0.5">{m.source_entity} → {m.destination_entity}</p>
              <p className="text-xs text-[#6B7A8D] mt-1">{(m.mappings || []).length} mappings</p>
              <p className="text-xs text-[#6B7A8D] mt-1">{format(new Date(m.created_at), 'dd MMM yyyy')}</p>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setCopyMap(m)}>Use as Template</Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Template">
        <p className="text-[#6B7A8D] text-sm mb-6">This will permanently delete this field map template.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      <Modal open={!!copyMap} onClose={() => setCopyMap(null)} title="Apply Template to Project">
        <p className="text-sm text-[#6B7A8D] mb-4">Select the project to apply &ldquo;{copyMap?.name}&rdquo; to.</p>
        <select value={targetProject} onChange={e => setTargetProject(e.target.value)} className="w-full border border-[#E8ECF0] rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-[#E11D48]">
          <option value="">Select project…</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setCopyMap(null)}>Cancel</Button>
          <Button onClick={handleCopy} disabled={!targetProject}>Apply Template</Button>
        </div>
      </Modal>
    </div>
  )
}
