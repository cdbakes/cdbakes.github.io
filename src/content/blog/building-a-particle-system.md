I had generative AI write the article below to test the functionality of blog posting statically :)

# Building a Molecular Particle System with React

In this article, I'll walk you through how I created the interactive molecular particle system that appears on the left side of my website. This system transforms floating background particles into a dynamic 3D molecule when you hover over the left side of the screen. Let's dive into the technical details and mathematics behind this animation.

## The Core Concept

The molecular particle system consists of three main states:
1. Background particles floating freely
2. Particles forming into atom spheres
3. Atoms connected by chemical bonds

The challenge was to create smooth transitions between these states while maintaining performance and visual appeal. The key to achieving this was implementing a sophisticated particle management system that could handle both the physics of free-floating particles and the precise positioning required for molecular visualization.

## Working with Molecular Data

One of the most interesting aspects of this system is its ability to display different molecules. The data comes from SDF (Structure Data Format) files, which are the standard file format in computational chemistry. These files contain 3D coordinates of atoms and their bonding information.

I created a script to process SDF files and convert them into TypeScript constants. Here's what the processed data looks like for caffeine:

```typescript
export const MOLECULE_BONDS: [number, number][] = [
  [0, 1], // Bond 1-2 (single)
  [0, 2], // Bond 1-3 (double)
  [0, 3], // Bond 1-4 (single)
  // ... more bonds
];

export interface AtomPosition {
  x: number;
  y: number;
  z: number;
}

export const ATOM_POSITIONS: AtomPosition[] = [
  { x: -0.1190, y: 0.0611, z: 0.0020 },   // N
  { x: -0.1160, y: -0.1633, z: 0.0008 },   // C
  { x: 0.0725, y: 0.1714, z: 0.0008 },    // N
  // ... more atom positions
];
```

The system currently supports several molecules including:
- Adamantane (C10H16)
- Caffeine (C8H10N4O2)
- Ethane (C2H6)
- Ferrocene (Fe(C5H5)2)
- Fullerene (C60)
- Methanol (CH3OH)
- Twistane (C10H16)

The molecule selection is handled by a utility that randomly picks a molecule on page load:

```typescript
export const getRandomMoleculeName = () => {
  const index = Math.floor(Math.random() * moleculeNames.length);
  return moleculeNames[index];
};

// Get molecule constants by name
export const getMoleculeConstants = (name: typeof moleculeNames[number]) => {
  return molecules[name];
};
```

## Particle Management

Each particle in the system is defined by a comprehensive set of properties that enable smooth transitions between states:

```typescript
interface Particle {
  x: number                // Current X position
  y: number                // Current Y position
  size: number             // Particle size
  speedX: number           // Current X velocity
  speedY: number           // Current Y velocity
  originalSpeedX: number   // Initial X velocity (for returning to background state)
  originalSpeedY: number   // Initial Y velocity (for returning to background state)
  opacity: number          // Current opacity
  inMolecule: boolean      // Whether particle is part of molecule
  moleculePoint?: number   // Which atom this particle belongs to
  sphereIndex?: number     // Position within atom sphere
  targetX?: number         // Target X position for transitions
  targetY?: number         // Target Y position for transitions
  id: number              // Unique identifier
}
```

## Smooth Particle Transitions

The most challenging aspect was creating smooth transitions as particles move between states. This is achieved through a sophisticated interpolation system that varies the movement speed based on distance:

```typescript
// Calculate final position with perspective scaling
const scale = point.size * (1 + normalizedZ * 0.3);
particle.targetX = baseX + normalizedX * SPHERE_RADIUS * scale;
particle.targetY = baseY + normalizedY * SPHERE_RADIUS * scale;

// Move towards target with dynamic speed based on distance
const dx = particle.targetX - particle.x;
const dy = particle.targetY - particle.y;
const distance = Math.sqrt(dx * dx + dy * dy);

// Speed increases with distance to prevent slow final approach
const speed = Math.min(MOLECULE_FLOCKING_SPEED * (1 + distance * 0.05), 0.2);

particle.x += dx * speed;
particle.y += dy * speed;
```

This approach creates a "flocking" behavior where particles:
1. Move faster when they're far from their target (quick initial response)
2. Naturally slow down as they approach their destination (smooth arrival)
3. Maintain some momentum to prevent abrupt stops
4. Preserve their ability to return to background movement

The speed calculation includes a distance multiplier (`1 + distance * 0.05`), which means:
- A particle 100 pixels away moves at ~6x base speed
- A particle 20 pixels away moves at ~2x base speed
- A particle 2 pixels away moves at ~1.1x base speed

This creates a natural, organic feel to the particle movement that avoids both the "robot-like" linear movement and the "never arriving" problem of pure exponential approaches.

