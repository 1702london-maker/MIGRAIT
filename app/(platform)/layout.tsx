'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MigraitLogo } from '@/components/MigraitLogo'
import {
  LayoutDashboard, FolderOpen, Plug, Zap, GitBranch, AlertTriangle, Users, Settings, LogOut, Bell,
} from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/app/projects', icon: FolderOpen },
  { label: 'Connections', href: '/app/connections', icon: Plug },
  { label: 'Migrations', href: '/app/migrations', icon: Zap },
  { label: 'Field Maps', href: '/app/field-maps', icon: GitBranch },
  { label: 'Quarantine', href: '/app/quarantine', icon: AlertTriangle },
  { label: 'Team', href: '/app/team', icon: Users },
  { label: 'Settings', href: '/app/settings', icon: Settings },
]

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null)
  const [orgName, setOrgName] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*, organisations(name)').eq('id', data.user.id).single()
      if (p) {
        setProfile({ full_name: p.full_name, email: p.email })
        // @ts-ignore
        setOrgName(p.organisations?.name || '')
      }
    })
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#E8ECF0] flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-[#E8ECF0]">
          <MigraitLogo size="sm" />
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {nav.map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'text-[#E11D48] border-l-2 border-[#E11D48] bg-red-50'
                    : 'text-[#6B7A8D] hover:text-[#0A0E1A] hover:bg-gray-50 border-l-2 border-transparent'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        {profile && (
          <div className="px-5 py-4 border-t border-[#E8ECF0]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-sm font-bold">
                {profile.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#0A0E1A] truncate">{profile.full_name}</p>
                <p className="text-xs text-[#6B7A8D] truncate">{orgName}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-xs text-[#6B7A8D] hover:text-[#E11D48] transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E8ECF0] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-sm font-semibold text-[#0A0E1A]">
            {nav.find(n => pathname.startsWith(n.href))?.label || 'Migrait'}
          </h1>
          <div className="flex items-center gap-3">
            <button className="text-[#6B7A8D] hover:text-[#0A0E1A]"><Bell size={18} /></button>
            {profile && (
              <div className="w-8 h-8 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-sm font-bold">
                {profile.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
