'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'How does Migrait handle 5 million records so fast?',
    a: 'Migrait uses a parallel chunked batch engine. Records are split into chunks of 10,000 and processed across 8 parallel workers simultaneously. Each chunk is submitted to the Dataverse Batch API at 1,000 operations per request — the maximum allowed. This means we saturate the API at full throughput continuously, rather than processing records one at a time like traditional tools.',
  },
  {
    q: 'Do I need SQL Server or Azure to use Migrait?',
    a: 'No. Migrait is entirely browser-based. You connect your source system and Dynamics 365 destination through our web interface. There is no infrastructure to set up, no SSIS packages to configure, and no Azure subscription required beyond your existing Dynamics 365 environment.',
  },
  {
    q: 'What source systems does Migrait connect to?',
    a: 'In the current version, Migrait supports CSV upload, Excel upload, and SQL Server. Salesforce, SAP, and legacy on-premise CRM connectors are coming in Q3 2026.',
  },
  {
    q: 'What happens to records that fail validation?',
    a: 'Failed records are automatically routed to a quarantine queue. They do not touch the destination system. You can review every failed record, see the exact reason it failed, fix it, and re-run just those records without restarting the full migration.',
  },
  {
    q: 'Can my client watch the migration in real time?',
    a: 'Yes. Migrait generates a shareable read-only dashboard link. Your client can open it on any device and watch records move in real time — including records per second, estimated time to completion, error rate, and per-entity progress. No login required for the client view.',
  },
  {
    q: 'Is Migrait white-label ready?',
    a: 'Yes, on the Pro and Enterprise plans. You can apply your consultancy logo, primary colour, and custom domain to the client-facing dashboard.',
  },
  {
    q: 'How is my data secured?',
    a: 'All credentials are encrypted at rest using AES-256. OAuth2 tokens for Dynamics 365 are refreshed automatically and never stored as plaintext. Every migration runs in an isolated compute context. Full audit logs are exportable for GDPR and compliance requirements.',
  },
  {
    q: 'What is the difference between Migrait and KingswaySoft?',
    a: 'KingswaySoft is a powerful developer tool that requires SQL Server infrastructure, SSIS configuration, and a data engineer to operate. Migrait is a browser-based platform that any skilled Dynamics consultant can operate without a developer. Migrait also provides real-time visibility, AI field mapping, and a client-facing dashboard — none of which KingswaySoft offers.',
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">
            Frequently Asked Questions
          </p>
          <h2 className="mt-4 font-bold text-night text-[30px] md:text-[42px] leading-tight tracking-[-1px]">
            Everything you need to know.
          </h2>
        </div>
        <div className="mt-12">
          {faqs.map((f, i) => {
            const open = openIndex === i
            return (
              <div key={f.q} className="border-b border-line">
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                >
                  <span className="font-semibold text-night text-base">{f.q}</span>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-electric"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-slate text-[15px] leading-[1.7]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
