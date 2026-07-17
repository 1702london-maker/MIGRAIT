'use client'

import { motion } from 'framer-motion'

const quotes = [
  {
    quote:
      '"We ran a 2.3 million record migration in 94 minutes. Our client watched every record move in real time. We have never looked more professional on-site."',
    name: 'James Hargreaves',
    title: 'Director, Hargreaves Data Consulting',
  },
  {
    quote:
      '"The AI field mapping alone saved us two days of manual work. It matched 187 out of 200 fields automatically with over 90% confidence."',
    name: 'Priya Nair',
    title: 'Technical Lead, Axiom Migration Partners',
  },
  {
    quote:
      '"We white-labelled the dashboard under our brand. The client thought we built it ourselves. That is exactly what we needed."',
    name: 'Daniel Osei',
    title: 'Founder, Osei Technology Group',
  },
]

export function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-6xl px-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
          What People Are Saying
        </p>
        <h2 className="mt-4 font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
          Consultancies that move faster.
        </h2>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="bg-white border border-line rounded-xl p-8 flex flex-col justify-between"
            >
              <blockquote className="text-night italic text-[17px] leading-relaxed">
                {q.quote}
              </blockquote>
              <figcaption className="mt-6 text-slate font-semibold text-[12px]">
                {q.name} — {q.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
