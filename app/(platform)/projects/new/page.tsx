'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const steps = ['Details', 'Connections', 'Review']

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', description: '', sourceId: '', destId: '' })
  const [connections, setConnections] = useState<any[]>([])
  const [orgId, setOrgId] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', data.user.id).single()
      if (!p?.organisation_id) return
      setOrgId(p.organisation_id)
      const { data: conns } = await supabase.from('connections').select('*').eq('organisation_id', p.organisation_id)
      setConnections(conns || [])
    })
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleCreate = async () => {
    setLoading(true)
    const { data, error: err } = await supabase.from('projects').insert({
      name: form.name,
      description: form.description,
      organisation_id: orgId,
      source_connection_id: form.sourceId || null,
      destination_connection_id: form.destId || null,
      created_by: userId,
    }).select().single()
    if (err || !data) { setError(err?.message || 'Failed to create project.'); setLoading(false); return }
    router.push(`/app/projects/${data.id}`)
  }

  const connOptions = connections.map(c => ({ value: c.id, label: `${c.name} (${c.type})` }))

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0A0E1A] mb-6">New Project</h1>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${i === step ? 'bg-[#E11D48] text-white' : i < step ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#6B7A8D]'}`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border border-current">{i < step ? '✓' : i + 1}</span>
              {s}
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-[#E8ECF0]" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
        {step === 0 && (
          <div className="space-y-4">
            <Input label="Project name *" value={form.name} onChange={set('name')} placeholder="Dynamics 365 Migration Q4" required />
            <div>
              <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Description (optional)</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                placeholder="Brief description of this migration project…"
                className="w-full border border-[#E8ECF0] rounded-lg px-4 py-2.5 text-[#0A0E1A] placeholder:text-[#6B7A8D] text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 focus:border-[#E11D48]"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => { if (!form.name.trim()) { setError('Project name is required.'); return } setError(''); setStep(1) }}>
                Next: Connections
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Select
              label="Source Connection"
              value={form.sourceId}
              onChange={set('sourceId')}
              options={connOptions}
              placeholder="Select source…"
            />
            <Select
              label="Destination Connection"
              value={form.destId}
              onChange={set('destId')}
              options={connOptions}
              placeholder="Select destination…"
            />
            <p className="text-sm text-[#6B7A8D]">
              Don&apos;t have a connection yet?{' '}
              <a href="/app/connections/new" className="text-[#E11D48] hover:underline" target="_blank">Create one</a>
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => { setError(''); setStep(2) }}>Next: Review</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                ['Project name', form.name],
                ['Description', form.description || '—'],
                ['Source', connections.find(c => c.id === form.sourceId)?.name || 'None'],
                ['Destination', connections.find(c => c.id === form.destId)?.name || 'None'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 py-2 border-b border-[#E8ECF0]">
                  <span className="text-sm font-medium text-[#6B7A8D] w-36">{k}</span>
                  <span className="text-sm text-[#0A0E1A]">{v}</span>
                </div>
              ))}
            </div>
            {error && <p className="text-[#E11D48] text-sm">{error}</p>}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating…' : 'Create Project'}</Button>
            </div>
          </div>
        )}

        {error && step !== 2 && <p className="mt-3 text-[#E11D48] text-sm">{error}</p>}
      </div>
    </div>
  )
}
