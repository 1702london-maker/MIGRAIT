import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Request a demo — Migrait',
  description:
    'Request a live Migrait demo. See 5 million records migrate in under 2 hours. Contact hello@migrait.app.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-5 py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Contact</p>
        <h1 className="mt-6 font-black text-night text-[40px] md:text-[56px] leading-[1.08] tracking-[-2px]">
          Request a demo.
        </h1>
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <aside className="border border-line rounded-lg p-8 h-fit">
            <h2 className="font-semibold text-night text-[22px]">What happens next:</h2>
            <ol className="mt-5 space-y-4">
              {[
                "We'll review your request within 1 business day.",
                "We'll schedule a 30-minute demo call.",
                "You'll see Migrait run a live migration.",
              ].map((s, i) => (
                <li key={i} className="flex gap-3 text-night text-[15px] leading-relaxed">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-electric text-white font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-8 pt-6 border-t border-line text-sm text-slate space-y-2">
              <p>
                Contact:{' '}
                <a href="mailto:hello@migrait.app" className="text-electric font-semibold">
                  hello@migrait.app
                </a>
              </p>
              <p>
                Built by: Budruum Ltd —{' '}
                <a href="https://budruum.co.uk" className="text-electric font-semibold">
                  budruum.co.uk
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
