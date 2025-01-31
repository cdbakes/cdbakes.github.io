# Personal Website

This is my personal website built with [Next.js](https://nextjs.org), featuring an interactive molecular viewer, blog system, and dynamic UI components. The site showcases my work, thoughts, and interests in a modern, responsive design.

## Features

- **Interactive 3D Molecular Viewer**: Visualize molecular structures with dynamic animations
- **Blog System**: Markdown-based blog posts with syntax highlighting
- **Dark/Light Mode**: Theme support using next-themes
- **Responsive Design**: Built with Tailwind CSS for a mobile-first approach
- **Contact Form**: Secure contact form with reCAPTCHA integration
- **Performance Optimized**: Built with Next.js for optimal loading and rendering

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/components` - React components
- `/src/pages` - Next.js pages and API routes
- `/public/sdf` - Molecular structure files
- `/public/blog` - Blog post markdown files
- `/scripts` - Utility scripts for site maintenance

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run update-molecule` - Update molecular structure constants

## Molecule Updates

To update the molecule constants after modifying SDF files:

```bash
npm run update-molecule
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown processing
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## Deployment

I deployed this on GitHub pages, given the site is entirely static.
