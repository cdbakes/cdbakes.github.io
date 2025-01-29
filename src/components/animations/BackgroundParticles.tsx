'use client';

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getRandomMoleculeConstants } from "@/utils/moleculeSelector";

// Get initial random molecule
const { MOLECULE_BONDS, ATOM_POSITIONS } = getRandomMoleculeConstants();

// Golden ratio for Fibonacci spiral
const PHI = (1 + Math.sqrt(5)) / 2;

// Molecule geometry from SDF file
// DNA and other constants
const DNA_HEIGHT = 1000;
const DNA_WIDTH = 35;
const DNA_CONNECTION_DISTANCE = DNA_HEIGHT / 3;  // Reduced connection check distance
const PARTICLES_PER_STRAND = 100;
const HELIX_ROTATION_SPEED = 0.0012;
const STRAND_SPACING = Math.PI;  // Half rotation offset between strands

// Animation and oscillation parameters
const OSCILLATION_SPEED = 0.002;
const OSCILLATION_AMOUNT = 2;
const OSCILLATION_PHASE = Math.PI / 2;
const FLOCKING_SPEED = 0.15;  // Increased from 0.1

// Molecule parameters
const MOLECULE_POINTS = ATOM_POSITIONS.length;
const BASE_MOLECULE_RADIUS = 200;
const MOLECULE_ROTATION_SPEED = 0.0005;
const PARTICLES_PER_SPHERE = 32;
const BASE_SPHERE_RADIUS = 15;
const WOBBLE_SPEED = 0.001;
const WOBBLE_AMOUNT = 0.4;
const BOND_WIDTH = 5;
const MOLECULE_FADE_SPEED = 1.2;  // Increased from 0.9
const FADE_START_RATIO = 0.47;
const SPHERE_CENTER_PARTICLES = 8;

// Layout constants
const CENTER_LINE = 0.5;
const MIN_SCALE = 0.6;
const MOBILE_BREAKPOINT = 768;
const CENTERED_Y_OFFSET = 0.2;
const MOLECULE_FLOCKING_SPEED = 0.04;  // Increased from 0.03

// Screen position for the molecule (0,0 is top-left, 1,1 is bottom-right)
const MOLECULE_CENTER = {
  x: 0.15,  // 20% from left edge
  y: 0.4   // 40% from top
};

// Background particle parameters
const BACKGROUND_PARTICLE_SPEED = 0.13;
const NUM_PARTICLES = 5000;
const BACKGROUND_RETURN_SPEED = 0.05;

interface Props {
  skipAnimation?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  originalSpeedX: number;
  originalSpeedY: number;
  opacity: number;
  inDNA: boolean;
  inMolecule: boolean;
  strand: number;
  moleculePoint?: number;
  sphereIndex?: number;
  targetX?: number;
  targetY?: number;
  id: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
}

