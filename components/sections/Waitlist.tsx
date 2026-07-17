'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    const { error } = await supabase.from('waitlist').insert({ email })
    if (error) {
      if (error.code === '23505') {
        setErrorMsg('You are already on the waitlist.')
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
      setStatus('error')
    } else {
      setStatus('success')
      setEmail('')
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-xl px-5 text-center">
        <h2 className="font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
          Migrait is in early access.
        </h2>
        <p className="mt-4 text-slate text-lg">
          Join the waitlist and be first to migrate faster than you thought possible.
        </p>
        {status === 'success' ? (
          <p className="mt-8 text-night font-semibold text-lg">
            You are on the list. We will be in touch.
          </p>
        ) : (
          <>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="you@consultancy.com"
                aria-label="Email address"
                className="flex-1 border border-line rounded-lg py-4 px-5 text-night placeholder:text-slate"
              />
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="bg-electric text-white font-bold text-[15px] rounded-full px-8 py-4 hover:scale-105 transition-transform duration-150 w-full sm:w-auto disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
              </button>
            </div>
            {errorMsg && <p className="mt-3 text-left text-[#E11D48] text-sm font-semibold">{errorMsg}</p>}
          </>
        )}
        <p className="mt-6 text-sm text-slate">
          No credit card. No commitment. migrait.app — A Budruum product.
        </p>
      </div>
    </motion.section>
  )
}
