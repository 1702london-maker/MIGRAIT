'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const inputClass =
  'w-full border border-line rounded-lg py-4 px-5 text-night placeholder:text-slate bg-white'

export function ContactForm() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    company: '',
    records_estimate: '<100k',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.company || !form.records_estimate) {
      setErrorMsg('Please fill in all required fields.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    const { error } = await supabase.from('demo_requests').insert(form)
    if (error) {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-line rounded-lg p-10 text-center">
        <p className="text-electric font-bold text-xl">Request received.</p>
        <p className="mt-2 text-slate">We&apos;ll be in touch within 1 business day.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Full name</span>
          <input className={`${inputClass} mt-2`} value={form.full_name} onChange={set('full_name')} placeholder="Jane Smith" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Email address</span>
          <input type="email" className={`${inputClass} mt-2`} value={form.email} onChange={set('email')} placeholder="jane@consultancy.com" />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Company name</span>
          <input className={`${inputClass} mt-2`} value={form.company} onChange={set('company')} placeholder="Your consultancy" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
            Estimated records per migration
          </span>
          <select className={`${inputClass} mt-2`} value={form.records_estimate} onChange={set('records_estimate')}>
            <option>&lt;100k</option>
            <option>100k–1M</option>
            <option>1M–5M</option>
            <option>5M+</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Message</span>
        <textarea
          rows={5}
          className={`${inputClass} mt-2 resize-y`}
          value={form.message}
          onChange={set('message')}
          placeholder="Tell us about your migration project…"
        />
      </label>
      <button
        onClick={handleSubmit}
        disabled={status === 'loading'}
        className="bg-electric text-white font-bold text-[15px] rounded-full px-8 py-4 hover:scale-105 transition-transform duration-150 disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === 'loading' ? 'Sending...' : 'Send request'}
      </button>
      {errorMsg && <p className="text-[#E11D48] text-sm font-semibold">{errorMsg}</p>}
    </div>
  )
}
