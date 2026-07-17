'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Cloud, Database, FileSpreadsheet, Settings } from 'lucide-react'

const TYPES = [
  { id: 'dynamics365', label: 'Dynamics 365', icon: Cloud, available: true },
  { id: 'sql_server', label: 'SQL Server', icon: Database, available: true },
  { id: 'csv', label: 'CSV Upload', icon: FileSpreadsheet, available: true },
  { id: 'excel', label: 'Excel Upload', icon: FileSpreadsheet, available: true },
  { id: 'salesforce', label: 'Salesforce', icon: Cloud, available: false },
  { id: 'sap', label: 'SAP', icon: Settings, available: false },
]

export default function NewConnectionPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [isDestination, setIsDestination] = useState(false)
  const [config, setConfig] = useState<Record<string, string>>({})
  const [orgId, setOrgId] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string[][]>([])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', data.user.id).single()
      if (p?.organisation_id) setOrgId(p.organisation_id)
    })
  }, [])

  const setConf = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setConfig(c => ({ ...c, [k]: e.target.value }))

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const text = await f.text()
    const rows = text.split('\n').slice(0, 6).map(r => r.split(',').map(v => v.trim()))
    setPreview(rows)
  }

  const testConnection = async () => {
    setTesting(true)
    const res = await fetch('/api/connections/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, config }),
    })
    const data = await res.json()
    setTestResult(data)
    setTesting(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('connections').insert({
      name,
      type,
      config: { ...config, fileName: file?.name },
      is_destination: isDestination,
      organisation_id: orgId,
    })
    router.push('/app/connections')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0A0E1A] mb-6">Add Connection</h1>

      {/* Step 1 */}
      {step === 0 && (
        <div>
          <p className="text-[#6B7A8D] text-sm mb-4">Choose the type of data source to connect.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TYPES.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  disabled={!t.available}
                  onClick={() => { setType(t.id); setStep(1) }}
                  className={`relative border rounded-xl p-5 text-left transition-all ${t.available ? 'hover:border-[#E11D48] hover:shadow-sm cursor-pointer' : 'opacity-40 cursor-not-allowed'} border-[#E8ECF0]`}
                >
                  {!t.available && <span className="absolute top-2 right-2 text-[10px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">Coming soon</span>}
                  <Icon size={24} className="text-[#6B7A8D] mb-2" />
                  <p className="font-medium text-sm text-[#0A0E1A]">{t.label}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2 — Configure */}
      {step === 1 && (
        <div className="bg-white border border-[#E8ECF0] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-[#0A0E1A]">Configure {type.replace('_', ' ')}</h2>
          {type === 'dynamics365' && (
            <>
              <Input label="Environment URL" value={config.url || ''} onChange={setConf('url')} placeholder="https://org.crm.dynamics.com" />
              <Input label="Client ID" value={config.clientId || ''} onChange={setConf('clientId')} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
              <Input label="Client Secret" type="password" value={config.clientSecret || ''} onChange={setConf('clientSecret')} placeholder="••••••••" />
              <Input label="Tenant ID" value={config.tenantId || ''} onChange={setConf('tenantId')} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            </>
          )}
          {type === 'sql_server' && (
            <>
              <Input label="Host" value={config.host || ''} onChange={setConf('host')} placeholder="db.example.com" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Port" value={config.port || '1433'} onChange={setConf('port')} />
                <Input label="Database" value={config.database || ''} onChange={setConf('database')} placeholder="MyDatabase" />
              </div>
              <Input label="Username" value={config.username || ''} onChange={setConf('username')} />
              <Input label="Password" type="password" value={config.password || ''} onChange={setConf('password')} placeholder="••••••••" />
            </>
          )}
          {(type === 'csv' || type === 'excel') && (
            <div>
              <label className="block text-sm font-medium text-[#0A0E1A] mb-2">Upload file</label>
              <div className="border-2 border-dashed border-[#E8ECF0] rounded-xl p-8 text-center">
                <input type="file" accept={type === 'csv' ? '.csv' : '.xlsx,.xls'} onChange={handleFileUpload} className="hidden" id="fileInput" />
                <label htmlFor="fileInput" className="cursor-pointer text-[#E11D48] hover:underline text-sm font-medium">Click to upload {type.toUpperCase()}</label>
                {file && <p className="mt-2 text-xs text-[#6B7A8D]">{file.name} — {Math.round(file.size / 1024)}KB</p>}
              </div>
              {preview.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="text-xs w-full border border-[#E8ECF0] rounded">
                    {preview.map((row, ri) => (
                      <tr key={ri} className={ri === 0 ? 'bg-gray-50 font-semibold' : ''}>
                        {row.map((cell, ci) => <td key={ci} className="px-2 py-1 border border-[#E8ECF0]">{cell}</td>)}
                      </tr>
                    ))}
                  </table>
                </div>
              )}
            </div>
          )}
          {(type === 'dynamics365' || type === 'sql_server') && (
            <div>
              <Button size="sm" variant="outline" onClick={testConnection} disabled={testing}>
                {testing ? 'Testing…' : 'Test Connection'}
              </Button>
              {testResult && (
                <p className={`mt-2 text-sm ${testResult.ok ? 'text-green-600' : 'text-[#E11D48]'}`}>{testResult.message}</p>
              )}
            </div>
          )}
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)}>Next: Name it</Button>
          </div>
        </div>
      )}

      {/* Step 3 — Name & Save */}
      {step === 2 && (
        <div className="bg-white border border-[#E8ECF0] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-[#0A0E1A]">Name your connection</h2>
          <Input label="Connection name *" value={name} onChange={e => setName(e.target.value)} placeholder="Production Dynamics 365" required />
          <label className="flex items-center gap-2 text-sm text-[#6B7A8D]">
            <input type="checkbox" checked={isDestination} onChange={e => setIsDestination(e.target.checked)} />
            This is a destination connection
          </label>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>{saving ? 'Saving…' : 'Save Connection'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
