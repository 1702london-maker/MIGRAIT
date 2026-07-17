import type { Metadata } from 'next'
import { Zap, Eye, MousePointerClick } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'Migrait was built because the tools we used were terrible.',
}

const diffs = [
  {
    icon: Zap,
    title: 'Speed',
    body: 'Parallel batch processing at Dataverse API maximum throughput. 5 million records under 2 hours.',
  },
  {
    icon: Eye,
    title: 'Visibility',
    body: 'Real-time dashboard. Every record. Every error. Every second. Visible to you and your client.',
  },
  {
    icon: MousePointerClick,
    title: 'Simplicity',
    body: 'Browser-based. No SQL Server. No SSIS. No Azure architect required. Connect and migrate.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">About</p>
        <h1 className="mt-6 font-black text-night text-[40px] md:text-[56px] leading-[1.08] tracking-[-2px]">
          We built Migrait because the tools we used were terrible.
        </h1>
        <p className="mt-6 mx-auto max-w-[620px] text-lg text-slate leading-relaxed">
          Migrait is built by a UK-based team that creates software solving real problems for
          businesses that cannot afford to waste time. We spent years watching data migration
          projects overrun, fail, and damage client relationships because the tools available were
          either too complex, too slow, or completely invisible to the client. So we built the tool
          we always wanted.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20 text-center">
        <h2 className="font-bold text-night text-[30px] md:text-[42px] tracking-[-1px]">
          Our mission
        </h2>
        <p className="mt-5 text-night text-lg leading-[1.7]">
          To make data migration fast, visible, and accessible to every consultancy in the world —
          not just the ones with a dedicated engineering team.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 text-center">
        <h2 className="font-bold text-night text-[30px] md:text-[42px] tracking-[-1px]">
          What Migrait does differently
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {diffs.map((d) => (
            <div
              key={d.title}
              className="border border-line bg-white rounded-xl p-8 hover:-translate-y-1 transition-transform duration-200"
            >
              <d.icon className="text-electric" size={28} />
              <h3 className="mt-5 font-semibold text-night text-[22px]">{d.title}</h3>
              <p className="mt-3 text-slate leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
