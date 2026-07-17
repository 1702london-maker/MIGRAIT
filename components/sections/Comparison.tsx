'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

type Cell = string | boolean

const rows: { feature: string; cells: Cell[] }[] = [
  { feature: 'Live migration dashboard', cells: [true, false, false, false] },
  { feature: 'AI field mapping', cells: [true, false, false, false] },
  { feature: 'Pre-migration validation', cells: [true, 'Partial', false, false] },
  { feature: 'Browser-based (no infra)', cells: [true, false, false, false] },
  { feature: 'White-label client portal', cells: [true, false, false, false] },
  { feature: '5M records < 2 hrs', cells: [true, '~4 hrs', '~2 hrs (flat)', 'Variable'] },
  { feature: 'Self-serve (no engineer)', cells: [true, false, false, false] },
]

function CellValue({ value, migrait }: { value: Cell; migrait?: boolean }) {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1 text-electric font-semibold">
        <Check size={18} />
      </span>
    )
  if (value === false) return <X size={18} className="inline text-slate" />
  return <span className={migrait ? 'text-electric font-semibold' : 'text-slate'}>{value}</span>
}

export function Comparison() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
            How We Compare
          </p>
          <h2 className="mt-4 font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
            What you get with Migrait that you can&apos;t get anywhere else.
          </h2>
        </div>
        <div className="mt-14 overflow-x-auto">
          <table className="w-full border-collapse text-[15px] min-w-[720px]">
            <thead>
              <tr className="bg-night text-white">
                <th className="text-left px-5 py-4 font-semibold rounded-tl-lg">Feature</th>
                <th className="px-5 py-4 font-semibold">Migrait</th>
                <th className="px-5 py-4 font-semibold">KingswaySoft</th>
                <th className="px-5 py-4 font-semibold">Azure Data Factory</th>
                <th className="px-5 py-4 font-semibold rounded-tr-lg">ClonePartner</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.feature} className={i % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'}>
                  <td className="px-5 py-4 text-night font-semibold border-b border-line">
                    {r.feature}
                  </td>
                  {r.cells.map((c, j) => (
                    <td key={j} className="px-5 py-4 text-center border-b border-line">
                      <CellValue value={c} migrait={j === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  )
}
