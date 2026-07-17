'use client'

import { motion } from 'framer-motion'
import { MigraitIcon } from '@/components/MigraitIcon'

export default function Loading() {
  return (
    <div className="bg-white min-h-[60vh] flex items-center justify-center">
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MigraitIcon size={64} />
      </motion.div>
    </div>
  )
}
