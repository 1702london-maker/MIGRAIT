'use client'

import { motion } from 'framer-motion'
import { Briefcase, Building2, Users } from 'lucide-react'

const cases = [
  {
    icon: Briefcase,
    title: 'Microsoft Dynamics Partners',
    body: 'Running a D365 implementation and need to migrate legacy CRM data? Migrait connects directly to Dataverse and handles the full ETL pipeline.',
  },
  {
    icon: Users,
    title: 'Independent Data Consultancies',
    body: 'Sell migration as a service. White-label Migrait under your brand. Your client sees your portal. You deliver in hours, not days.',
  },
  {
    icon: Building2,
    title: 'Enterprise IT Teams',
    body: 'Moving data between systems at scale? Migrait handles 5M+ records with full audit trail — ready for compliance and handover documentation.',
  },
]

export function BuiltFor() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Built For</p>
        <h2 className="mt-4 font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
          The consultancy that needs to deliver, fast.
        </h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {cases.map((c) => (
            <div
              key={c.title}
              className="border border-line bg-white rounded-lg p-8 hover:-translate-y-1 transition-transform duration-200"
            >
              <c.icon className="text-electric" size={28} />
              <h3 className="mt-5 font-semibold text-night text-[22px]">{c.title}</h3>
              <p className="mt-3 text-slate leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
