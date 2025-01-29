import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import fs from 'fs'
import path from 'path'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        return ''
      }
    }
    return ''
  }
})

export function renderMarkdown(content: string): string {
  return md.render(content)
}

export function readMarkdownFile(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath)
  return fs.readFileSync(fullPath, 'utf8')
}
