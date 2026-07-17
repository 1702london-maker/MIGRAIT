'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MigraitLogo } from '@/components/MigraitLogo'
import { formatDistanceToNow } from 'date-fns'
import {
  LayoutDashboard, FolderOpen, Plug, Zap, GitBranch, AlertTriangle, Users, Settings, LogOut, Bell,
  Activity,
} from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/app/projects', icon: FolderOpen },
  { label: 'Connections', href: '/app/connections', icon: Plug },
  { label: 'Migrations', href: '/app/migrations', icon: Zap },
  { label: 'Field Maps', href: '/app/field-maps', icon: GitBranch },
  { label: 'Quarantine', href: '/app/quarantine', icon: AlertTriangle },
  { label: 'Team', href: '/app/team', icon: Users },
  { label: 'Activity', href: '/app/activity', icon: Activity },
  { label: 'Settings', href: '/app/settings', icon: Settings },
]

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<{ full_name: string; email: string; id: string } | null>(null)
  const [orgName, setOrgName] = useState('')
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*, organisations(name)').eq('id', data.user.id).single()
      if (p) {
        setProfile({ full_name: p.full_name, email: p.email, id: data.user.id })
        setOrgName((p as any).organisations?.name || '')

        // Load notifications
        const { data: notifs } = await supabase.from('notifications').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(20)
        setNotifications(notifs || [])

        // Subscribe realtime
        const channel = supabase.channel(`notifs-${data.user.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${data.user.id}` },
            payload => setNotifications(prev => [payload.new as any, ...prev])
          ).subscribe()
        return () => { supabase.removeChannel(channel) }
      }
    })
  }, [router])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex h-screen bg-gray-50">
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
            <button onClick={signOut} className="flex items-center gap-2 text-xs text-[#6B7A8D] hover:text-[#E11D48] transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E8ECF0] px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-sm font-semibold text-[#0A0E1A]">
            {nav.find(n => pathname.startsWith(n.href))?.label || 'Migrait'}
          </h1>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setShowNotifs(v => !v)}
                className="relative text-[#6B7A8D] hover:text-[#0A0E1A] p-1"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E11D48] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E8ECF0] rounded-xl shadow-lg z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8ECF0]">
                    <p className="text-sm font-semibold text-[#0A0E1A]">Notifications</p>
                    {unreadCount > 0 && (
                      <button onClick={async () => {
                        if (!profile) return
                        await supabase.from('notifications').update({ read: true }).eq('user_id', profile.id)
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                      }} className="text-xs text-[#E11D48] hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 5).length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-[#6B7A8D]">No notifications</div>
                    ) : notifications.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        onClick={() => { markRead(n.id); if (n.link) router.push(n.link) }}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-[#E8ECF0] last:border-0 ${!n.read ? 'bg-[#FFF5F7]' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-[#0A0E1A]">{n.title}</p>
                          {!n.read && <span className="w-2 h-2 bg-[#E11D48] rounded-full flex-shrink-0 mt-1" />}
                        </div>
                        <p className="text-xs text-[#6B7A8D] mt-0.5 line-clamp-1">{n.message}</p>
                        <p className="text-[10px] text-[#6B7A8D] mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-[#E8ECF0]">
                    <Link href="/app/notifications" onClick={() => setShowNotifs(false)} className="text-xs text-[#E11D48] hover:underline font-medium">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
