import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function Card({ className, children, header, footer }: CardProps) {
  return (
    <div className={cn('bg-white border border-[#E8ECF0] rounded-xl overflow-hidden', className)}>
      {header && <div className="px-6 py-4 border-b border-[#E8ECF0]">{header}</div>}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-[#E8ECF0] bg-gray-50">{footer}</div>}
    </div>
  )
}
