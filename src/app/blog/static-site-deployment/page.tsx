import React from 'react'
import BlogPostLayout from '@/components/blog/BlogPostLayout'
import { renderMarkdown, readMarkdownFile } from '@/utils/markdown'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deploying a Static Next.js Site to GitHub Pages',
  description: 'A comprehensive guide to deploying your Next.js static site to GitHub Pages.',
}

export default function StaticSitePost() {
  const markdownContent = readMarkdownFile('src/content/blog/static-site-deployment.md')
  const content = renderMarkdown(markdownContent)
  
  return (
    <BlogPostLayout
      title="Deploying a Static Next.js Site to GitHub Pages"
      date="January 28, 2025"
      readTime="8 min read"
      tags={['Next.js', 'GitHub Pages', 'Deployment', 'Static Site']}
      content={content}
    />
  )
}
