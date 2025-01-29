# Building an Interactive Particle System with React

The interactive particle system on my homepage is one of the first things visitors notice. In this post, I'll walk through how I built it using React and TypeScript, focusing on performance and user interaction.

## The Core Concept

The particle system consists of three main components:
1. Individual particles with position, velocity, and color properties
2. A field manager that handles particle creation and updates
3. Mouse interaction handling for dynamic particle movement

## Implementation Details

Here's a simplified version of the particle class:

```typescript
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
```

## Performance Optimization

To maintain smooth animation, I implemented several optimizations:

1. **RequestAnimationFrame**: Using RAF instead of setInterval for smoother animations
2. **Canvas**: Rendering particles on canvas instead of DOM elements
3. **Quadtree**: Implementing a quadtree for efficient particle collision detection

## Mouse Interaction

The particles react to mouse movement using a simple force calculation:

```typescript
function applyMouseForce(particle: Particle, mouseX: number, mouseY: number) {
  const dx = mouseX - particle.x;
  const dy = mouseY - particle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < 100) {
    const force = (100 - distance) / 100;
    particle.vx += (dx / distance) * force;
    particle.vy += (dy / distance) * force;
  }
}
```

## Conclusion

Building this particle system was a fun exercise in combining visual aesthetics with performance optimization. The key was finding the right balance between visual complexity and smooth performance.

Check out the full source code on my [GitHub repository](https://github.com/Cbaker37/personal-website)!
