'use client'

import { motion } from 'framer-motion'
import { pageVariants } from '@/utils/animations'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}
