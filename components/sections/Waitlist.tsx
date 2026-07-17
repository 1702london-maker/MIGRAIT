'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = () => {
    if (!email.trim()) return
    setDone(true)
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
        {done ? (
          <p className="mt-8 text-electric font-bold text-lg">
            You&apos;re on the list. We&apos;ll be in touch.
          </p>
        ) : (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="you@consultancy.com"
              aria-label="Email address"
              className="flex-1 border border-line rounded-lg py-4 px-5 text-night placeholder:text-slate"
            />
            <button
              onClick={submit}
              className="bg-electric text-white font-bold text-[15px] rounded-full px-8 py-4 hover:scale-105 transition-transform duration-150 w-full sm:w-auto"
            >
              Join the waitlist
            </button>
          </div>
        )}
        <p className="mt-6 text-sm text-slate">
          No credit card. No commitment. migrait.app — A Budruum product.
        </p>
      </div>
    </motion.section>
  )
}
