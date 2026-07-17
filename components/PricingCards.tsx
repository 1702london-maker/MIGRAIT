'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Starter',
    monthly: { price: '£299', period: '/ project', note: '' },
    annual: { price: '£2,870', period: '/ year', note: 'Save £718' },
    features: [
      'Up to 500,000 records per migration',
      'CSV and Excel source connectors',
      'Standard migration dashboard',
      'Pre-migration validator',
      'Email support',
      '1 user seat',
    ],
    cta: 'Get started',
    popular: false,
  },
  {
    name: 'Pro',
    monthly: { price: '£799', period: '/ month', note: '' },
    annual: { price: '£7,670', period: '/ year', note: 'Save £1,918' },
    features: [
      'Up to 5,000,000 records per migration',
      'All source connectors including SQL Server',
      'Live real-time dashboard',
      'AI field mapping with confidence scores',
      'Client shareable dashboard link',
      'White-label branding',
      'Priority support',
      '5 user seats',
    ],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: { price: 'Custom', period: '', note: '' },
    annual: { price: 'Custom', period: '', note: '' },
    features: [
      'Unlimited records',
      'All connectors including Salesforce and SAP',
      'Full white-label portal with custom domain',
      'Dedicated migration support',
      'SLA guarantee',
      'Unlimited user seats',
      'Custom onboarding',
      'Compliance export and audit logs',
    ],
    cta: 'Talk to us',
    popular: false,
  },
]

export function PricingCards() {
  const [annual, setAnnual] = useState(false)

  return (
    <>
      <div className="mt-10 inline-flex items-center gap-1 border border-line rounded-full p-1">
        <button
          onClick={() => setAnnual(false)}
          className={`px-5 py-2 rounded-full text-[15px] font-bold transition-colors ${
            !annual ? 'bg-electric text-white' : 'text-slate'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={`px-5 py-2 rounded-full text-[15px] font-bold transition-colors ${
            annual ? 'bg-electric text-white' : 'text-slate'
          }`}
        >
          Annual
        </button>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {tiers.map((t) => {
          const p = annual ? t.annual : t.monthly
          return (
            <div
              key={t.name}
              className={`relative rounded-xl p-8 bg-white flex flex-col ${
                t.popular ? 'border-2 border-[#E11D48]' : 'border border-line'
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-electric text-white text-[11px] font-semibold uppercase tracking-[2px] rounded-full px-4 py-1 whitespace-nowrap">
                  Most popular
                </span>
              )}
              <h2 className="font-semibold text-night text-[22px]">{t.name}</h2>
              <div className="mt-4 min-h-[64px]">
                <motion.p
                  key={annual ? 'annual' : 'monthly'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="font-black text-night text-4xl">{p.price}</span>
                  <span className="text-slate text-sm ml-1">{p.period}</span>
                  {p.note && (
                    <span className="block mt-1 text-electric text-sm font-bold">{p.note}</span>
                  )}
                </motion.p>
              </div>
              <ul className="mt-4 space-y-3 flex-1">
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
                    : 'border border-electric text-electric hover:bg-electric hover:text-white transition-colors'
                }`}
              >
                {t.cta}
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}
