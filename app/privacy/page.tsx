import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy — Migrait' }

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-4xl font-black text-[#0A0E1A] mb-2">Privacy Policy</h1>
        <p className="text-[#6B7A8D] mb-10">Last updated: July 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">1. Introduction</h2>
            <p className="text-[#6B7A8D] leading-relaxed">Budruum Ltd (&ldquo;Migrait&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates the Migrait data migration platform at migrait.app. This Privacy Policy explains how we collect, use, and protect your personal data in compliance with the UK GDPR and the Data Protection Act 2018.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">2. Information We Collect</h2>
            <p className="text-[#6B7A8D] leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-1 text-[#6B7A8D]">
              <li>Account registration data: name, email address, company name</li>
              <li>Profile information you add to your account</li>
              <li>Data you upload or migrate through our platform</li>
              <li>Communications you send to us</li>
              <li>Technical data: IP address, browser type, pages visited, authentication tokens</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">3. How We Use Your Information</h2>
            <p className="text-[#6B7A8D] leading-relaxed mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#6B7A8D]">
              <li>Provide and operate the Migrait platform</li>
              <li>Process your data migrations</li>
              <li>Send transactional emails relating to your account and migrations</li>
              <li>Respond to support requests</li>
              <li>Improve our service</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="text-[#6B7A8D] leading-relaxed mt-3">Our lawful basis for processing is performance of a contract (providing our service to you) and legitimate interests (improving our platform and preventing fraud).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">4. Data Storage and Security</h2>
            <p className="text-[#6B7A8D] leading-relaxed">Your data is stored on Supabase infrastructure, hosted in the European Union. We use row-level security policies to ensure your organisation&apos;s data is isolated from other customers. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Transactional emails are sent via Resend, which is SOC 2 compliant. When billing is added, payments are processed by Stripe and card details are never stored on our servers.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">5. Data Retention</h2>
            <p className="text-[#6B7A8D] leading-relaxed">We retain your account data for the duration of your subscription and for up to 90 days after account closure, after which it is permanently deleted. Migration logs and quarantine records are retained for 12 months. You may request earlier deletion at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">6. Your Rights under UK GDPR</h2>
            <p className="text-[#6B7A8D] leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-[#6B7A8D]">
              <li>Access your personal data</li>
              <li>Rectify inaccurate personal data</li>
              <li>Erasure (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Restrict processing of your data</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Lodge a complaint with the ICO (ico.org.uk)</li>
            </ul>
            <p className="text-[#6B7A8D] leading-relaxed mt-3">To exercise any of these rights, contact us at hello@migrait.app. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">7. Cookies</h2>
            <p className="text-[#6B7A8D] leading-relaxed">We use essential cookies only for authentication and session management. We do not use advertising or tracking cookies. See our <a href="/cookies" className="text-[#E11D48] hover:underline">Cookie Policy</a> for details.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">8. Third Party Services</h2>
            <p className="text-[#6B7A8D] leading-relaxed">We use the following sub-processors: Supabase (database and authentication), Resend (transactional email), Vercel (hosting and edge network), Stripe (billing, when enabled), OpenAI (AI-powered field mapping suggestions — data is not used to train models under our API agreement). We have data processing agreements in place with each sub-processor.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">9. Contact Us</h2>
            <p className="text-[#6B7A8D] leading-relaxed">For any privacy queries, contact our data controller at: <a href="mailto:hello@migrait.app" className="text-[#E11D48] hover:underline">hello@migrait.app</a><br />Budruum Ltd, United Kingdom</p>
          </section>
        </div>
      </div>
    </div>
  )
}
