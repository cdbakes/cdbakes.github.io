'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()

    // Create initial particles
    const initialParticles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }))

    setParticles(initialParticles)

    const updateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          // Bounce off walls
          if (newX < 0 || newX > width) {
            particle.speedX *= -1
            newX = particle.x + particle.speedX
          }
          if (newY < 0 || newY > height) {
            particle.speedY *= -1
            newY = particle.y + particle.speedY
          }

          // Mouse interaction
          const dx = mousePosition.x - newX
          const dy = mousePosition.y - newY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            const angle = Math.atan2(dy, dx)
            const force = (100 - distance) / 100
            newX -= Math.cos(angle) * force * 2
            newY -= Math.sin(angle) * force * 2
          }

          return {
            ...particle,
            x: newX,
            y: newY
          }
        })
      )
    }

    const animationFrame = setInterval(updateParticles, 1000 / 60)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      clearInterval(animationFrame)
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-blue-400 dark:bg-blue-300"
          animate={{
            x: particle.x,
            y: particle.y,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  )
}
