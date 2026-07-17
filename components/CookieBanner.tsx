'use client'

import { useEffect, useState } from 'react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => { localStorage.setItem('cookie_consent', 'all'); setVisible(false) }
  const essential = () => { localStorage.setItem('cookie_consent', 'essential'); setVisible(false) }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8ECF0] shadow-lg">
      <div className="mx-auto max-w-6xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#0A0E1A]">We use cookies</p>
          <p className="text-xs text-[#6B7A8D] mt-0.5">
            We use essential cookies to keep you logged in. We do not use tracking or advertising cookies.{' '}
            <a href="/cookies" className="text-[#E11D48] hover:underline">Learn more</a>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={essential}
            className="px-4 py-2 text-sm font-medium text-[#6B7A8D] border border-[#E8ECF0] rounded-lg hover:border-[#0A0E1A] transition-colors"
          >
            Essential only
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium text-white bg-[#E11D48] rounded-lg hover:bg-[#C0152D] transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
