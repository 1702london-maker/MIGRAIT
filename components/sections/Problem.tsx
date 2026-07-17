'use client'

import { motion } from 'framer-motion'
import { Box, Code2, EyeOff } from 'lucide-react'

const pains = [
  {
    icon: Box,
    title: 'Black box processing',
    body: 'You start the job. You wait. You hope. No progress. No ETA. No error visibility.',
  },
  {
    icon: Code2,
    title: 'Developer-only setup',
    body: 'KingswaySoft needs SQL Server. ADF needs an Azure architect. None of it runs in a browser.',
  },
  {
    icon: EyeOff,
    title: 'No client visibility',
    body: 'Your client asks "how long?" You can\'t answer.',
  },
]

export function Problem() {
  return (
    <motion.section
      id="features"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24 scroll-mt-16"
    >
      <div className="mx-auto max-w-[960px] px-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">The Problem</p>
        <h2 className="mt-4 font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
          Every migration tool makes you choose between speed and visibility.
        </h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {pains.map((p) => (
            <div
              key={p.title}
              className="border border-line bg-white rounded-lg p-8 hover:-translate-y-1 transition-transform"
            >
              <p.icon className="text-electric" size={28} />
              <h3 className="mt-5 font-semibold text-night text-[22px]">{p.title}</h3>
              <p className="mt-3 text-slate leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
