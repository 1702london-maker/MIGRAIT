'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DataPoint { time: string; records: number }

export function MigrationProgressChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E11D48" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#E11D48" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
        <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6B7A8D' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7A8D' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 12 }} />
        <Area type="monotone" dataKey="records" stroke="#E11D48" strokeWidth={2} fill="url(#roseGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
