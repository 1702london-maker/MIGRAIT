'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { format } from 'date-fns'
import { UserPlus, Trash2 } from 'lucide-react'

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [orgId, setOrgId] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [inviteModal, setInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data: u } = await supabase.auth.getUser()
    if (!u.user) return
    const { data: p } = await supabase.from('profiles').select('*, organisations(name)').eq('id', u.user.id).single()
    if (!p?.organisation_id) { setLoading(false); return }
    setCurrentUser(p)
    setOrgId(p.organisation_id)
    const [{ data: m }, { data: i }] = await Promise.all([
      supabase.from('profiles').select('*').eq('organisation_id', p.organisation_id),
      supabase.from('team_invites').select('*').eq('organisation_id', p.organisation_id).eq('accepted', false),
    ])
    setMembers(m || [])
    setInvites(i || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const sendInvite = async () => {
    const token = crypto.randomUUID()
    await supabase.from('team_invites').insert({ organisation_id: orgId, email: inviteEmail, role: inviteRole, token, status: 'pending' })
    // Send invite email via API
    const { data: { user } } = await supabase.auth.getUser()
    const { data: p } = await supabase.from('profiles').select('full_name, organisations(name)').eq('id', user!.id).single()
    await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, inviterName: (p as any)?.full_name, orgName: (p as any)?.organisations?.name, role: inviteRole, token })
    })
    setInviteModal(false); setInviteEmail(''); setInviteRole('member'); load()
  }

  const revokeInvite = async (id: string) => {
    await supabase.from('team_invites').delete().eq('id', id)
    load()
  }

  const changeRole = async (memberId: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', memberId)
    load()
  }

  const removeMember = async (memberId: string) => {
    if (memberId === currentUser.id) return
    await supabase.from('profiles').update({ organisation_id: null }).eq('id', memberId)
    load()
  }

  const roleBadge = (role: string) => {
    const v: Record<string, 'info' | 'success' | 'neutral'> = { owner: 'success', admin: 'info', member: 'neutral' }
    return <Badge variant={v[role] || 'neutral'}>{role}</Badge>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A0E1A]">Team</h1>
        <Button onClick={() => setInviteModal(true)}><UserPlus size={16} className="mr-1 inline" />Invite Member</Button>
      </div>

      <div className="bg-white border border-[#E8ECF0] rounded-xl mb-6">
        <div className="px-6 py-4 border-b border-[#E8ECF0]"><p className="font-semibold text-[#0A0E1A]">Members</p></div>
        {loading ? <div className="p-6 text-[#6B7A8D]">Loading…</div> : (
          <div className="divide-y divide-[#E8ECF0]">
            {members.map(m => (
              <div key={m.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-sm font-bold">
                    {m.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0E1A]">{m.full_name}</p>
                    <p className="text-xs text-[#6B7A8D]">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {roleBadge(m.role)}
                  <p className="text-xs text-[#6B7A8D]">{format(new Date(m.created_at), 'dd MMM yyyy')}</p>
                  {currentUser?.role === 'owner' && m.id !== currentUser.id && (
                    <>
                      <select value={m.role} onChange={e => changeRole(m.id, e.target.value)} className="text-xs border border-[#E8ECF0] rounded px-2 py-1 focus:outline-none">
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                        <option value="owner">owner</option>
                      </select>
                      <button onClick={() => removeMember(m.id)} className="text-[#6B7A8D] hover:text-[#E11D48]"><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {invites.length > 0 && (
        <div className="bg-white border border-[#E8ECF0] rounded-xl">
          <div className="px-6 py-4 border-b border-[#E8ECF0]"><p className="font-semibold text-[#0A0E1A]">Pending Invites</p></div>
          <div className="divide-y divide-[#E8ECF0]">
            {invites.map(i => (
              <div key={i.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#0A0E1A]">{i.email}</p>
                  <p className="text-xs text-[#6B7A8D]">{i.role} · Invited {format(new Date(i.created_at), 'dd MMM yyyy')}</p>
                </div>
                <button onClick={() => revokeInvite(i.id)} className="text-xs text-[#E11D48] hover:underline">Revoke</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Invite Team Member">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Email address</label>
            <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="w-full border border-[#E8ECF0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E11D48]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Role</label>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full border border-[#E8ECF0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#E11D48]">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setInviteModal(false)}>Cancel</Button>
            <Button onClick={sendInvite} disabled={!inviteEmail.includes('@')}>Send Invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