## Molecule Formation Algorithm

When the mouse enters the left side of the screen, the system begins the molecule formation process. This involves several carefully orchestrated steps:

1. **Initial Particle Selection**:
   ```typescript
   const unassignedParticles = particles.current.filter(p => !p.inMolecule);
   const currentMoleculeParticles = particles.current.filter(p => p.inMolecule);
   ```

2. **Distance-Based Sorting**:
   ```typescript
   unassignedParticles
     .sort((a, b) => {
       const aDist = Math.abs(a.x - moleculePositionRef.current.x) + 
                    Math.abs(a.y - moleculePositionRef.current.y);
       const bDist = Math.abs(b.x - moleculePositionRef.current.x) + 
                    Math.abs(b.y - moleculePositionRef.current.y);
       return aDist - bDist;
     })
   ```
   This ensures that the closest particles are selected first, creating a more natural formation effect.

3. **Sphere Distribution**:
   The golden ratio (φ) is used to create an even distribution of particles around each atom:
   ```typescript
   const PHI = (1 + Math.sqrt(5)) / 2;
   
   // Map index to points on a sphere using golden ratio
   const latitude = Math.acos(1 - 2 * (sphereIndex + 0.5) / PARTICLES_PER_SPHERE);
   const longitude = 2 * Math.PI * sphereIndex / PHI;
   ```
   This creates a Fibonacci spiral pattern on the sphere's surface, providing optimal point distribution.

## Dynamic Wobble Effect

To make the molecule feel more organic, each particle has a unique wobble motion composed of multiple sine waves with different frequencies:

```typescript
const t = time * WOBBLE_SPEED;
const wobbleX = Math.sin(t + sphereIndex * 2.1) * Math.cos(t * 0.7);
const wobbleY = Math.cos(t + sphereIndex * 1.9) * Math.sin(t * 0.8);
const wobbleZ = Math.sin(t * 0.9 + sphereIndex * 1.5);

// Apply wobble while maintaining sphere shape
const finalX = x + wobbleX * WOBBLE_AMOUNT;
const finalY = y + wobbleY * WOBBLE_AMOUNT;
const finalZ = z + wobbleZ * WOBBLE_AMOUNT;
```

The different frequencies and phase offsets create a complex, organic motion that prevents the molecule from looking too rigid or artificial. The `sphereIndex` is used to ensure each particle has a unique wobble pattern, creating a more natural, fluid appearance.

## Chemical Bonds Visualization

The bond visualization system uses a combination of particle positions and molecule geometry to create smooth, dynamic bonds:

```typescript
// Calculate sphere centers based on particle positions
const sphereCenters = new Array(MOLECULE_POINTS).fill(null)
  .map(() => ({ x: 0, y: 0, count: 0 }));

// Average particle positions for each atom
particles.current.forEach(particle => {
  if (particle.inMolecule && particle.moleculePoint !== undefined) {
    if (particle.sphereIndex < SPHERE_CENTER_PARTICLES) {
      sphereCenters[particle.moleculePoint].x += particle.x;
      sphereCenters[particle.moleculePoint].y += particle.y;
      sphereCenters[particle.moleculePoint].count++;
    }
  }
});
```

The bonds are drawn using gradients and smooth transitions:

```typescript
const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

ctx.strokeStyle = gradient;
ctx.lineWidth = BOND_WIDTH;
ctx.lineCap = 'round';
```

## Performance Optimizations

Performance was a critical consideration throughout development. Key optimizations include:

1. **Efficient Particle Management**:
   - Particles are reused rather than created/destroyed
   - Background particles use simple physics calculations
   - Molecule particles use optimized position updates

2. **Smart Rendering**:
   ```typescript
   // Only draw bonds if opacity is significant
   if (bondOpacityRef.current > 0.01 && mouseRef.current.x > 0) {
     // Bond drawing logic
   }
   ```

3. **Adaptive Quality**:
   ```typescript
   const scale = Math.max(MIN_SCALE, Math.min(1, width / 1200, height / 800));
   const MOLECULE_RADIUS = BASE_MOLECULE_RADIUS * scale;
   const SPHERE_RADIUS = BASE_SPHERE_RADIUS * scale;
   ```

4. **Optimized State Updates**:
   - Using `useRef` for values that don't need to trigger renders
   - Batching particle updates
   - Minimizing state changes during animations

## Conclusion

This particle system demonstrates how complex scientific visualization can be combined with interactive web animations. The system maintains smooth performance while providing engaging visual feedback, making molecular structures more accessible and interesting to users.

The complete implementation can be found in the `BackgroundParticles.tsx` component of my website's source code. Feel free to explore and adapt this system for your own projects!
