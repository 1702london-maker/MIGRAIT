'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MigraitLogo } from '@/components/MigraitLogo'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/app/settings`,
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8"><MigraitLogo /></div>
      <div className="border border-[#E8ECF0] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#0A0E1A] mb-2">Reset your password</h1>
        <p className="text-[#6B7A8D] text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-[#0A0E1A] font-medium">Reset link sent.</p>
            <p className="text-[#6B7A8D] text-sm mt-1">Check your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-[#E8ECF0] rounded-lg px-4 py-3 text-[#0A0E1A] placeholder:text-[#6B7A8D] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 focus:border-[#E11D48]"
                placeholder="you@company.com"
              />
            </div>
            {error && <p className="text-[#E11D48] text-sm font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E11D48] text-white font-bold py-3 rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-[#6B7A8D]">
          <Link href="/login" className="text-[#E11D48] hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
