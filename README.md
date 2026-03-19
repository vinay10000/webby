# HTML Playground

A browser-based code editor for HTML, CSS, and JavaScript with live preview capabilities.

## Features

- Monaco editor with syntax highlighting and code completion
- Live preview with sandboxed iframe
- Single-file and multi-file editing modes
- Snippet sharing via unique URLs
- Local draft auto-save
- File upload and download
- Dark/light theme support
- Resizable split-pane layout

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **Database**: Supabase
- **Testing**: Vitest, React Testing Library, fast-check

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

ISC
