# Tech Blog

A personal tech blog built with Next.js, TypeScript, and Tailwind CSS. Features static site generation with markdown posts and Google Analytics integration.

## Features

- 📝 Markdown-based blog posts with frontmatter
- 🎨 Tailwind CSS for styling
- 📊 Google Analytics integration
- 🚀 Static site generation for optimal performance
- 📱 Responsive design
- ✅ TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js (recommended version from package.json)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog in development mode.

### Building for Production

```bash
npm run build
```

This creates an optimized build with static export in the `out/` directory.

### Other Commands

```bash
npm run lint    # Run ESLint
npm test        # Run Jest tests
npm start       # Start production server
```

## Project Structure

```
├── components/     # React components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── pages/         # Next.js pages
├── posts/         # Markdown blog posts
├── public/        # Static assets
├── styles/        # CSS files
└── types/         # TypeScript type definitions
```

## Adding New Posts

1. Create a new markdown file in the `posts/` directory
2. Use the naming convention: `YYYY-MM-DD-title.md`
3. Include frontmatter with `title` and `date` fields:

```markdown
---
title: "Your Post Title"
date: "2024-01-01"
---

Your post content here...
```


## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Content**: Markdown with gray-matter
- **Testing**: Jest with React Testing Library
- **Analytics**: Google Analytics
