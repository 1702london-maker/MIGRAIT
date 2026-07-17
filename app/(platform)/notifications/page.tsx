'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const typeIcon: Record<string, JSX.Element> = {
  migration_complete: <CheckCircle size={16} className="text-green-500" />,
  migration_failed: <AlertTriangle size={16} className="text-[#E11D48]" />,
  quarantine_alert: <AlertTriangle size={16} className="text-amber-500" />,
  invite: <Bell size={16} className="text-[#E11D48]" />,
  default: <Info size={16} className="text-[#6B7A8D]" />,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setNotifications(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0E1A]">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-[#6B7A8D] mt-0.5">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && <Button size="sm" variant="outline" onClick={markAllRead}>Mark all as read</Button>}
      </div>

      <div className="bg-white border border-[#E8ECF0] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#6B7A8D]">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={32} className="mx-auto text-[#E8ECF0] mb-3" />
            <p className="text-[#6B7A8D]">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8ECF0]">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-[#FFF5F7]' : ''}`}
                onClick={() => { markRead(n.id); if (n.link) window.location.href = n.link }}
              >
                <div className="mt-0.5 flex-shrink-0">{typeIcon[n.type] || typeIcon.default}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#0A0E1A]">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-[#E11D48] rounded-full flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-sm text-[#6B7A8D] mt-0.5">{n.message}</p>
                  <p className="text-xs text-[#6B7A8D] mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