export default function BackgroundParticles({ skipAnimation = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef<MousePosition>({ x: -1000, y: -1000 });
  const dnaPositionRef = useRef<Position>({ x: 0, y: 0 });
  const moleculePositionRef = useRef<Position>({ x: 0, y: 0 });
  const bondOpacityRef = useRef<number>(0);
  const isInRightSideRef = useRef(false);
  const isInLeftSideRef = useRef(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const isInRightSide = (x: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    return x > canvas.width * 0.5;
  };

  const isInLeftSide = (x: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    return x < canvas.width * 0.5;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasReady) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const currentlyInRightSide = isInRightSide(x);
    const currentlyInLeftSide = isInLeftSide(x);

    if (currentlyInRightSide !== isInRightSideRef.current) {
      isInRightSideRef.current = currentlyInRightSide;
      if (!currentlyInRightSide) {
        particles.current.forEach((p) => {
          if (p.inDNA) {
            p.inDNA = false;
            p.strand = 0;
            p.speedX = p.originalSpeedX;
            p.speedY = p.originalSpeedY;
          }
        });
      }
    }

    if (currentlyInLeftSide !== isInLeftSideRef.current) {
      isInLeftSideRef.current = currentlyInLeftSide;
      if (!currentlyInLeftSide) {
        particles.current.forEach((p) => {
          if (p.inMolecule) {
            p.inMolecule = false;
            p.moleculePoint = undefined;
            p.speedX = p.originalSpeedX;
            p.speedY = p.originalSpeedY;
          }
        });
      }
    }

    mouseRef.current = { x, y: e.clientY - rect.top };
  };

  const handleMouseLeave = () => {
    isInRightSideRef.current = false;
    isInLeftSideRef.current = false;
    mouseRef.current = { x: -1000, y: -1000 };
    bondOpacityRef.current = 0;
    particles.current.forEach((p) => {
      p.inDNA = false;
      p.inMolecule = false;
      p.strand = 0;
      p.moleculePoint = undefined;
      p.speedX = p.originalSpeedX;
      p.speedY = p.originalSpeedY;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initParticles = () => {
      const particleCount = NUM_PARTICLES;
      particles.current = Array.from({ length: particleCount }, (_, i) => {
        const speedX = (Math.random() - 0.5) * BACKGROUND_PARTICLE_SPEED;
        const speedY = (Math.random() - 0.5) * BACKGROUND_PARTICLE_SPEED;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX,
          speedY,
          originalSpeedX: speedX,
          originalSpeedY: speedY,
          opacity: Math.random() * 0.3 + 0.1,
          inDNA: false,
          inMolecule: false,
          strand: 0,
          id: i,
        };
      });
    };

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dnaPositionRef.current = {
        x: canvas.width * 0.85,
        y: canvas.height / 2,
      };
      moleculePositionRef.current = {
        x: canvas.width * MOLECULE_CENTER.x,
        y: canvas.height * MOLECULE_CENTER.y,
      };
      bondOpacityRef.current = 0;
      initParticles();
      setCanvasReady(true);
    };

    const getDNAPosition = (index: number, time: number) => {
      const strand = index >= PARTICLES_PER_STRAND ? 2 : 1;
      const strandIndex = strand === 2 ? index - PARTICLES_PER_STRAND : index;
      const verticalSpacing = canvas.height / PARTICLES_PER_STRAND;
      const y = strandIndex * verticalSpacing;
      
      // Add phase offset for second strand
      const phaseOffset = strand === 2 ? STRAND_SPACING : 0;
      const x = dnaPositionRef.current.x + Math.sin(time * HELIX_ROTATION_SPEED + strandIndex * 0.2 + phaseOffset) * DNA_WIDTH;
      
      return { x, y };
    };

    const getMoleculePoints = (rotation: number) => {
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      
      // Apply rotation to atom positions
      return ATOM_POSITIONS.map((p, i) => {
        const rotX = p.x * cos - p.z * sin;
        const rotZ = p.x * sin + p.z * cos;
        return {
          x: rotX,
          y: p.y,
          z: rotZ,
          size: i === 1 ? 1 : 0.8  // Make carbon (index 1) slightly larger
        };
      });
    };

    const animate = () => {
      if (!canvasReady) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now();
      const isDark = document.documentElement.classList.contains('dark');

      // Handle DNA formation
      if (isInRightSideRef.current) {
        const unassignedParticles = particles.current.filter(p => !p.inDNA);
        const strand1Count = particles.current.filter(p => p.strand === 1).length;
        const strand2Count = particles.current.filter(p => p.strand === 2).length;
        
        const neededForStrand1 = PARTICLES_PER_STRAND - strand1Count;
        const neededForStrand2 = PARTICLES_PER_STRAND - strand2Count;

        if (neededForStrand1 > 0 || neededForStrand2 > 0) {
          unassignedParticles
            .sort((a, b) => {
              const aDist = Math.abs(a.x - dnaPositionRef.current.x) + Math.abs(a.y - canvas.height / 2);
              const bDist = Math.abs(b.x - dnaPositionRef.current.x) + Math.abs(b.y - canvas.height / 2);
              return aDist - bDist;
            })
            .forEach((p, i) => {
              if (i < neededForStrand1) {
                p.inDNA = true;
                p.strand = 1;
                const pos = getDNAPosition(strand1Count + i, time);
                p.targetX = pos.x;
                p.targetY = pos.y;
              } else if (i < neededForStrand1 + neededForStrand2) {
                p.inDNA = true;
                p.strand = 2;
                const pos = getDNAPosition(PARTICLES_PER_STRAND + strand2Count + (i - neededForStrand1), time);
                p.targetX = pos.x;
                p.targetY = pos.y;
              }
            });
        }
      }

      // Handle molecule formation
      if (isInLeftSideRef.current) {
        const unassignedParticles = particles.current.filter(p => !p.inMolecule && !p.inDNA);
        const currentMoleculeParticles = particles.current.filter(p => p.inMolecule);
        
        // Calculate total particles needed (PARTICLES_PER_SPHERE for each atom)
        const totalParticlesNeeded = MOLECULE_POINTS * PARTICLES_PER_SPHERE;
        const neededParticles = totalParticlesNeeded - currentMoleculeParticles.length;

        if (neededParticles > 0) {
          // Sort particles by distance to molecule center
          unassignedParticles
            .sort((a, b) => {
              const aDist = Math.abs(a.x - moleculePositionRef.current.x) + Math.abs(a.y - moleculePositionRef.current.y);
              const bDist = Math.abs(b.x - moleculePositionRef.current.x) + Math.abs(b.y - moleculePositionRef.current.y);
              return aDist - bDist;
            })
            .slice(0, neededParticles)
            .forEach((p, i) => {
              const atomIndex = Math.floor(i / PARTICLES_PER_SPHERE);
              const sphereIndex = i % PARTICLES_PER_SPHERE;
              
              p.inMolecule = true;
              p.moleculePoint = atomIndex;
              p.sphereIndex = sphereIndex; // Assign fixed position within sphere
            });
        }
      }

      // Calculate responsive scaling based on screen size
      const width = canvas.width;
      const height = canvas.height;
      const scale = Math.max(MIN_SCALE, Math.min(1, width / 1200, height / 800));
      const MOLECULE_RADIUS = BASE_MOLECULE_RADIUS * scale;
      const SPHERE_RADIUS = BASE_SPHERE_RADIUS * scale;

      // Determine if we're in mobile view and if there's space for the molecule on the left
      const hasSpaceOnLeft = width > MOBILE_BREAKPOINT && width > 1000;

      // Position molecule based on available space
      let moleculeX, moleculeY;
      
      if (hasSpaceOnLeft) {
        // Position on left side
        moleculeX = width * MOLECULE_CENTER.x;
        moleculeY = height * MOLECULE_CENTER.y;
      } else {
        // Position higher up in center
        moleculeX = width * 0.5;
        moleculeY = height * CENTERED_Y_OFFSET;
      }
      
      moleculePositionRef.current.x = moleculeX;
      moleculePositionRef.current.y = moleculeY;

      // Calculate bond opacity based on mouse position with smooth fade
      const mouseXRatio = mouseRef.current.x / width;
      
      // Only calculate opacity if mouse is actually on screen
      let targetOpacity = 0;
      if (mouseRef.current.x > 0 && mouseRef.current.x < width) {
        if (mouseXRatio >= CENTER_LINE) {
          targetOpacity = 0;
        } else if (mouseXRatio <= FADE_START_RATIO) {
          targetOpacity = 1;
        } else {
          // Linear interpolation from fade start to center
          targetOpacity = 1 - (mouseXRatio - FADE_START_RATIO) / (CENTER_LINE - FADE_START_RATIO);
        }
      }
      
      bondOpacityRef.current += (targetOpacity - bondOpacityRef.current) * MOLECULE_FADE_SPEED;

      // Draw molecule bonds first (separate from particle loop)
      const points = getMoleculePoints(time * MOLECULE_ROTATION_SPEED);
      
      // Only draw bonds if mouse is on screen and opacity is non-zero
      if (bondOpacityRef.current > 0.01 && mouseRef.current.x > 0) {
        // Calculate sphere centers based on particle positions
        const sphereCenters = new Array(MOLECULE_POINTS).fill(null).map(() => ({ x: 0, y: 0, count: 0 }));
        
        particles.current.forEach(particle => {
          if (particle.inMolecule && particle.moleculePoint !== undefined) {
            // Only use particles near the center of each sphere for better center calculation
            const sphereIndex = particle.sphereIndex || 0;
            if (sphereIndex < SPHERE_CENTER_PARTICLES) {
              sphereCenters[particle.moleculePoint].x += particle.x;
              sphereCenters[particle.moleculePoint].y += particle.y;
              sphereCenters[particle.moleculePoint].count++;
            }
          }
        });
        
        // Average the positions to get sphere centers
        sphereCenters.forEach(center => {
          if (center.count > 0) {
            center.x /= center.count;
            center.y /= center.count;
          }
        });

        MOLECULE_BONDS.forEach(([i1, i2]) => {
          // Skip invalid bond indices
          if (i1 < 0 || i2 < 0 || i1 >= MOLECULE_POINTS || i2 >= MOLECULE_POINTS) return;
          
          const point1 = points[i1];
          const point2 = points[i2];
          
          // Use actual particle positions for bond endpoints
          const center1 = sphereCenters[i1];
          const center2 = sphereCenters[i2];
          
          // Skip if either center is missing or has no particles
          if (!center1 || !center2 || center1.count === 0 || center2.count === 0) return;
          
          // Calculate bond vector
          const dx = center2.x - center1.x;
          const dy = center2.y - center1.y;
          const bondLength = Math.sqrt(dx * dx + dy * dy);
          
          // Normalize the vector
          const ux = dx / bondLength;
          const uy = dy / bondLength;
          
          // Calculate sphere radii (adjusted for perspective)
          const radius1 = SPHERE_RADIUS * point1.size;
          const radius2 = SPHERE_RADIUS * point2.size;
          
          // Adjust start and end points to be at sphere surfaces
          const startX = center1.x + ux * radius1;
          const startY = center1.y + uy * radius1;
          const endX = center2.x - ux * radius2;
          const endY = center2.y - uy * radius2;
          
          // Draw single thick bond with synchronized fade
          ctx.beginPath();
          ctx.strokeStyle = isDark 
            ? `rgba(255, 255, 255, ${0.4 * bondOpacityRef.current})` 
            : `rgba(0, 0, 0, ${0.4 * bondOpacityRef.current})`;
          ctx.lineWidth = BOND_WIDTH;
          ctx.lineCap = 'round';
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        });
      }

      // Now draw all particles
      const dnaParticles = particles.current.filter(p => p.inDNA);
      const strand1Particles = dnaParticles.filter(p => p.strand === 1);
      const strand2Particles = dnaParticles.filter(p => p.strand === 2);

      particles.current.forEach((particle) => {
        if (particle.inDNA && particle.targetX !== undefined && particle.targetY !== undefined) {
          const index = particle.strand === 1 
            ? strand1Particles.indexOf(particle)
            : PARTICLES_PER_STRAND + strand2Particles.indexOf(particle);
          
          const pos = getDNAPosition(index, time);
          
          // Add random oscillation using time-based noise with phase difference
          const particlePhase = particle.id * 0.15;
          const timePhase = time * OSCILLATION_SPEED + particlePhase;
          const noiseX = Math.sin(timePhase) * OSCILLATION_AMOUNT;
          const noiseY = Math.cos(timePhase + OSCILLATION_PHASE) * OSCILLATION_AMOUNT;
          
          particle.targetX = pos.x + noiseX;
          particle.targetY = pos.y + noiseY;
          
          particle.x += (particle.targetX - particle.x) * FLOCKING_SPEED;
          particle.y += (particle.targetY - particle.y) * FLOCKING_SPEED;
          particle.opacity = particle.strand === 1 ? 0.7 : 0.5;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#fff' : '#000';
          ctx.fill();

          // Draw DNA connections (optimized)
          if (particle.strand === 1) {
            // Only check nearby particles in the same strand
            const nearbyParticles = strand1Particles.filter(p => 
              Math.abs(strand1Particles.indexOf(p) - strand1Particles.indexOf(particle)) <= 2
            );
            
            nearbyParticles.forEach(other => {
              if (other === particle) return;
              const dx = other.x - particle.x;
              const dy = other.y - particle.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < DNA_CONNECTION_DISTANCE) {
                ctx.beginPath();
                ctx.strokeStyle = isDark
                  ? `rgba(255, 255, 255, ${0.2 * (1 - dist / DNA_CONNECTION_DISTANCE)})`
                  : `rgba(0, 0, 0, ${0.2 * (1 - dist / DNA_CONNECTION_DISTANCE)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            });

            // Draw base pair to corresponding particle in strand 2
            const otherIndex = strand1Particles.indexOf(particle);
            const correspondingParticle = strand2Particles[otherIndex];
            
            if (correspondingParticle) {
              const gradient = ctx.createLinearGradient(
                particle.x, particle.y,
                correspondingParticle.x, correspondingParticle.y
              );
              
              if (isDark) {
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
              } else {
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
                gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
              }
              
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(correspondingParticle.x, correspondingParticle.y);
              ctx.stroke();
            }
          }
        } else if (particle.inMolecule && particle.moleculePoint !== undefined && particle.sphereIndex !== undefined) {
          const point = points[particle.moleculePoint];
          
          // Always use horizontal position for visibility check
          const shouldShowMolecule = mouseXRatio < CENTER_LINE;
            
          if (shouldShowMolecule) {
            // Calculate base position for this atom
            const baseX = moleculePositionRef.current.x + point.x * MOLECULE_RADIUS;
            const baseY = moleculePositionRef.current.y + point.y * MOLECULE_RADIUS;
            
            // Calculate spherical coordinates using golden ratio for even distribution
            const sphereIndex = particle.sphereIndex;
            
            // Map index to points on a sphere using golden ratio
            const latitude = Math.acos(1 - 2 * (sphereIndex + 0.5) / PARTICLES_PER_SPHERE);
            const longitude = 2 * Math.PI * sphereIndex / PHI;
            
            // Convert spherical to Cartesian coordinates
            const x = Math.sin(latitude) * Math.cos(longitude);
            const y = Math.sin(latitude) * Math.sin(longitude);
            const z = Math.cos(latitude);
            
            // Create complex wobble motion
            const t = time * WOBBLE_SPEED;
            const wobbleX = Math.sin(t + sphereIndex * 2.1) * Math.cos(t * 0.7);
            const wobbleY = Math.cos(t + sphereIndex * 1.9) * Math.sin(t * 0.8);
            const wobbleZ = Math.sin(t * 0.9 + sphereIndex * 1.5);
            
            // Apply wobble to coordinates
            const finalX = x + wobbleX * WOBBLE_AMOUNT;
            const finalY = y + wobbleY * WOBBLE_AMOUNT;
            const finalZ = z + wobbleZ * WOBBLE_AMOUNT;
            
            // Normalize to maintain sphere shape
            const length = Math.sqrt(finalX * finalX + finalY * finalY + finalZ * finalZ);
            const normalizedX = finalX / length;
            const normalizedY = finalY / length;
            const normalizedZ = finalZ / length;
            
            // Calculate final position with perspective scaling
            const scale = point.size * (1 + normalizedZ * 0.3);
            particle.targetX = baseX + normalizedX * SPHERE_RADIUS * scale;
            particle.targetY = baseY + normalizedY * SPHERE_RADIUS * scale;
            
            // Move towards target with dynamic speed based on distance
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = Math.min(MOLECULE_FLOCKING_SPEED * (1 + distance * 0.05), 0.2);
            
            particle.x += dx * speed;
            particle.y += dy * speed;
            
            // Adjust opacity based on z position and add slight randomness
            const baseOpacity = 0.15 + (1 + normalizedZ) * 0.35;
            particle.opacity = baseOpacity * (0.8 + Math.random() * 0.2);
            particle.size = 1.5;
          } else {
            // Return to original behavior when not showing molecule
            particle.speedX = particle.speedX * BACKGROUND_RETURN_SPEED + particle.originalSpeedX * (1 - BACKGROUND_RETURN_SPEED);
            particle.speedY = particle.speedY * BACKGROUND_RETURN_SPEED + particle.originalSpeedY * (1 - BACKGROUND_RETURN_SPEED);
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.opacity += (0.2 - particle.opacity) * 0.1;
          }
        } else {
          // Keep original speed for background particles
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Wrap around screen edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          particle.opacity += (0.2 - particle.opacity) * 0.1;
        }

        // Draw the particle
        ctx.beginPath();
        ctx.fillStyle = isDark 
          ? `rgba(255, 255, 255, ${particle.opacity})`
          : `rgba(0, 0, 0, ${particle.opacity})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [canvasReady]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: skipAnimation ? 0.5 : 2,
        delay: skipAnimation ? 0 : 4,
      }}
    />
  );
}
