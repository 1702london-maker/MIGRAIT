import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Migrait',
  description:
    'Migrait is a Budruum product. Budruum Ltd is a UK-based founder studio building software that solves real problems.',
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">About</p>
        <h1 className="mt-6 font-black text-night text-[40px] md:text-[56px] leading-[1.08] tracking-[-2px]">
          We built Migrait because the tools we used were terrible.
        </h1>
        <p className="mt-6 mx-auto max-w-[560px] text-lg text-slate leading-relaxed">
          Migrait is a Budruum product. Budruum Ltd is a UK-based founder studio building software
          that solves real problems for businesses that can&apos;t afford to waste time.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">The Story</p>
        <h2 className="mt-4 font-bold text-night text-[30px] tracking-[-1px]">
          Why Migrait exists
        </h2>
        <div className="mt-6 space-y-5 text-night leading-[1.7]">
          <p>
            Every data migration project starts the same way: a consultancy wins the work, and then
            the tooling fight begins. KingswaySoft demands a SQL Server install and SSIS expertise.
            Azure Data Factory needs an Azure architect before a single record moves. And once the
            job finally starts, everyone — consultant and client alike — sits in the dark waiting
            for a black box to finish.
          </p>
          <p>
            We lived that gap on real Dynamics 365 implementations. Slow setup, zero visibility, no
            way to show a client what was happening with their own data. So we built the tool we
            wished existed: browser-based, AI-assisted mapping, full pre-migration validation, and a
            live dashboard you can hand straight to the client. 5 million records. Under 2 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-28">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">The Team</p>
        <h2 className="mt-4 font-bold text-night text-[30px] tracking-[-1px]">Built by Budruum Ltd</h2>
        <p className="mt-5 text-night leading-[1.7]">
          Migrait is designed, engineered, and supported by Budruum Ltd in the United Kingdom.{' '}
          <a href="https://budruum.co.uk" className="text-electric font-semibold">
            budruum.co.uk
          </a>
        </p>
      </section>
    </div>
  )
}
