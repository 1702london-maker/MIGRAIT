'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    n: 1,
    title: 'Connect',
    body: 'Link your source (SQL Server, CSV, Salesforce, Dynamics legacy) and your Dynamics 365 destination.',
  },
  {
    n: 2,
    title: 'Map',
    body: 'Drag fields from source to destination. AI suggests matches at confidence scores.',
  },
  {
    n: 3,
    title: 'Validate',
    body: 'Run a full schema check before a single write happens.',
  },
  {
    n: 4,
    title: 'Migrate',
    body: 'Watch every record move in real time on your live dashboard.',
  },
]

export function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24 scroll-mt-16"
    >
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
          How Migrait Works
        </p>
        <h2 className="mt-4 font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
          From connection to completion in four steps.
        </h2>
        <div className="relative mt-16">
          <div className="hidden lg:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-line" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 text-left lg:text-center">
            {steps.map((s) => (
              <div key={s.n} className="relative flex lg:block gap-5">
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-electric text-white font-bold flex items-center justify-center lg:mx-auto">
                  {s.n}
                </div>
                <div>
                  <h3 className="mt-0 lg:mt-5 font-semibold text-night text-[22px]">{s.title}</h3>
                  <p className="mt-2 text-slate leading-relaxed text-[15px]">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
