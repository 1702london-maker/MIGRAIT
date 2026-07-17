'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

export function Hero() {
  const records = useCountUp(5_000_000)
  const hours = useCountUp(2)
  const accuracy = useCountUp(9998)

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-white flex items-center">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
          Migration · Accelerated
        </p>
        <h1 className="mt-6 font-black text-night text-[40px] md:text-[64px] leading-[1.05] tracking-[-2px]">
          Move 5 million records.
          <br />
          Under 2 hours.
        </h1>
        <p className="mt-6 mx-auto max-w-[560px] text-xl text-slate leading-relaxed">
          Migrait is the data migration platform built for consultancies. Connect any source. Map
          fields in minutes. Watch every record move in real time.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/contact"
            className="bg-electric text-white font-bold text-lg rounded-full px-8 py-4 hover:scale-105 transition-transform duration-150"
          >
            Request early access
          </Link>
          <Link href="/#how-it-works" className="text-electric font-bold text-[15px]">
            See how it works →
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div>
            <p className="text-3xl font-black text-night tabular-nums">
              {records.toLocaleString()}+
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[2px] text-slate">
              Records moved
            </p>
          </div>
          <div>
            <p className="text-3xl font-black text-night tabular-nums">&lt; {hours}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[2px] text-slate">
              Hours or less
            </p>
          </div>
          <div>
            <p className="text-3xl font-black text-night tabular-nums">
              {(accuracy / 100).toFixed(2)}%
            </p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[2px] text-slate">
              Accuracy %
            </p>
          </div>
        </motion.div>
        <p className="mt-6 text-xs text-slate">
          Based on Dataverse Batch API at maximum throughput
        </p>
      </div>
    </section>
  )
}
