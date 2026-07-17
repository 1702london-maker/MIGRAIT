'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MigraitLogo } from '@/components/MigraitLogo'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('invite')
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', orgName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)

  useEffect(() => {
    if (!inviteToken) return
    supabase.from('team_invites').select('*, organisations(name)').eq('token', inviteToken).eq('status', 'pending').single()
      .then(({ data }) => {
        if (data) {
          setInviteData(data)
          setForm(f => ({ ...f, email: data.email, orgName: '' }))
        }
      })
  }, [inviteToken])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!inviteToken && !form.orgName.trim()) { setError('Organisation name is required.'); return }
    setLoading(true)

    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })
    if (signUpErr || !signUpData.user) { setError(signUpErr?.message || 'Signup failed.'); setLoading(false); return }

    if (inviteToken && inviteData) {
      await supabase.from('profiles').update({ organisation_id: inviteData.organisation_id, full_name: form.fullName, role: inviteData.role }).eq('id', signUpData.user.id)
      await supabase.from('team_invites').update({ status: 'accepted' }).eq('token', inviteToken)
    } else {
      const slug = form.orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()
      const { data: orgData, error: orgErr } = await supabase.from('organisations').insert({ name: form.orgName, slug }).select().single()
      if (orgErr || !orgData) { setError('Could not create organisation.'); setLoading(false); return }
      await supabase.from('profiles').update({ organisation_id: orgData.id, full_name: form.fullName, role: 'owner' }).eq('id', signUpData.user.id)
    }

    await fetch('/api/auth/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, name: form.fullName }),
    })

    router.push('/app/dashboard')
  }

  const fields = [
    { key: 'fullName', label: 'Full name', type: 'text', placeholder: 'Jane Smith' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
    ...(!inviteToken ? [{ key: 'orgName', label: 'Organisation name', type: 'text', placeholder: 'Acme Consulting Ltd' }] : []),
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { key: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8"><MigraitLogo /></div>
      <div className="border border-[#E8ECF0] rounded-2xl p-8">
        {inviteData && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            You've been invited to join <strong>{(inviteData.organisations as any)?.name}</strong> as <strong>{inviteData.role}</strong>.
          </div>
        )}
        <h1 className="text-2xl font-bold text-[#0A0E1A] mb-6">Create your account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-[#0A0E1A] mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={set(f.key)}
                required
                placeholder={f.placeholder}
                className="w-full border border-[#E8ECF0] rounded-lg px-4 py-3 text-[#0A0E1A] placeholder:text-[#6B7A8D] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 focus:border-[#E11D48]"
              />
            </div>
          ))}
          {error && <p className="text-[#E11D48] text-sm font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E11D48] text-white font-bold py-3 rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#6B7A8D]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#E11D48] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
