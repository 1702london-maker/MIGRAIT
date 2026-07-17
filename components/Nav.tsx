'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { MigraitLogo } from './MigraitLogo'

const sectionLinks = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it works' },
]

const pageLinks = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
]

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sectionLinks.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [pathname])

  const goToSection = (id: string) => {
    setOpen(false)
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push(`/#${id}`)
    }
  }

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: -8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.3, ease: 'easeOut' },
    }),
  }

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
          {sectionLinks.map((l, i) => (
            <motion.button
              key={l.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={linkVariants}
              onClick={() => goToSection(l.id)}
              className={`text-[15px] font-semibold transition-colors hover:text-electric ${
                activeSection === l.id ? 'text-electric' : 'text-night'
              }`}
            >
              {l.label}
            </motion.button>
          ))}
          {pageLinks.map((l, i) => (
            <motion.span
              key={l.href}
              custom={i + sectionLinks.length}
              initial="hidden"
              animate="visible"
              variants={linkVariants}
            >
              <Link
                href={l.href}
                className={`text-[15px] font-semibold transition-colors hover:text-electric ${
                  pathname === l.href ? 'text-electric' : 'text-night'
                }`}
              >
                {l.label}
              </Link>
            </motion.span>
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
          className="md:hidden p-2 text-night relative w-10 h-10"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          <motion.span
            className="absolute left-2 right-2 h-[2px] bg-night rounded"
            animate={open ? { rotate: 45, top: '50%' } : { rotate: 0, top: '35%' }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="absolute left-2 right-2 h-[2px] bg-night rounded top-1/2"
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="absolute left-2 right-2 h-[2px] bg-night rounded"
            animate={open ? { rotate: -45, top: '50%' } : { rotate: 0, top: '65%' }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden bg-white border-t border-line overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-4">
              {sectionLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => goToSection(l.id)}
                  className="text-left text-base font-semibold text-night"
                >
                  {l.label}
                </button>
              ))}
              {pageLinks.map((l) => (
                <Link
                  key={l.href}
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
