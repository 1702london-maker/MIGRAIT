import { cn } from '@/lib/utils'
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export function Input({ label, error, helper, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#0A0E1A] mb-1">{label}</label>}
      <input
        className={cn(
          'w-full border rounded-lg px-4 py-2.5 text-[#0A0E1A] placeholder:text-[#6B7A8D] text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 focus:border-[#E11D48] transition-colors',
          error ? 'border-[#E11D48]' : 'border-[#E8ECF0]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#E11D48]">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-[#6B7A8D]">{helper}</p>}
    </div>
  )
}
