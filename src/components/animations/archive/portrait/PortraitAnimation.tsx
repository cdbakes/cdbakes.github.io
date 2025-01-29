'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { drawGeometricPortrait } from './GeometricAnimation';
import { drawLinePortrait } from './LineAnimation';
import { drawParticlePortrait } from './ParticleAnimation';
import { drawWireframePortrait } from './WireframeAnimation';
import { useTheme } from 'next-themes';

interface Props {
  mode?: 'geometric' | 'line' | 'particle' | 'wireframe';
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  velocity: number;
  angle: number;
}

const CANVAS_SIZE = 800;
const PARTICLE_COUNT = 2000;

export default function PortraitAnimation({ mode = 'geometric' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const animationFrame = useRef<number | null>(null);
  const particles = useRef<Particle[]>([]);
  const time = useRef<number>(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const loadImage = async () => {
      const img = new Image();
      img.src = '/IMG_7648.png';
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Draw image centered and cropped to face
      const size = Math.min(img.width, img.height);
      const centerX = (img.width - size) / 2;
      const centerY = (img.height - size) / 2;
      
      ctx.drawImage(
        img,
        centerX, centerY, size, size,
        0, 0, CANVAS_SIZE, CANVAS_SIZE
      );

      const data = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      setImageData(data);
      setIsLoading(false);
    };

    loadImage();
  }, [mode]);

  useEffect(() => {
    if (!imageData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles based on image data
    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let x, y;
        do {
          x = Math.random() * CANVAS_SIZE;
          y = Math.random() * CANVAS_SIZE;
        } while (!isPixelDark(imageData, Math.floor(x), Math.floor(y)));

        particles.current.push({
          x,
          y,
          targetX: x,
          targetY: y,
          size: Math.random() * 2 + 1,
          velocity: Math.random() * 2 + 1,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const isPixelDark = (imageData: ImageData, x: number, y: number) => {
      const index = (y * imageData.width + x) * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      return (r + g + b) / 3 < 128;
    };

    const animate = () => {
      time.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (mode) {
        case 'geometric':
          drawGeometricPortrait(ctx, imageData, time.current, isDark);
          break;
        case 'line':
          drawLinePortrait(ctx, imageData, time.current, isDark);
          break;
        case 'particle':
          drawParticlePortrait(ctx, particles.current, time.current, isDark);
          break;
        case 'wireframe':
          drawWireframePortrait(ctx, imageData, time.current, isDark);
          break;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [imageData, mode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-[800px] h-[800px]"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-full h-full"
      />
    </motion.div>
  );
}
