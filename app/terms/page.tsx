import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Service — Migrait' }

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-4xl font-black text-[#0A0E1A] mb-2">Terms of Service</h1>
        <p className="text-[#6B7A8D] mb-10">Last updated: July 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">1. Agreement to Terms</h2>
            <p className="text-[#6B7A8D] leading-relaxed">By accessing or using the Migrait platform at migrait.app, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service. These terms constitute a legally binding agreement between you and Migrait Ltd.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">2. Description of Service</h2>
            <p className="text-[#6B7A8D] leading-relaxed">Migrait is a B2B SaaS data migration platform that enables organisations to migrate data between systems with automated validation, field mapping, and real-time monitoring. We provide the tooling; you remain responsible for your source and destination data and systems.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">3. User Accounts</h2>
            <p className="text-[#6B7A8D] leading-relaxed">You must register for an account to access the platform. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You must provide accurate information and notify us immediately of any unauthorised use. Accounts may not be shared between individuals.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">4. Acceptable Use</h2>
            <p className="text-[#6B7A8D] leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#6B7A8D]">
              <li>Use the service to migrate data you do not have rights to process</li>
              <li>Attempt to reverse engineer, decompile, or access our source code</li>
              <li>Interfere with or disrupt the platform or servers</li>
              <li>Use the service for unlawful purposes</li>
              <li>Resell or sublicense access to the platform without our written consent</li>
              <li>Upload malicious code, viruses, or harmful content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">5. Data and Privacy</h2>
            <p className="text-[#6B7A8D] leading-relaxed">You retain ownership of all data you migrate through our platform. By using the service, you grant us a limited licence to process that data solely to provide the service. We act as a data processor on your behalf. Our use of your data is governed by our Privacy Policy and any Data Processing Agreement entered into with us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">6. Intellectual Property</h2>
            <p className="text-[#6B7A8D] leading-relaxed">The Migrait platform, including all software, designs, trademarks, and content, is owned by Migrait Ltd and protected by UK and international intellectual property laws. Nothing in these terms grants you any rights in our intellectual property except as expressly stated.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">7. Limitation of Liability</h2>
            <p className="text-[#6B7A8D] leading-relaxed">To the fullest extent permitted by law, Migrait Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the service. Our total liability shall not exceed the fees paid by you in the 12 months preceding the claim. Nothing in these terms limits liability for death or personal injury caused by negligence, fraud, or any liability that cannot be excluded by law.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">8. Termination</h2>
            <p className="text-[#6B7A8D] leading-relaxed">We may suspend or terminate your access immediately if you breach these terms. You may cancel your account at any time from your account settings. On termination, your data will be retained for 90 days before permanent deletion, during which time you may export it.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">9. Governing Law</h2>
            <p className="text-[#6B7A8D] leading-relaxed">These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">10. Changes to Terms</h2>
            <p className="text-[#6B7A8D] leading-relaxed">We may update these terms from time to time. We will notify you by email at least 14 days before material changes take effect. Continued use of the service after the effective date constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">11. Contact</h2>
            <p className="text-[#6B7A8D] leading-relaxed">Questions about these terms: <a href="mailto:hello@migrait.app" className="text-[#E11D48] hover:underline">hello@migrait.app</a><br />Migrait Ltd, United Kingdom</p>
          </section>
        </div>
      </div>
    </div>
  )
}
