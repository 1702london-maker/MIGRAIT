import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

const variants = {
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
}

export function Badge({ variant = 'neutral', children, className, pulse }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  )
}

export function statusBadge(status: string) {
  const map: Record<string, { variant: BadgeProps['variant']; pulse?: boolean }> = {
    draft: { variant: 'neutral' },
    ready: { variant: 'info' },
    running: { variant: 'success', pulse: true },
    paused: { variant: 'warning' },
    completed: { variant: 'success' },
    failed: { variant: 'error' },
    pending: { variant: 'neutral' },
    validating: { variant: 'info', pulse: true },
    validated: { variant: 'info' },
    fixed: { variant: 'success' },
    ignored: { variant: 'neutral' },
  }
  const cfg = map[status] || { variant: 'neutral' }
  return <Badge variant={cfg.variant} pulse={cfg.pulse}>{status}</Badge>
}
