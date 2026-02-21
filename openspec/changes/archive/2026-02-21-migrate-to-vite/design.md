# Design: Migrate to Vite

## Architectural Overview

This migration replaces the Next.js framework with Vite while preserving the application's functionality. The key architectural insight is that this project is functionally a **client-side SPA** with a single API endpoint, making Next.js's server-side capabilities unnecessary overhead.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Client                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     Vite Dev Server                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │    │
│  │  │ index.html  │→ │  main.tsx   │→ │    App.tsx      │ │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ │    │
│  │                           │                             │    │
│  │              ┌────────────┼────────────┐               │    │
│  │              ▼            ▼            ▼               │    │
│  │        Components      Hooks        Data               │    │
│  │        (unchanged)   (unchanged)  (unchanged)          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              │ /api/chat (POST)                  │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                Netlify Functions                         │    │
│  │  ┌─────────────────────────────────────────────────┐   │    │
│  │  │              api/chat/route.ts                   │   │    │
│  │  │  ┌─────────────┐    ┌─────────────────────────┐│   │    │
│  │  │  │ Rate Limit  │ →  │     AI SDK Stream       ││   │    │
│  │  │  └─────────────┘    └─────────────────────────┘│   │    │
│  │  └─────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    OpenRouter API                        │    │
│  │                   (LLM Gateway)                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Component Migration Strategy

### Entry Point Transformation

**Before (Next.js App Router)**:
```
src/app/
├── layout.tsx      # HTML shell, metadata, providers
├── page.tsx        # Main page content
├── globals.css     # Global styles
└── api/chat/
    └── route.ts    # API endpoint
```

**After (Vite)**:
```
/
├── index.html      # HTML shell (static)
├── src/
│   ├── main.tsx    # React DOM render + providers
│   ├── App.tsx     # Main page content + SEO
│   └── app/
│       └── globals.css  # Global styles (unchanged path)
└── api/
    └── chat/
        └── chat.ts     # Netlify function
```

### Provider Stack Migration

The provider hierarchy moves from `layout.tsx` to `main.tsx`:

```tsx
// main.tsx
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
```

### Metadata Migration

Next.js Metadata API → react-helmet-async:

```tsx
// Before (layout.tsx)
export const metadata: Metadata = {
  title: { default: 'Tom Russell', template: '%s | Tom Russell' },
  description: 'Personal portfolio...',
  openGraph: { type: 'website', locale: 'en_US', ... },
};

// After (App.tsx)
import { Helmet } from 'react-helmet-async';

function App() {
  return (
    <>
      <Helmet>
        <title>Tom Russell - Portfolio</title>
        <meta name="description" content="Personal portfolio..." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        {/* ... */}
      </Helmet>
      {/* ... rest of app */}
    </>
  );
}
```

## API Route Migration

The chat API route requires minimal changes. Netlify Functions support the same request/response model:

```typescript
// Before: src/app/api/chat/route.ts
export async function POST(req: Request) {
  // ... implementation
  return result.toUIMessageStreamResponse();
}

// After: netlify/functions/chat.ts (same behavior, new location)
export async function POST(req: Request) {
  // ... identical implementation
  return result.toUIMessageStreamResponse();
}
```

The only structural change is the file location. Netlify deploys functions from `netlify/functions`.

## Build Configuration

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),           // React Fast Refresh
    tsconfigPaths(),   // Support @/ path aliases
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,        // Match current dev port
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### TypeScript Configuration

Remove Next.js plugin, update for Vite:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "react-jsx",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "api/**/*"]
}
```

## Development Workflow

### Local Development

```bash
npm run dev          # Vite dev server (localhost:3000)
# API calls proxy to Netlify dev or mock
```

For API testing locally, use `netlify dev` which runs functions:

```bash
netlify dev          # Full stack with functions (localhost:3000)
```

### Production Build

```bash
npm run build        # Vite build → dist/
netlify deploy --prod  # Deploy site + functions to Netlify
```

## Dependency Changes

### Add
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6.0.0 | Build tool |
| `vite-tsconfig-paths` | ^5.0.0 | Path alias resolution |
| `react-helmet-async` | ^2.0.0 | SEO metadata |

### Remove
| Package | Reason |
|---------|--------|
| `next` | Replaced by Vite |
| `eslint-config-next` | Next.js ESLint rules |

### Unchanged
All other dependencies remain compatible:
- `react`, `react-dom` (v19)
- `next-themes` (works without Next.js)
- `@ai-sdk/react`, `@ai-sdk/openai`, `ai` (framework-agnostic)
- `framer-motion`, `visx`, `recharts` (React libraries)
- `tailwindcss`, `postcss` (CSS processing)
- `vitest`, `playwright` (testing)

## Testing Impact

### Vitest (Unit Tests)
No changes required. Already uses Vite internally via `vitest.config.ts`.

### Playwright (E2E Tests)
Update `playwright.config.ts` webServer command:

```typescript
webServer: {
  command: 'npm run dev',  // Now starts Vite
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

All feature files and step definitions remain unchanged as they test UI behavior, not framework internals.

## Rollback Strategy

If issues arise post-migration:

1. Revert the migration commit
2. Run `npm install` to restore Next.js dependencies
3. Verify with `npm run dev` and `npm run test:all`

The migration is fully reversible as it's primarily file restructuring with no data changes.

## Security Considerations

- **API Key Protection**: `OPENROUTER_API_KEY` remains server-side only (in Netlify environment)
- **Rate Limiting**: Preserved in serverless function
- **CORS**: Handled by Netlify defaults or explicit function headers
- **No New Attack Surface**: Same endpoints, same authentication model
