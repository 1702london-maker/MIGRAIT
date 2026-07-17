'use client'

import { motion } from 'framer-motion'
import { Sparkles, Activity, ShieldCheck, Zap, Palette, Cloud } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Field Mapping',
    body: 'Stop mapping 200 fields manually. Migrait analyses your source schema and suggests matches with confidence scores. You review and confirm.',
  },
  {
    icon: Activity,
    title: 'Live Migration Dashboard',
    body: 'See records/sec, ETA, error rate, and per-entity progress in real time. Share a read-only link with your client during the migration.',
  },
  {
    icon: ShieldCheck,
    title: 'Pre-Migration Validator',
    body: 'Every record is validated against the destination schema before a single write begins. Broken records go to a quarantine queue — not the destination.',
  },
  {
    icon: Zap,
    title: 'Parallel Batch Engine',
    body: '10,000 records per chunk. 8 parallel workers. Dataverse Batch API at maximum throughput. 5 million records. Under 2 hours.',
  },
  {
    icon: Palette,
    title: 'White-Label Ready',
    body: "Apply your consultancy's branding to the client-facing dashboard. Your service. Your name. Migrait does the work.",
  },
  {
    icon: Cloud,
    title: 'Zero Infrastructure',
    body: 'No SQL Server. No Azure subscription setup. No SSIS. Open a browser, connect, migrate.',
  },
]

export function Features() {
  return (
    <motion.section
      id="features-detail"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24 scroll-mt-16"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
            What Sets Migrait Apart
          </p>
          <h2 className="mt-4 font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
            Built for consultancies. Not developers.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="border border-line bg-white rounded-lg p-8 hover:-translate-y-1 transition-transform duration-200"
            >
              <f.icon className="text-electric" size={28} />
              <h3 className="mt-5 font-semibold text-night text-[22px]">{f.title}</h3>
              <p className="mt-3 text-slate leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
