'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <Image
                src="/cbaker.jpg"
                alt="Colin Baker"
                fill
                className="object-cover rounded-full"
                sizes="(max-width: 768px) 192px, 192px"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Developer & Researcher passionate about building innovative solutions
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose dark:prose-invert max-w-none mb-16"
        >
          <h2 className="text-2xl font-semibold mb-4">Background</h2>
          <p className="mb-4">
            I am a software engineer with a passion for creating elegant solutions
            to complex problems. My journey in technology began...
          </p>

          <h2 className="text-2xl font-semibold mb-4">Skills & Expertise</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Full-stack Development</li>
            <li>Machine Learning</li>
            <li>System Architecture</li>
            <li>Cloud Computing</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Interests</h2>
          <p className="mb-4">
            Outside of coding, I enjoy exploring new technologies, contributing to
            open-source projects, and staying up-to-date with the latest industry
            trends.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
