'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab { id: string; label: string }

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  children: (activeTab: string) => React.ReactNode
}

export function Tabs({ tabs, defaultTab, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)
  return (
    <div>
      <div className="border-b border-[#E8ECF0] flex gap-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              active === tab.id
                ? 'border-[#E11D48] text-[#E11D48]'
                : 'border-transparent text-[#6B7A8D] hover:text-[#0A0E1A]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children(active)}</div>
    </div>
  )
}
