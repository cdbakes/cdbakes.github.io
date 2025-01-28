'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade' | 'slide' | 'scale' | 'rotate'
  delay?: number
}

export default function ScrollAnimation({
  children,
  className = '',
  animation = 'fade',
  delay = 0
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['0 1', '1.2 1']
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 0])

  const getAnimationProps = () => {
    switch (animation) {
      case 'fade':
        return { opacity }
      case 'slide':
        return { opacity, y }
      case 'scale':
        return { opacity, scale }
      case 'rotate':
        return { opacity, rotate }
      default:
        return { opacity }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      style={getAnimationProps()}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.17, 0.55, 0.55, 1]
      }}
    >
      {children}
    </motion.div>
  )
}
