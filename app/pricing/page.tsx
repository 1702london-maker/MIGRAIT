import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — Migrait',
  description:
    'Simple, transparent pricing for Migrait. Starter from £299 per project, Pro at £799 per month, and custom Enterprise plans.',
}

const tiers = [
  {
    name: 'Starter',
    price: '£299',
    period: '/ project',
    features: ['Up to 500k records', '5 source connectors', 'Standard dashboard', 'Email support'],
    cta: 'Get started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '£799',
    period: '/ month',
    features: [
      'Up to 5M records',
      'All connectors',
      'Live client dashboard',
      'Priority support',
      'AI field mapping',
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited records',
      'All connectors',
      'White-label portal',
      'Dedicated support',
      'SLA guarantee',
    ],
    cta: 'Talk to us',
    popular: false,
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
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-lg p-8 bg-white flex flex-col ${
                t.popular ? 'border-2 border-electric' : 'border border-line'
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-electric text-white text-[11px] font-semibold uppercase tracking-[2px] rounded-full px-4 py-1">
                  Most popular
                </span>
              )}
              <h2 className="font-semibold text-night text-[22px]">{t.name}</h2>
              <p className="mt-4">
                <span className="font-black text-night text-4xl">{t.price}</span>
                <span className="text-slate text-sm ml-1">{t.period}</span>
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-night text-[15px]">
                    <Check size={18} className="text-electric mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-8 text-center font-bold text-[15px] rounded-full px-6 py-3 transition-transform duration-150 hover:scale-105 ${
                  t.popular
                    ? 'bg-electric text-white'
                    : 'border border-line text-night hover:border-electric'
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
