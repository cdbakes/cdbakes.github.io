'use client';

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function HoverCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})`,
      }}
      className={`group p-6 rounded-xl 
        bg-gray-800/90 dark:bg-gray-200/90
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        relative overflow-hidden
        before:absolute before:inset-0
        before:bg-gradient-to-r before:from-transparent 
        dark:before:via-blue-500/10 dark:before:to-purple-500/10
        before:via-blue-400/5 before:to-purple-400/5
        after:absolute after:inset-0
        after:bg-gradient-to-r 
        dark:after:from-transparent dark:after:via-blue-500/10 dark:after:to-purple-500/10
        after:from-transparent after:via-blue-400/5 after:to-purple-400/5
        after:blur-xl after:-z-10 before:-z-10
        ${className}`}
    >
      <motion.div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="relative z-10"
      >
        <div className="text-gray-100 dark:text-gray-900">
          {children}
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-700/30 to-transparent dark:via-gray-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
