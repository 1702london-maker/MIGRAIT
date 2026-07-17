'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MigraitLogo } from '@/components/MigraitLogo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/app/dashboard')
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app/dashboard` },
    })
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <MigraitLogo />
      </div>
      <div className="border border-[#E8ECF0] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-[#0A0E1A] mb-6">Sign in to Migrait</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-[#0A0E1A] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-[#E8ECF0] rounded-lg px-4 py-3 text-[#0A0E1A] placeholder:text-[#6B7A8D] focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 focus:border-[#E11D48]"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-[#E11D48] text-sm font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E11D48] text-white font-bold py-3 rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 border-t border-[#E8ECF0]" />
          <span className="text-sm text-[#6B7A8D]">or</span>
          <div className="flex-1 border-t border-[#E8ECF0]" />
        </div>
        <button
          onClick={handleGoogle}
          className="w-full border border-[#E8ECF0] text-[#0A0E1A] font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/></svg>
          Sign in with Google
        </button>
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-[#6B7A8D]">
            <Link href="/reset-password" className="text-[#E11D48] hover:underline">Forgot password?</Link>
          </p>
          <p className="text-sm text-[#6B7A8D]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#E11D48] hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
