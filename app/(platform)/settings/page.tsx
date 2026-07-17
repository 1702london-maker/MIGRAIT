'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [org, setOrg] = useState<any>(null)
  const [whiteLabel, setWhiteLabel] = useState<any>(null)
  const [orgId, setOrgId] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: u }) => {
      if (!u.user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('id', u.user.id).single()
      setProfile(p)
      if (!p?.organisation_id) return
      setOrgId(p.organisation_id)
      const [{ data: o }, { data: wl }] = await Promise.all([
        supabase.from('organisations').select('*').eq('id', p.organisation_id).single(),
        supabase.from('white_label').select('*').eq('organisation_id', p.organisation_id).single(),
      ])
      setOrg(o)
      setWhiteLabel(wl || { organisation_id: p.organisation_id, primary_colour: '#E11D48', dashboard_title: 'Migration Dashboard' })
    })
  }, [])

  const saveOrg = async () => {
    setSaving(true)
    await supabase.from('organisations').update({ name: org.name }).eq('id', orgId)
    setMsg('Organisation saved.')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const saveWL = async () => {
    setSaving(true)
    await supabase.from('white_label').upsert({ ...whiteLabel, organisation_id: orgId }, { onConflict: 'organisation_id' })
    setMsg('White label settings saved.')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const changePassword = async () => {
    const newPw = prompt('Enter new password (min 8 chars):')
    if (!newPw || newPw.length < 8) return
    await supabase.auth.updateUser({ password: newPw })
    setMsg('Password updated.')
    setTimeout(() => setMsg(''), 3000)
  }

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    if (profile?.id) await supabase.from('profiles').update({ organisation_id: null }).eq('id', profile.id)
    await supabase.auth.signOut()
    router.push('/')
  }

  const tabs = [
    { id: 'organisation', label: 'Organisation' },
    { id: 'whitelabel', label: 'White Label' },
    { id: 'billing', label: 'Billing' },
    { id: 'account', label: 'Account' },
  ]

  if (!profile || !org) return <div className="text-[#6B7A8D]">Loading…</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0A0E1A] mb-6">Settings</h1>
      {msg && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{msg}</div>}

      <Tabs tabs={tabs}>
        {(tab) => (
          <>
            {tab === 'organisation' && (
              <div className="bg-white border border-[#E8ECF0] rounded-xl p-6 space-y-4">
                <Input label="Organisation name" value={org.name || ''} onChange={e => setOrg((o: any) => ({ ...o, name: e.target.value }))} />
                <div>
                  <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Logo</label>
                  {org.logo_url && <img src={org.logo_url} alt="Logo" className="h-12 object-contain mb-2 rounded" />}
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const ext = file.name.split('.').pop()
                    const path = `${orgId}/logo.${ext}`
                    const { error: upErr } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
                    if (!upErr) {
                      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
                      const logoUrl = urlData.publicUrl
                      await supabase.from('organisations').update({ logo_url: logoUrl }).eq('id', orgId)
                      setOrg((o: any) => ({ ...o, logo_url: logoUrl }))
                      setMsg('Logo uploaded.')
                      setTimeout(() => setMsg(''), 3000)
                    }
                  }} className="text-sm text-[#6B7A8D]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Plan</label>
                  <p className="text-sm text-[#6B7A8D] capitalize">{org.plan}</p>
                </div>
                <Button onClick={saveOrg} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
              </div>
            )}
            {tab === 'whitelabel' && whiteLabel && (
              <div className="bg-white border border-[#E8ECF0] rounded-xl p-6 space-y-4">
                <Input label="Client name" value={whiteLabel.client_name || ''} onChange={e => setWhiteLabel((w: any) => ({ ...w, client_name: e.target.value }))} placeholder="Acme Corp" />
                <Input label="Dashboard title" value={whiteLabel.dashboard_title || ''} onChange={e => setWhiteLabel((w: any) => ({ ...w, dashboard_title: e.target.value }))} />
                <Input label="Custom domain" value={whiteLabel.custom_domain || ''} onChange={e => setWhiteLabel((w: any) => ({ ...w, custom_domain: e.target.value }))} placeholder="migrations.client.com" />
                <div>
                  <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Primary colour</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={whiteLabel.primary_colour || '#E11D48'} onChange={e => setWhiteLabel((w: any) => ({ ...w, primary_colour: e.target.value }))} className="w-10 h-10 rounded border border-[#E8ECF0] cursor-pointer" />
                    <span className="text-sm text-[#6B7A8D]">{whiteLabel.primary_colour}</span>
                  </div>
                </div>
                <Button onClick={saveWL} disabled={saving}>{saving ? 'Saving…' : 'Save White Label Settings'}</Button>
              </div>
            )}
            {tab === 'billing' && (
              <div className="bg-white border border-[#E8ECF0] rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#E8ECF0]">
                  <div>
                    <p className="font-medium text-[#0A0E1A]">Current Plan</p>
                    <p className="text-sm text-[#6B7A8D] capitalize">{org.plan}</p>
                  </div>
                  <a href="/pricing" className="text-sm text-[#E11D48] hover:underline font-medium">Upgrade</a>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-sm text-[#6B7A8D]">Next billing date</p>
                  <p className="text-sm text-[#0A0E1A]">—</p>
                </div>
                <Button variant="ghost" className="text-[#E11D48]">Cancel subscription</Button>
              </div>
            )}
            {tab === 'account' && (
              <div className="bg-white border border-[#E8ECF0] rounded-xl p-6 space-y-4">
                <Input label="Full name" value={profile.full_name || ''} onChange={e => setProfile((p: any) => ({ ...p, full_name: e.target.value }))} />
                <Button onClick={async () => {
                  await supabase.from('profiles').update({ full_name: profile.full_name }).eq('id', profile.id)
                  setMsg('Profile updated.')
                  setTimeout(() => setMsg(''), 3000)
                }}>Save Name</Button>
                <hr className="border-[#E8ECF0]" />
                <Button variant="outline" onClick={changePassword}>Change Password</Button>
                <hr className="border-[#E8ECF0]" />
                <div>
                  <p className="text-sm font-medium text-[#E11D48] mb-2">Danger Zone</p>
                  <Button variant="ghost" className="text-[#E11D48] border border-[#E11D48]" onClick={() => setDeleteModal(true)}>Delete Account</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Tabs>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
        <p className="text-[#6B7A8D] text-sm mb-4">This action is permanent and cannot be undone. Type <strong>DELETE</strong> to confirm.</p>
        <input
          type="text"
          value={deleteConfirm}
          onChange={e => setDeleteConfirm(e.target.value)}
          placeholder="DELETE"
          className="w-full border border-[#E8ECF0] rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-[#E11D48]"
        />
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button onClick={deleteAccount} disabled={deleteConfirm !== 'DELETE'}>Delete Account</Button>
        </div>
      </Modal>
    </div>
  )
}
