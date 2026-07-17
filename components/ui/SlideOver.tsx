'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative bg-white w-full max-w-lg h-full shadow-xl overflow-y-auto z-10"
          >
            <div className="sticky top-0 bg-white border-b border-[#E8ECF0] flex items-center justify-between px-6 py-4">
              {title && <h2 className="text-lg font-semibold text-[#0A0E1A]">{title}</h2>}
              <button onClick={onClose} className="text-[#6B7A8D] hover:text-[#0A0E1A] ml-auto"><X size={20} /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
