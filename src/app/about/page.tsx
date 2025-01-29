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
            Researcher in computer science and computational chemistry
          </p>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose dark:prose-invert max-w-none mb-16"
        >

          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Numeric Optimization</li>
            <li>Machine Learning</li>
            <li>Scientific Computing</li>
            <li>Software Development</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Interests</h2>
          <p className="mb-4">
            Outside of coding, I enjoy playing video games and rowing. I also like to spend time with my 130lb Newfoundland, Minnie!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
