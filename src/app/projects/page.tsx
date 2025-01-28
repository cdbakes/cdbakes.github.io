'use client'

import { motion } from 'framer-motion'
import { FaGithub, FaGitlab, FaExternalLinkAlt } from 'react-icons/fa'

interface Project {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  gitlabUrl?: string
  liveUrl?: string
  image?: string
}

const projects: Project[] = [
  {
    title: "Singh Lab Project",
    description: "Research project focused on [project details]",
    technologies: ["Python", "Data Analysis"],
    githubUrl: "https://github.com/Cbaker37/singh-lab-project",
  },
  {
    title: "Peterson Lab Project",
    description: "Development work on [project details]",
    technologies: ["Python", "Machine Learning"],
    gitlabUrl: "https://gitlab.com/Cbaker37/peterson-lab-project",
  },
  // Add more projects here
]

export default function Projects() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A collection of my research and development work
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {project.image && (
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <FaGithub className="h-6 w-6" />
                    </a>
                  )}
                  {project.gitlabUrl && (
                    <a
                      href={project.gitlabUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <FaGitlab className="h-6 w-6" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <FaExternalLinkAlt className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
