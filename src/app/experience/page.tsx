'use client'

import { motion } from 'framer-motion'
import { FaGraduationCap, FaLaptopCode, FaFlask } from 'react-icons/fa'

interface Experience {
  title: string
  organization: string
  period: string
  description: string[]
  type: 'education' | 'work' | 'research'
}

const experiences: Experience[] = [
  {
    title: "Computational Biology Intern",
    organization: "Kojin Therapeutics",
    period: "06/2022 - 08/2022",
    description: [
      "Used machine learning and data science techniques to predict cancer cell dependencies on a large metabolomics dataset.",
      "Used python, scikit-learn, and tensorflow to develop models and select features.",
      "Statistically validated biomarkers of ferroptosis sensitivity in cancer cells."
    ],
    type: "work"
  },
  {
    title: "Research Assistant",
    organization: "Singh Lab",
    period: "06/2023 - Present",
    description: [
      "Formulated a relaxed variation of Augmented Gromov-Wasserstein (AGW) distance, a convex combination of Gromov-Wasserstein and Co-Optimal Transport distance, for single-cell multi-omic alignment.",
      "Developed an open source optimization package using pytorch for computing optimal transport coupling matrices up to and including relaxed AGW.",
      "Presented a poster at the 2024 iteration of Research in Computational Molecular Biology (RECOMB) and working towards a paper submission."
    ],
    type: "research"
  },
  {
    title: "Undergraduate Teaching Assistant",
    organization: "Computational Molecular Biology",
    period: "09/2023 - 12/2023",
    description: [
      "Held office hours and helped write conceptual questions for homeworks and exams.",
      "Developed a new project on learning hidden Markov model parameters from simulated sequence datasets.",
      "Wrote my first website!"
    ],
    type: "education"
  },
  {
    title: "Undergraduate Teaching Assistant",
    organization: "Algorithmic Foundations of Computational Biology",
    period: "01/2024 - 05/2024",
    description: [
      "Held more office hours and wrote a number of questions for both homeworks and exams.",
      "Developed a new project on approximation algorithms for protein folding in the hyrophobic-hydrophilic (HP) model on a 2D square lattice.",
    ],
    type: "education"
  },
  {
    title: "Research Assistant",
    organization: "Peterson Lab",
    period: "01/2024 - Present",
    description: [
      "Helped develop a method to solve the generalized Poisson equation primarily on a planewave basis.",
      "Implemented our new algorithm in the grid-based projector-augmented waves (GPAW) framework for use in implicit solvation electrostatic calculations.",
      "Working on generalizing our method to handle arbitrary boundary conditions on a mixed sine and plane wave basis."
    ],
    type: "research"
  },
  {
    title: "Research Assistant",
    organization: "Istrail Lab",
    period: "04/2024 - Present",
    description: [
      "Working on a method to compute contextualized hydrophobicity given a protein structure, with an adjacent statistical framework for evaluating fold likelihood.",
      "Generalizing combinatoric protein folding algorithms to handle real-valued hydrophobicities.",
      "Integrating both the statistical framework and lattice protein folding algorithms to improve the physical context of more modern deep learning methods for protein structure prediction, culminating in an honors thesis."
    ],
    type: "research"
  },
  {
    title: "Analyst Intern",
    organization: "Charles River Associates",
    period: "06/2024 - 08/2024",
    description: [
      "Developed causal models and manipulated large datasets in python for healthcare merger analysis.",
      "Used folium and tkinter to create a mapping application that automates the visualization of geographic data, used by the team to analyze regional anticompetitive concerns in general merger and litigation cases."
    ],
    type: "work"
  },
  {
    title: "Head Teaching Assistant",
    organization: "Introduction to Cryptography and Computer Security",
    period: "09/2024 - 12/2024",
    description: [
      "Held even more office hours, going through complex reductions with students of a variety of cryptography backgrounds.",
      "Worked with two other teaching assistants to coordinate assignments and grading.",
      "Wrote over 160 pages of solutions to all of the course content to help students understand the material better. Included both shorter and more detailed answers to ensure readibility."
    ],
    type: "education"
  },
  {
    title: "Head Teaching Assistant",
    organization: "Advanced Algorithms in Computational Biology and Medical Bioinformatics",
    period: "01/2025 - Present",
    description: [
      "Holding office hours and writing both conceptual and programming homework questions.",
      "Piloting a new type of assignment that requires students to present a paper on a topic in a new area of the course every three weeks.",
      "Presenting two lectures on protein folding while the professor is away in February with one of my research collaborators and fellow teaching assistants."
    ],
    type: "education"
  },
  {
    title: "Incoming Scientific Associate",
    organization: "D. E. Shaw Research",
    period: "12/2025 - Present",
    description: [
      "After graduating from Brown in May, I'll be heading off to DESRES to work on probabilistic methods in protein-ligand binding!",
    ],
    type: "work"
  },
]

const IconComponent = ({ type }: { type: Experience['type'] }) => {
  switch (type) {
    case 'education':
      return <FaGraduationCap className="h-6 w-6" />
    case 'work':
      return <FaLaptopCode className="h-6 w-6" />
    case 'research':
      return <FaFlask className="h-6 w-6" />
  }
}

export default function Experience() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Experience</h1>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800 transform -translate-x-1/2"></div>

          {/* Experience items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full transform -translate-x-1/2 flex items-center justify-center text-white">
                  <IconComponent type={exp.type} />
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{exp.title}</h3>
                    <div className="text-blue-600 dark:text-blue-400 mb-2">
                      {exp.organization}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {exp.period}
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      {exp.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
