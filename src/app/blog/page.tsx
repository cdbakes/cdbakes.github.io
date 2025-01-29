import React from 'react'
import Link from 'next/link'
import { FaCalendar, FaClock } from 'react-icons/fa'

const blogPosts = [
  {
    slug: 'particle-system',
    title: 'Building an Interactive Particle System with React',
    excerpt: 'Learn how to create an engaging particle system animation using React and HTML Canvas.',
    date: 'January 28, 2025',
    readTime: '10 min read',
    tags: ['React', 'Animation', 'Canvas', 'TypeScript']
  },
  {
    slug: 'static-site-deployment',
    title: 'Deploying a Static Next.js Site to GitHub Pages',
    excerpt: 'A comprehensive guide to deploying your Next.js static site to GitHub Pages.',
    date: 'January 28, 2025',
    readTime: '8 min read',
    tags: ['Next.js', 'GitHub Pages', 'Deployment', 'Static Site']
  }
]

export default function Blog() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Thoughts, insights, and updates about my work
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts[0] && (
          <div className="mb-16">
            <Link href={`/blog/${blogPosts[0].slug}`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blogPosts[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendar className="mr-2" />
                    <span className="mr-4">{blogPosts[0].date}</span>
                    <FaClock className="mr-2" />
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.slice(1).map((post) => (
            <div key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendar className="mr-2" />
                      <span className="mr-4">{post.date}</span>
                      <FaClock className="mr-2" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
