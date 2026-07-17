import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Request a Demo',
  description:
    'See Migrait run a live migration. Request a demo and watch 5 million records move in real time.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate">Contact</p>
            <h1 className="mt-6 font-black text-night text-[40px] md:text-[56px] leading-[1.08] tracking-[-2px]">
              Request a demo.
            </h1>
            <p className="mt-5 text-slate text-lg max-w-[560px]">
              See Migrait run a live migration. We will show you exactly how fast your data can
              move.
            </p>
            <div className="mt-12">
              <ContactForm />
            </div>
          </div>
          <aside className="border border-line rounded-xl p-8 h-fit lg:mt-32">
            <h2 className="font-semibold text-night text-[22px]">What happens next</h2>
            <ol className="mt-5 space-y-4">
              {[
                'We review your request within 1 business day.',
                'We schedule a 30-minute demo call.',
                'You watch Migrait run a live migration on your data.',
              ].map((s, i) => (
                <li key={i} className="flex gap-3 text-night text-[15px] leading-relaxed">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-electric text-white font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-8 pt-6 border-t border-line text-sm text-slate space-y-4">
              <div>
                <p className="font-semibold text-night">Contact</p>
                <a href="mailto:hello@migrait.app" className="text-electric font-semibold">
                  hello@migrait.app
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
