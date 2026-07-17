'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { statusBadge } from '@/components/ui/Badge'
import { MigrationsPerDayChart } from '@/components/charts/MigrationsPerDayChart'
import { format, subDays, formatDistanceToNow } from 'date-fns'
import { FolderPlus, Plug, AlertTriangle, Activity } from 'lucide-react'

interface KPI { totalMigrations: number; recordsMigrated: number; activeMigrations: number; successRate: number }

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7A8D]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#0A0E1A]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#6B7A8D]">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const [kpi, setKpi] = useState<KPI>({ totalMigrations: 0, recordsMigrated: 0, activeMigrations: 0, successRate: 0 })
  const [recentMigrations, setRecentMigrations] = useState<any[]>([])
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: p } = await supabase.from('profiles').select('organisation_id').eq('id', data.user.id).single()
      if (!p?.organisation_id) { setLoading(false); return }
      const oid = p.organisation_id

      const [migRes, projRes, actRes] = await Promise.all([
        supabase.from('migrations').select('*, projects(name)').eq('organisation_id', oid).order('created_at', { ascending: false }),
        supabase.from('projects').select('*').eq('organisation_id', oid).order('created_at', { ascending: false }).limit(5),
        supabase.from('activity_logs').select('*, profiles(full_name)').eq('organisation_id', oid).order('created_at', { ascending: false }).limit(10),
      ])

      const migs = migRes.data || []
      const totalMigrations = migs.length
      const recordsMigrated = migs.reduce((s, m) => s + (m.successful_records || 0), 0)
      const activeMigrations = migs.filter(m => m.status === 'running').length
      const completed = migs.filter(m => m.status === 'completed')
      const successRate = completed.length
        ? Math.round(completed.reduce((s, m) => s + (m.successful_records / (m.total_records || 1)), 0) / completed.length * 100)
        : 0

      setKpi({ totalMigrations, recordsMigrated, activeMigrations, successRate })
      setRecentMigrations(migs.slice(0, 5))
      setRecentProjects(projRes.data || [])
      setActivityLogs(actRes.data || [])

      const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = subDays(new Date(), 29 - i)
        const dateStr = format(d, 'MMM d')
        const count = migs.filter(m => format(new Date(m.created_at), 'MMM d') === dateStr).length
        return { date: dateStr, count }
      })
      setChartData(last30)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Migrations" value={kpi.totalMigrations} />
        <KpiCard label="Records Migrated" value={kpi.recordsMigrated.toLocaleString()} />
        <KpiCard label="Active Migrations" value={kpi.activeMigrations} />
        <KpiCard label="Success Rate" value={`${kpi.successRate}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#0A0E1A] mb-4">Recent Migrations</h2>
          {recentMigrations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7A8D] text-sm">No migrations yet.</p>
              <Link href="/app/projects" className="mt-2 inline-block text-sm text-[#E11D48] font-medium hover:underline">Create your first project</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMigrations.map(m => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-[#E8ECF0] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#0A0E1A]">{m.projects?.name || 'Unknown'}</p>
                    <p className="text-xs text-[#6B7A8D]">{m.total_records?.toLocaleString()} records</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(m.status)}
                    <Link href={`/app/migrations/${m.id}`} className="text-xs text-[#E11D48] hover:underline">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#0A0E1A] mb-4">Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7A8D] text-sm">No projects yet.</p>
              <Link href="/app/projects/new" className="mt-2 inline-block text-sm text-[#E11D48] font-medium hover:underline">Create a project</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#E8ECF0] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#0A0E1A]">{p.name}</p>
                    <p className="text-xs text-[#6B7A8D]">{format(new Date(p.created_at), 'dd MMM yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {statusBadge(p.status)}
                    <Link href={`/app/projects/${p.id}`} className="text-xs text-[#E11D48] hover:underline">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
        <h2 className="text-base font-semibold text-[#0A0E1A] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Project', href: '/app/projects/new', icon: FolderPlus },
            { label: 'Add Connection', href: '/app/connections/new', icon: Plug },
            { label: 'View Quarantine', href: '/app/quarantine', icon: AlertTriangle },
            { label: 'Activity Log', href: '/app/activity', icon: Activity },
          ].map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8ECF0] hover:border-[#E11D48] hover:bg-red-50 transition-colors text-center">
              <Icon size={20} className="text-[#E11D48]" />
              <span className="text-xs font-medium text-[#0A0E1A]">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#0A0E1A] mb-4">Migrations — last 30 days</h2>
          <MigrationsPerDayChart data={chartData} />
        </div>
        <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#0A0E1A] mb-4">Recent Activity</h2>
          {activityLogs.length === 0 ? (
            <p className="text-sm text-[#6B7A8D]">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activityLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#0A0E1A]">{log.action.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-[#6B7A8D]">{log.profiles?.full_name || 'System'} · {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
