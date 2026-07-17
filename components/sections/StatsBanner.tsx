'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function CountUp({
  target,
  prefix = '',
  suffix = '',
  format = false,
  decimals = 0,
  start,
}: {
  target: number
  prefix?: string
  suffix?: string
  format?: boolean
  decimals?: number
  start: boolean
}) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let frame: number
    const t0 = performance.now()
    const duration = 2000
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, target])
  const display = format
    ? Math.round(value).toLocaleString()
    : value.toFixed(decimals)
  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

const stats = [
  { target: 5_000_000, format: true, suffix: '+', label: 'Records per migration' },
  { target: 2, prefix: '<', suffix: 'hrs', label: 'Per migration at full throughput' },
  { target: 99.98, decimals: 2, suffix: '%', label: 'Validation accuracy' },
  { target: 6, label: 'Source connectors' },
]

export function StatsBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-20"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-5 grid grid-cols-2 lg:grid-cols-4 text-center">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`py-6 px-4 ${i < stats.length - 1 ? 'lg:border-r lg:border-line' : ''} ${
              i % 2 === 0 ? 'border-r border-line lg:border-r' : ''
            }`}
          >
            <p className="font-black text-night text-3xl leading-none tabular-nums">
              <CountUp
                target={s.target}
                prefix={s.prefix}
                suffix={s.suffix}
                format={s.format}
                decimals={s.decimals}
                start={inView}
              />
            </p>
            <p className="mt-3 text-[13px] font-semibold uppercase tracking-[2px] text-slate">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
