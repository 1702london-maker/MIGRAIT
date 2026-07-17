import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cookie Policy — Migrait' }

export default function CookiesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-4xl font-black text-[#0A0E1A] mb-2">Cookie Policy</h1>
        <p className="text-[#6B7A8D] mb-10">Last updated: July 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">What are cookies?</h2>
            <p className="text-[#6B7A8D] leading-relaxed">Cookies are small text files stored on your device when you visit a website. They allow the site to remember information about your visit, such as your login session.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">Cookies we use</h2>

            <div className="bg-[#F8FAFC] border border-[#E8ECF0] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider bg-gray-50 border-b border-[#E8ECF0]">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8ECF0]">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">sb-access-token</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">Authentication — keeps you logged in</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">Session</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">sb-refresh-token</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">Authentication — refreshes your login</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">60 days</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">migrait_admin</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">Admin panel authentication</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">8 hours</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">cookie_consent</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">Remembers your cookie preference</td>
                    <td className="px-4 py-3 text-[#6B7A8D]">1 year</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Essential</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[#6B7A8D] leading-relaxed mt-4">We do not use advertising, tracking, or analytics cookies. We do not share cookie data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">Managing cookies</h2>
            <p className="text-[#6B7A8D] leading-relaxed mb-3">You can control cookies through your browser settings. Note that disabling essential cookies will prevent you from logging into the platform. Instructions for common browsers:</p>
            <ul className="list-disc list-inside space-y-1 text-[#6B7A8D]">
              <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
              <li>Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
              <li>Safari: Preferences → Privacy → Manage Website Data</li>
              <li>Edge: Settings → Cookies and site permissions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0A0E1A] mb-3">Contact</h2>
            <p className="text-[#6B7A8D] leading-relaxed">Questions about our use of cookies: <a href="mailto:hello@migrait.app" className="text-[#E11D48] hover:underline">hello@migrait.app</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
