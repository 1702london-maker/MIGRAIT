'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { MigraitLogo } from './MigraitLogo'

const links = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-white border-b border-line transition-shadow"
      style={{ boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none' }}
    >
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Migrait home" onClick={() => setOpen(false)}>
          <MigraitLogo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[15px] font-semibold text-night hover:text-electric transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <Link href="/contact" className="text-[15px] font-semibold text-slate hover:text-night transition-colors">
            Sign in
          </Link>
          <Link
            href="/contact"
            className="bg-electric text-white font-bold text-[15px] rounded-full px-5 py-2 hover:scale-105 transition-transform duration-150"
          >
            Request demo
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-night"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-line px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-base font-semibold text-night"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="text-base font-semibold text-slate" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link
            href="/contact"
            className="bg-electric text-white font-bold text-[15px] rounded-full px-5 py-2.5 text-center"
            onClick={() => setOpen(false)}
          >
            Request demo
          </Link>
        </div>
      )}
    </header>
  )
}
