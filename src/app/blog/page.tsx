'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaCalendar, FaClock, FaTags } from 'react-icons/fa'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  coverImage?: string
}

const blogPosts: BlogPost[] = [
  {
    slug: 'post-1',
    title: 'Example Blog Post 1',
    excerpt: 'This is a brief description of the blog post content...',
    date: 'January 27, 2025',
    readTime: '5 min read',
    tags: ['Research', 'Technology'],
  },
  // Add more blog posts here
]

export default function Blog() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Thoughts, insights, and updates about my work
          </p>
        </motion.div>

        {/* Featured Post */}
        {blogPosts[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Link href={`/blog/${blogPosts[0].slug}`}>
              <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {blogPosts[0].coverImage && (
                  <div className="relative h-64 sm:h-80">
                    <img
                      src={blogPosts[0].coverImage}
                      alt={blogPosts[0].title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="h-4 w-4" />
                      {blogPosts[0].date}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {blogPosts[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: (index + 1) * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="group h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  {post.coverImage && (
                    <div className="relative h-48">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="h-4 w-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
