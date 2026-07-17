'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const [invite, setInvite] = useState<any>(null)
  const [status, setStatus] = useState<'loading' | 'found' | 'not_found' | 'accepted' | 'declined' | 'error'>('loading')
  const [working, setWorking] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('team_invites').select('*, organisations(name)').eq('token', token).eq('status', 'pending').single()
      if (!data) { setStatus('not_found'); return }
      setInvite(data)
      setStatus('found')
    }
    load()
  }, [token])

  const accept = async () => {
    setWorking(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Update profile to join this org
      await supabase.from('profiles').update({ organisation_id: invite.organisation_id, role: invite.role }).eq('id', user.id)
      await supabase.from('team_invites').update({ status: 'accepted', accepted_at: new Date().toISOString() }).eq('token', token)
      setStatus('accepted')
      setTimeout(() => router.push('/app/dashboard'), 2000)
    } else {
      // Redirect to register with token
      router.push(`/register?invite=${token}`)
    }
  }

  const decline = async () => {
    setWorking(true)
    await supabase.from('team_invites').update({ status: 'declined' }).eq('token', token)
    setStatus('declined')
    setWorking(false)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8ECF0] rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#E11D48]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {status === 'loading' && <p className="text-[#6B7A8D]">Loading invitation...</p>}

        {status === 'not_found' && (
          <>
            <h1 className="text-xl font-bold text-[#0A0E1A] mb-2">Invitation not found</h1>
            <p className="text-[#6B7A8D] mb-6">This invitation has expired or already been used.</p>
            <Link href="/" className="text-[#E11D48] font-medium hover:underline">Go home</Link>
          </>
        )}

        {status === 'found' && invite && (
          <>
            <h1 className="text-xl font-bold text-[#0A0E1A] mb-2">You have been invited</h1>
            <p className="text-[#6B7A8D] mb-1">
              You have been invited to join <strong className="text-[#0A0E1A]">{invite.organisations?.name}</strong> on Migrait as a <strong className="text-[#0A0E1A]">{invite.role}</strong>.
            </p>
            <p className="text-sm text-[#6B7A8D] mb-6">{invite.email}</p>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={accept} disabled={working}>Accept invitation</Button>
              <Button variant="outline" className="flex-1" onClick={decline} disabled={working}>Decline</Button>
            </div>
          </>
        )}

        {status === 'accepted' && (
          <>
            <h1 className="text-xl font-bold text-[#0A0E1A] mb-2">Welcome to the team!</h1>
            <p className="text-[#6B7A8D]">Redirecting you to your dashboard...</p>
          </>
        )}

        {status === 'declined' && (
          <>
            <h1 className="text-xl font-bold text-[#0A0E1A] mb-2">Invitation declined</h1>
            <p className="text-[#6B7A8D] mb-4">You have declined the invitation.</p>
            <Link href="/" className="text-[#E11D48] font-medium hover:underline">Go home</Link>
          </>
        )}
      </div>
    </div>
  )
}
