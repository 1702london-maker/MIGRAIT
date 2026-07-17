'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { X, Zap, Search } from 'lucide-react'

interface Mapping { source: string; destination: string; confidence?: number }

const SAMPLE_SOURCE_FIELDS = ['firstname', 'lastname', 'email', 'phone', 'address', 'city', 'postcode', 'country', 'company', 'jobtitle', 'created_on', 'modified_on', 'status', 'owner_id', 'account_id']
const SAMPLE_DEST_FIELDS = ['first_name', 'last_name', 'email_address', 'phone_number', 'street_address', 'city_name', 'postal_code', 'country_code', 'organisation', 'job_title', 'created_at', 'updated_at', 'record_status', 'owner', 'account_reference']

interface FieldMapperProps { projectId: string; organisationId: string }

export function FieldMapper({ projectId, organisationId }: FieldMapperProps) {
  const [sourceFields] = useState<string[]>(SAMPLE_SOURCE_FIELDS)
  const [destFields] = useState<string[]>(SAMPLE_DEST_FIELDS)
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [sourceSearch, setSourceSearch] = useState('')
  const [destSearch, setDestSearch] = useState('')
  const [dragging, setDragging] = useState<string | null>(null)
  const [hoverDest, setHoverDest] = useState<string | null>(null)
  const [isTemplate, setIsTemplate] = useState(false)
  const [mapName, setMapName] = useState('Default mapping')
  const [saving, setSaving] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    supabase.from('field_maps').select('*').eq('project_id', projectId).single().then(({ data }) => {
      if (data?.mappings) setMappings(data.mappings)
      if (data?.name) setMapName(data.name)
    })
    supabase.from('field_maps').select('*').eq('is_template', true).eq('organisation_id', organisationId).then(({ data }) => {
      setTemplates(data || [])
    })
  }, [projectId, organisationId])

  const addMapping = (dest: string) => {
    if (!dragging) return
    if (mappings.find(m => m.source === dragging && m.destination === dest)) return
    setMappings(prev => [...prev, { source: dragging, destination: dest }])
    setDragging(null)
    setHoverDest(null)
  }

  const removeMapping = (idx: number) => setMappings(prev => prev.filter((_, i) => i !== idx))

  const suggestMappings = async () => {
    setSuggesting(true)
    const res = await fetch('/api/field-maps/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_fields: sourceFields, destination_fields: destFields }),
    })
    const data = await res.json()
    if (data.suggestions) {
      setMappings(data.suggestions.map((s: any) => ({ source: s.source_field, destination: s.destination_field, confidence: s.confidence })))
    }
    setSuggesting(false)
  }

  const saveMappings = async () => {
    setSaving(true)
    await supabase.from('field_maps').upsert({
      project_id: projectId,
      organisation_id: organisationId,
      name: mapName,
      source_entity: 'source',
      destination_entity: 'destination',
      mappings,
      is_template: isTemplate,
    }, { onConflict: 'project_id' })
    setSaving(false)
  }

  const loadTemplate = async (tId: string) => {
    const t = templates.find(t => t.id === tId)
    if (t) setMappings(t.mappings)
  }

  const filteredSource = sourceFields.filter(f => f.toLowerCase().includes(sourceSearch.toLowerCase()))
  const filteredDest = destFields.filter(f => f.toLowerCase().includes(destSearch.toLowerCase()))
  const mappedSources = new Set(mappings.map(m => m.source))
  const mappedDests = new Set(mappings.map(m => m.destination))

  const confidenceColour = (c?: number) => !c ? 'bg-gray-100 text-gray-600' : c >= 80 ? 'bg-green-100 text-green-700' : c >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'

  return (
    <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <input
            value={mapName}
            onChange={e => setMapName(e.target.value)}
            className="border border-[#E8ECF0] rounded-lg px-3 py-1.5 text-sm font-medium text-[#0A0E1A] focus:outline-none focus:border-[#E11D48]"
          />
          <span className="text-sm text-[#6B7A8D]">{mappings.length} mapping{mappings.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {templates.length > 0 && (
            <select onChange={e => loadTemplate(e.target.value)} className="border border-[#E8ECF0] rounded-lg px-3 py-1.5 text-sm text-[#6B7A8D] focus:outline-none">
              <option value="">Load template…</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
          <Button size="sm" variant="outline" onClick={suggestMappings} disabled={suggesting}>
            <Zap size={14} className="mr-1 inline" />{suggesting ? 'Suggesting…' : 'AI Suggest'}
          </Button>
          <Button size="sm" onClick={saveMappings} disabled={saving}>{saving ? 'Saving…' : 'Save Mappings'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Source Fields */}
        <div className="border border-[#E8ECF0] rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-[#E8ECF0]">
            <p className="text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider mb-2">Source Fields</p>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6B7A8D]" />
              <input value={sourceSearch} onChange={e => setSourceSearch(e.target.value)} placeholder="Filter…" className="w-full pl-6 py-1 text-xs border border-[#E8ECF0] rounded focus:outline-none" />
            </div>
          </div>
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {filteredSource.map(f => (
              <div
                key={f}
                draggable
                onDragStart={() => setDragging(f)}
                onDragEnd={() => setDragging(null)}
                className={`px-3 py-1.5 rounded text-xs cursor-grab select-none transition-colors ${mappedSources.has(f) ? 'bg-[#E11D48]/10 text-[#E11D48] font-medium' : 'bg-white text-[#0A0E1A] hover:bg-gray-50 border border-[#E8ECF0]'}`}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Mappings */}
        <div className="border border-[#E8ECF0] rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-[#E8ECF0]">
            <p className="text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider">Mappings</p>
          </div>
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {mappings.length === 0 && (
              <p className="text-xs text-[#6B7A8D] text-center py-4">Drag source → destination<br />or use AI Suggest</p>
            )}
            {mappings.map((m, i) => (
              <div key={i} className="flex items-center gap-1 text-xs bg-white border border-[#E8ECF0] rounded px-2 py-1.5">
                <span className="text-[#E11D48] font-medium truncate">{m.source}</span>
                <span className="text-[#6B7A8D] flex-shrink-0">→</span>
                <span className="text-[#0A0E1A] font-medium truncate flex-1">{m.destination}</span>
                {m.confidence !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${confidenceColour(m.confidence)}`}>{m.confidence}%</span>
                )}
                <button onClick={() => removeMapping(i)} className="text-[#6B7A8D] hover:text-[#E11D48] flex-shrink-0"><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Fields */}
        <div className="border border-[#E8ECF0] rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-[#E8ECF0]">
            <p className="text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider mb-2">Destination Fields</p>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6B7A8D]" />
              <input value={destSearch} onChange={e => setDestSearch(e.target.value)} placeholder="Filter…" className="w-full pl-6 py-1 text-xs border border-[#E8ECF0] rounded focus:outline-none" />
            </div>
          </div>
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
            {filteredDest.map(f => (
              <div
                key={f}
                onDragOver={e => { e.preventDefault(); setHoverDest(f) }}
                onDragLeave={() => setHoverDest(null)}
                onDrop={() => addMapping(f)}
                className={`px-3 py-1.5 rounded text-xs select-none transition-colors ${mappedDests.has(f) ? 'bg-[#E11D48]/10 text-[#E11D48] font-medium' : hoverDest === f ? 'bg-blue-50 border-2 border-blue-400' : 'bg-white text-[#0A0E1A] hover:bg-gray-50 border border-[#E8ECF0]'}`}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input type="checkbox" id="isTemplate" checked={isTemplate} onChange={e => setIsTemplate(e.target.checked)} />
        <label htmlFor="isTemplate" className="text-sm text-[#6B7A8D]">Save as reusable template</label>
      </div>
    </div>
  )
}
