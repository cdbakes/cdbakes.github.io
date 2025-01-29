'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
  opacity: number
  color: string
  floatSpeed: number
  wobbleOffset: number
  wobbleSpeed: number
}

// Animation phases
const FORMATION_TIME = 4000    // Slower initial formation
const STABILIZE_TIME = 2000    // Time to settle in position
const FLOAT_TIME = 3000       // Slower float away

export default function ProteinAnimation({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const text = 'COLIN BAKER'
    ctx.font = 'bold 120px Arial'
    const metrics = ctx.measureText(text)
    const startX = (canvas.width - metrics.width) / 2
    const startY = canvas.height / 2

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width
    tempCanvas.height = canvas.height
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    tempCtx.font = ctx.font
    tempCtx.fillText(text, startX, startY)
    const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height)

    const particles: Particle[] = []
    for (let i = 0; i < canvas.width; i += 6) {
      for (let j = 0; j < canvas.height; j += 6) {
        if (imageData.data[(j * canvas.width + i) * 4 + 3] > 128) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            targetX: i,
            targetY: j,
            opacity: 1,
            color: `hsl(210, 80%, ${50 + Math.random() * 20}%)`,
            floatSpeed: 0.5 + Math.random() * 0.8, // Increased base float speed
            wobbleOffset: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.2 + Math.random() * 0.4
          })
        }
      }
    }

    const startTime = Date.now()

    function animate() {
      const now = Date.now()
      const elapsed = now - startTime
      
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      let anyParticleVisible = false
      
      particles.forEach(particle => {
        if (elapsed < FORMATION_TIME) {
          // Gentle formation phase
          const dx = particle.targetX - particle.x
          const dy = particle.targetY - particle.y
          
          // Weaker force for gentler movement
          const force = 0.008
          particle.vx += dx * force
          particle.vy += dy * force
          
          // Less randomness
          particle.vx += (Math.random() - 0.5) * 0.1
          particle.vy += (Math.random() - 0.5) * 0.1
          
          // Stronger damping for more stability
          particle.vx *= 0.92
          particle.vy *= 0.92
          
          particle.x += particle.vx
          particle.y += particle.vy
          particle.opacity = 1
          anyParticleVisible = true
        } 
        else if (elapsed < FORMATION_TIME + STABILIZE_TIME) {
          // Stabilization phase
          const stabilizeProgress = (elapsed - FORMATION_TIME) / STABILIZE_TIME
          const dx = particle.targetX - particle.x
          const dy = particle.targetY - particle.y
          
          // Very gentle movement to exact position
          particle.x += dx * 0.05
          particle.y += dy * 0.05
          
          // Subtle wobble during stabilization
          const microWobble = Math.sin(now * 0.001 + particle.wobbleOffset) * 0.2
          particle.x += microWobble * (1 - stabilizeProgress)
          
          particle.opacity = 1
          anyParticleVisible = true
        }
        else if (elapsed < FORMATION_TIME + STABILIZE_TIME + FLOAT_TIME) {
          // Float away phase with stronger upward force
          const floatProgress = (elapsed - FORMATION_TIME - STABILIZE_TIME) / FLOAT_TIME
          
          // Subtle wobble that decreases over time
          const wobble = Math.sin(now * 0.001 * particle.wobbleSpeed + particle.wobbleOffset) * 
                        (1 - floatProgress) * 1.5
          
          // Stronger upward movement with acceleration
          particle.x += wobble
          const acceleration = 1 + floatProgress * 1.5 // Increases as particles float up
          particle.y -= particle.floatSpeed * acceleration
          
          // Smooth fade out
          particle.opacity = Math.max(0, 1 - (floatProgress * 1.2))
          
          if (particle.opacity > 0) {
            anyParticleVisible = true
          }
        }

        // Draw particle if visible
        if (particle.opacity > 0) {
          ctx.beginPath()
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.opacity
          ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2)
          ctx.fill()

          // Softer glow effect
          const glow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, 9
          )
          glow.addColorStop(0, `rgba(66, 153, 225, ${0.25 * particle.opacity})`)
          glow.addColorStop(1, 'rgba(66, 153, 225, 0)')
          ctx.fillStyle = glow
          ctx.arc(particle.x, particle.y, 9, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Only trigger text fade after all particles are gone
      if (!anyParticleVisible && elapsed >= FORMATION_TIME + STABILIZE_TIME + FLOAT_TIME) {
        onComplete()
        return
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [onComplete, canvasRef, animationRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  )
}
