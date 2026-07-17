import type { Metadata } from 'next'
import { PricingCards } from '@/components/PricingCards'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple transparent pricing for data migration consultancies. Start from £299 per project.',
}

const pricingFaqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. Pro plan includes a 14-day free trial, no credit card required.',
  },
  {
    q: 'Can I change plans?',
    a: 'Yes. Upgrade or downgrade at any time — changes take effect on your next billing date.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'All major credit and debit cards via Stripe. Invoice available on Enterprise.',
  },
]

export default function PricingPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Pricing</p>
        <h1 className="mt-6 font-black text-night text-[40px] md:text-[56px] leading-[1.08] tracking-[-2px]">
          Simple, transparent pricing.
        </h1>
        <p className="mt-5 text-slate text-lg">Start free. Scale as you grow. No hidden fees.</p>
        <PricingCards />
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {pricingFaqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-night text-base">{f.q}</h3>
              <p className="mt-2 text-slate text-[15px] leading-[1.7]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
