import React from 'react'
import BlogPostLayout from '@/components/blog/BlogPostLayout'
import { renderMarkdown, readMarkdownFile } from '@/utils/markdown'
import { Metadata } from 'next'
import PageWrapper from '@/components/animations/PageWrapper'

export const metadata: Metadata = {
  title: 'Building a Particle System with React',
  description: 'Learn how to create an engaging particle system animation using React and HTML Canvas.',
}

export default function ParticleSystemPost() {
  const markdownContent = readMarkdownFile('src/content/blog/building-a-particle-system.md')
  const content = renderMarkdown(markdownContent)
  
  return (
    <PageWrapper>
      <BlogPostLayout
        title="Building an Interactive Particle System with React"
        date="January 28, 2025"
        readTime="10 min read"
        tags={['React', 'Animation', 'Canvas', 'TypeScript']}
        content={content}
      />
    </PageWrapper>
  )
}
