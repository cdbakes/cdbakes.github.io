# Deploying a Static Next.js Site to GitHub Pages

This website is built with Next.js and deployed as a static site on GitHub Pages. Here's how I set it up for optimal performance and easy deployment.

## Why Static?

Static sites offer several advantages:
1. Faster load times
2. Better security
3. Lower hosting costs
4. Simpler deployment

## Configuration Steps

### 1. Next.js Configuration

The key is to configure Next.js for static export in `next.config.js`:

```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
```

### 2. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Build
        run: |
          npm ci
          npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
```

## Handling Dynamic Content

Even with a static site, we can still have dynamic-feeling content:

1. Client-side animations
2. Form submissions to external services
3. Loading states and transitions

## Results

The site now achieves:
- Sub-second load times
- Perfect Lighthouse scores
- Automated deployments

The best part? It's all automated through GitHub Actions, making updates as simple as pushing to main.

## Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
