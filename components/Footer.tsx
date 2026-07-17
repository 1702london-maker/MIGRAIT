import Link from 'next/link'
import { MigraitLogo } from './MigraitLogo'

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Budruum.co.uk', href: 'https://budruum.co.uk' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/#' },
      { label: 'Terms of Service', href: '/#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <MigraitLogo size="sm" />
          <p className="mt-4 text-sm text-slate leading-relaxed">
            Migration, accelerated.
            <br />
            A Budruum product.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-slate mb-4">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-slate hover:text-night transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              {col.title === 'Legal' && <li className="text-sm text-slate">© 2026 Budruum Ltd</li>}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}
