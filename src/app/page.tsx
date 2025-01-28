"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import BackgroundParticles from "@/components/animations/BackgroundParticles";
import HoverCard from "@/components/ui/HoverCard";

const nameVariants = {
  initial: {
    opacity: 0,
    filter: "blur(10px)",
    y: 20,
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 1.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const letterVariants = {
  initial: { y: 20, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  }),
};

const descriptionVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(5px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 1 + i * 0.15,
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  }),
};

export default function Home() {
  const [showContent, setShowContent] = useState(true);
  const [showText, setShowText] = useState(true);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const animationCompleteRef = useRef(true);
  const proteinAnimationCompleteRef = useRef(true);

  const descriptions = [
    "Computational Chemist",
  ];

  const handleSkipAnimation = () => {
    if (!animationCompleteRef.current) {
      animationCompleteRef.current = true;
      proteinAnimationCompleteRef.current = true;
      setSkipAnimation(true);
      setShowContent(true);
      setShowText(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !animationCompleteRef.current) {
        e.preventDefault();
        handleSkipAnimation();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="relative">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900" />

        {/* Skip Animation Button */}
        {!showText && !skipAnimation && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={handleSkipAnimation}
            className="absolute top-4 right-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-white/70 dark:hover:text-white
              border border-gray-300 hover:border-gray-400 dark:border-white/20 dark:hover:border-white/40 rounded-full transition-colors
              bg-white/80 dark:bg-black/20 backdrop-blur-sm z-50"
          >
            Press Space to Skip
          </motion.button>
        )}

        {/* Background Particles */}
        <BackgroundParticles skipAnimation={skipAnimation} />

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <div className="space-y-8">
            {/* Name */}
            <div className="relative">
              <motion.h1
                variants={nameVariants}
                initial="initial"
                animate="animate"
                className="text-6xl md:text-8xl font-montserrat font-bold relative z-10 py-2 text-gray-800 dark:text-white"
              >
                <span className="relative inline-block">
                  {"Colin Baker".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={letterVariants}
                      initial="initial"
                      animate="animate"
                      className={`inline-block relative tracking-wide
                        ${letter === " " ? "mr-4" : ""}
                        hover:text-transparent hover:bg-clip-text
                        hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-500
                        transition-all duration-500`}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              {/* Decorative underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 1.5,
                  duration: 1,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-600 to-transparent dark:via-blue-400"
              />

              {/* Glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute inset-0 filter blur-3xl bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 z-0"
              />
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              {descriptions.map((desc, i) => (
                <motion.p
                  key={i}
                  custom={i}
                  variants={descriptionVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xl text-gray-600 dark:text-blue-200/90 font-light tracking-wide"
                >
                  {desc}
                </motion.p>
              ))}
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 2,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
              className="flex flex-col md:flex-row gap-4 justify-center pt-4"
            >
              <div className="flex gap-4 mt-4">
                <HoverCard className="inline-block">
                  <Link
                    href="/experience"
                    className="text-gray-100 dark:text-gray-900 hover:text-gray-300 dark:hover:text-gray-600"
                  >
                    Experience →
                  </Link>
                </HoverCard>
                <HoverCard className="inline-block">
                  <Link
                    href="/projects"
                    className="text-gray-100 dark:text-gray-900 hover:text-gray-300 dark:hover:text-gray-600"
                  >
                    Projects →
                  </Link>
                </HoverCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HoverCard className="h-full">
              <h3 className="text-gray-100 dark:text-gray-900 text-lg font-semibold mb-2">Research</h3>
              <p className="text-gray-300 dark:text-gray-600">
                I am a research assistant at Brown University, where I work on computational chemistry, from electronic structure theory to protein structure prediction.
                I am passionate about using chemical principles to guide my understanding of biological phenomena, particularly through statistical methods.
              </p>
            </HoverCard>

            <HoverCard className="h-full">
              <h3 className="text-gray-100 dark:text-gray-900 text-lg font-semibold mb-2">Teaching</h3>
              <p className="text-gray-300 dark:text-gray-600">
                I am a head teaching assistant for CSCI 2840: Advanced Algorithms in Computational Biology and Medical Bioinformatics at Brown University.
                I've previously worked on a range of other courses, including introductory computational biology and theoretical cryptography and computer security.
              </p>
            </HoverCard>

            <HoverCard className="h-full">
              <h3 className="text-gray-100 dark:text-gray-900 text-lg font-semibold mb-2">Education</h3>
              <p className="text-gray-300 dark:text-gray-600">
                I am currently in my final semester at Brown University, where I am majoring in Computer Science with a focus on biology and chemistry.
                I am grateful for to have taken a variety of unique courses at Brown, ranging from graduate machine learning to atomistic reaction engineering.
              </p>
            </HoverCard>
          </div>
        </div>
      </section>
    </div>
  );
}
