'use client'

import { useState } from 'react'

const inputClass =
  'w-full border border-line rounded-lg py-4 px-5 text-night placeholder:text-slate bg-white'

export function ContactForm() {
  const [done, setDone] = useState(false)
  const [fields, setFields] = useState({
    name: '',
    email: '',
    company: '',
    records: '<100k',
    message: '',
  })

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields({ ...fields, [key]: e.target.value })

  if (done) {
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
          <input className={`${inputClass} mt-2`} value={fields.name} onChange={set('name')} placeholder="Jane Smith" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Email address</span>
          <input type="email" className={`${inputClass} mt-2`} value={fields.email} onChange={set('email')} placeholder="jane@consultancy.com" />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Company name</span>
          <input className={`${inputClass} mt-2`} value={fields.company} onChange={set('company')} placeholder="Your consultancy" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
            Estimated records per migration
          </span>
          <select className={`${inputClass} mt-2`} value={fields.records} onChange={set('records')}>
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
          value={fields.message}
          onChange={set('message')}
          placeholder="Tell us about your migration project…"
        />
      </label>
      <button
        onClick={() => setDone(true)}
        className="bg-electric text-white font-bold text-[15px] rounded-full px-8 py-4 hover:scale-105 transition-transform duration-150"
      >
        Send request
      </button>
    </div>
  )
}
