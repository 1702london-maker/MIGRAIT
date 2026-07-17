'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs } from '@/components/ui/Tabs'
import { MigrationsPerDayChart } from '@/components/charts/MigrationsPerDayChart'
import { format, subDays } from 'date-fns'

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<any>({ orgs: [], users: [], migrations: [], waitlist: [], demos: [] })
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check admin cookie
    fetch('/api/admin/auth', { method: 'GET' }).then(res => {
      if (!res.ok) router.push('/admin/login')
    })

    const load = async () => {
      const fetchTable = async (table: string) => {
        const res = await fetch(`/api/admin/data?table=${table}`)
        if (!res.ok) return []
        const json = await res.json()
        return json.data || []
      }

      const [orgs, profiles, migs, waitlist, demos] = await Promise.all([
        fetchTable('organisations'),
        fetchTable('profiles'),
        fetchTable('migrations'),
        fetchTable('waitlist'),
        fetchTable('demo_requests'),
      ])

      setData({
        orgs,
        users: profiles,
        migrations: migs,
        waitlist,
        demos,
      })

      const last30 = Array.from({ length: 30 }, (_, i) => {
        const d = subDays(new Date(), 29 - i)
        const dateStr = format(d, 'MMM d')
        const count = profiles.filter((p: any) => format(new Date(p.created_at), 'MMM d') === dateStr).length
        return { date: dateStr, count }
      })
      setChartData(last30)
      setLoading(false)
    }
    load()
  }, [router])

  const totalRecords = (data.migrations as any[]).reduce((s: number, m: any) => s + (m.successful_records || 0), 0)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orgs', label: 'Organisations' },
    { id: 'users', label: 'Users' },
    { id: 'migrations', label: 'Migrations' },
    { id: 'waitlist', label: 'Waitlist' },
    { id: 'demos', label: 'Demo Requests' },
  ]

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-[#6B7A8D]">Loading admin…</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0A0E1A]">Migrait Admin</h1>
          <span className="text-xs text-[#6B7A8D] bg-white border border-[#E8ECF0] rounded-full px-3 py-1">Internal</span>
        </div>

        <Tabs tabs={tabs}>
          {(tab) => (
            <>
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Organisations', value: data.orgs.length },
                      { label: 'Users', value: data.users.length },
                      { label: 'Migrations', value: data.migrations.length },
                      { label: 'Records Migrated', value: totalRecords.toLocaleString() },
                    ].map(k => (
                      <div key={k.label} className="bg-white border border-[#E8ECF0] rounded-xl p-5">
                        <p className="text-xs text-[#6B7A8D] uppercase font-semibold">{k.label}</p>
                        <p className="text-3xl font-black text-[#0A0E1A] mt-1">{k.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-[#E8ECF0] rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-[#0A0E1A] mb-4">Signups — last 30 days</h2>
                    <MigrationsPerDayChart data={chartData} />
                  </div>
                </div>
              )}
              {tab === 'orgs' && (
                <AdminTable
                  cols={['Name', 'Plan', 'Created']}
                  rows={(data.orgs as any[]).map((o: any) => [o.name, o.plan, format(new Date(o.created_at), 'dd MMM yyyy')])}
                />
              )}
              {tab === 'users' && (
                <AdminTable
                  cols={['Name', 'Email', 'Organisation', 'Role', 'Joined']}
                  rows={(data.users as any[]).map((u: any) => [u.full_name, u.email, u.organisations?.name || '—', u.role, format(new Date(u.created_at), 'dd MMM yyyy')])}
                />
              )}
              {tab === 'migrations' && (
                <AdminTable
                  cols={['Project', 'Organisation', 'Status', 'Total', 'Successful', 'Started']}
                  rows={(data.migrations as any[]).map((m: any) => [
                    m.projects?.name || '—',
                    m.projects?.organisations?.name || '—',
                    m.status,
                    m.total_records?.toLocaleString() || '0',
                    m.successful_records?.toLocaleString() || '0',
                    m.started_at ? format(new Date(m.started_at), 'dd MMM HH:mm') : '—',
                  ])}
                />
              )}
              {tab === 'waitlist' && (
                <AdminTable
                  cols={['Email', 'Joined']}
                  rows={(data.waitlist as any[]).map((w: any) => [w.email, format(new Date(w.created_at), 'dd MMM yyyy HH:mm')])}
                />
              )}
              {tab === 'demos' && (
                <AdminTable
                  cols={['Name', 'Email', 'Company', 'Role', 'Submitted']}
                  rows={(data.demos as any[]).map((d: any) => [d.full_name, d.email, d.company, d.role, format(new Date(d.created_at), 'dd MMM yyyy')])}
                />
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  )
}

function AdminTable({ cols, rows }: { cols: string[]; rows: string[][] }) {
  return (
    <div className="bg-white border border-[#E8ECF0] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {cols.map(c => <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7A8D] uppercase tracking-wider">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8ECF0]">
            {rows.length === 0 ? (
              <tr><td colSpan={cols.length} className="px-4 py-8 text-center text-sm text-[#6B7A8D]">No records.</td></tr>
            ) : rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {row.map((cell, j) => <td key={j} className="px-4 py-3 text-sm text-[#0A0E1A]">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
