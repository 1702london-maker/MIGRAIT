'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ExportButtonProps {
  data: Record<string, unknown>[]
  filename: string
  label?: string
}

export function ExportButton({ data, filename, label = 'Export CSV' }: ExportButtonProps) {
  const exportCsv = () => {
    if (!data.length) return
    const headers = Object.keys(data[0])
    const rows = [headers, ...data.map(row => headers.map(h => {
      const val = row[h]
      if (val === null || val === undefined) return ''
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str
    }))]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    a.download = `${filename}.csv`
    a.click()
  }

  return (
    <Button size="sm" variant="ghost" onClick={exportCsv}>
      <Download size={14} className="mr-1.5 inline" />
      {label}
    </Button>
  )
}
