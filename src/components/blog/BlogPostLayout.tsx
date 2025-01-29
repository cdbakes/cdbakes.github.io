import React from 'react'
import { FaCalendar, FaClock, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import 'highlight.js/styles/github-dark.css'

interface BlogPostLayoutProps {
  title: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

export default function BlogPostLayout({
  title,
  date,
  readTime,
  tags,
  content,
}: BlogPostLayoutProps) {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to blog
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{title}</h1>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            <FaCalendar className="mr-2" />
            <span className="mr-4">{date}</span>
            <FaClock className="mr-2" />
            <span>{readTime}</span>
          </div>

          <article 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  )
}
