'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DataPoint { date: string; count: number }

export function MigrationsPerDayChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7A8D' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7A8D' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="count" fill="#E11D48" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
