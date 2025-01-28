interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  velocity: number;
  angle: number;
}

export function drawParticlePortrait(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  time: number,
  isDark = false
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  particles.forEach((particle, index) => {
    // Add some organic movement
    const noise = Math.sin(time * 0.002 + index * 0.1) * 2;
    const targetX = particle.targetX + noise;
    const targetY = particle.targetY + noise;

    // Move towards target
    const dx = targetX - particle.x;
    const dy = targetY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0.1) {
      particle.x += dx * 0.05;
      particle.y += dy * 0.05;
    }

    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = isDark 
      ? `rgba(255,255,255,${0.3 + Math.sin(time * 0.001 + index) * 0.2})`
      : `rgba(0,0,0,${0.3 + Math.sin(time * 0.001 + index) * 0.2})`;
    ctx.fill();

    // Draw connections to nearby particles
    particles.forEach((other, otherIndex) => {
      if (index === otherIndex) return;
      
      const connectionDx = other.x - particle.x;
      const connectionDy = other.y - particle.y;
      const connectionDist = Math.sqrt(connectionDx * connectionDx + connectionDy * connectionDy);
      
      if (connectionDist < 20) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = isDark
          ? `rgba(255,255,255,${0.1 * (1 - connectionDist / 20)})`
          : `rgba(0,0,0,${0.1 * (1 - connectionDist / 20)})`;
        ctx.stroke();
      }
    });
  });

  // Add some particle trails
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
  ctx.fillRect(0, 0, width, height);
}
