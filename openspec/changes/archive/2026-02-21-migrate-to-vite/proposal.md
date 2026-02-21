# Proposal: Migrate to Vite

## Change ID
`migrate-to-vite`

## Overview

Replace Next.js with Vite as the build tool and dev server, while maintaining all existing functionality. The chat API moves to Netlify Functions, and SEO metadata is handled via `react-helmet-async`.

## Problem Statement

The current Next.js setup introduces unnecessary complexity for what is fundamentally a single-page application:

1. **Server/Client Component Distinction**: 20+ components use `'use client'` directive despite being entirely client-side. This mental overhead provides no benefit for this SPA.

2. **Slower Dev Experience**: Next.js dev server has longer startup times and HMR compared to Vite, which is already used by Vitest in this project.

3. **Underutilized Features**: The project uses none of Next.js's differentiating features:
   - No ISR/SSG (single page, all content client-rendered)
   - No `next/image` optimization (uses SVGs and CSS)
   - No `next/link` (uses smooth scroll with `scrollIntoView`)
   - No middleware or server actions
   - No multi-page routing

4. **Inconsistent Tooling**: Vitest already uses Vite under the hood, but the main build uses Webpack via Next.js.

## Proposed Solution

Migrate to a Vite + React stack with Netlify Functions for the API:

### Architecture Change

```
BEFORE (Next.js)                    AFTER (Vite)
─────────────────────              ─────────────────────
src/app/layout.tsx     →           src/App.tsx + index.html
src/app/page.tsx       →           (merged into App.tsx)
src/app/api/chat/      →           netlify/functions/chat.ts (Netlify)
'use client' directive →           (removed - all client)
next.config.ts         →           vite.config.ts
```

### Key Changes

1. **Build Tool**: Next.js → Vite
2. **Entry Point**: `src/app/layout.tsx` + `page.tsx` → `index.html` + `src/main.tsx` + `src/App.tsx`
3. **API Route**: `src/app/api/chat/route.ts` → `netlify/functions/chat.ts` (Netlify Functions)
4. **SEO/Metadata**: Next.js Metadata API → `react-helmet-async`
5. **Client Directives**: Remove all `'use client'` lines (39 files)

### What Stays the Same

- React 19 (component library)
- Tailwind CSS 4 (styling)
- Framer Motion (animations)
- Visx/Recharts (visualizations)
- AI SDK (chat streaming)
- `next-themes` (works without Next.js)
- Vitest (testing - already Vite-based)
- Playwright BDD (e2e testing)
- Netlify deployment platform

## Design Decisions

### 1. Netlify Functions for API (vs. Hono/Express)

- **Decision**: Use Netlify Functions
- **Rationale**:
  - Zero server management
  - Existing `route.ts` code works with minimal changes
  - AI SDK works with this deployment model
  - Already deploying to Netlify
- **Alternative Considered**: Hono server running alongside Vite
  - Rejected: Adds operational complexity for a single endpoint

### 2. react-helmet-async for SEO (vs. manual meta tags)

- **Decision**: Use `react-helmet-async` for metadata
- **Rationale**:
  - Declarative API similar to Next.js Metadata
  - React component-based approach
  - Well-tested library (4M+ weekly downloads)
- **Alternative Considered**: Manual meta tags in index.html
  - Rejected: Less maintainable, no dynamic capability

### 3. Keep next-themes (vs. custom implementation)

- **Decision**: Continue using `next-themes` package
- **Rationale**:
  - Despite the name, works without Next.js (uses localStorage + CSS classes)
  - Already integrated and working
  - Handles SSR hydration edge cases
- **Validation**: Tested that `next-themes` works in Vite projects

### 4. Flat Source Structure (vs. client/server split)

- **Decision**: Keep `src/` structure largely unchanged
- **Rationale**:
  - Minimal file moves required
  - Components, data, hooks, lib stay in place
  - Only add `src/main.tsx` and `src/App.tsx`
- **Alternative Considered**: Separate `src/client/` and `src/server/`
  - Rejected: Overkill for single API endpoint

## Impact Analysis

### Files Created
| File | Purpose |
|------|---------|
| `index.html` | Vite entry point |
| `vite.config.ts` | Vite configuration |
| `src/main.tsx` | React DOM render entry |
| `src/App.tsx` | Root component (from layout + page) |
| `netlify/functions/chat.ts` | Netlify function |

### Files Deleted
| File | Reason |
|------|--------|
| `src/app/layout.tsx` | Merged into App.tsx |
| `src/app/page.tsx` | Merged into App.tsx |
| `src/app/api/chat/route.ts` | Moved to api/ |
| `next.config.ts` | Replaced by vite.config.ts |
| `next-env.d.ts` | Next.js types no longer needed |

### Files Modified
| File | Change |
|------|--------|
| `package.json` | Update scripts, dependencies |
| `tsconfig.json` | Remove Next.js plugin |
| `playwright.config.ts` | Update dev command |
| 39 component files | Remove `'use client'` directive |

### Spec Changes
- **chatbot**: Update architecture diagram (Next.js → Vite)
- **project.md**: Update Tech Stack section

### Performance Impact
- **Positive**: Faster dev server startup (Vite's esbuild vs Webpack)
- **Positive**: Faster HMR (Vite's native ESM)
- **Neutral**: Production bundle size similar
- **Neutral**: Chat API latency unchanged (same deployment region constraints)

### Accessibility Impact
- **None**: All accessibility features preserved
- React components unchanged
- ARIA attributes, keyboard navigation, screen reader support maintained

### User Impact
- **Invisible**: End users see no difference
- **Developer**: Faster development iteration
- **Migration**: No breaking changes to deployed functionality

## Success Criteria

### Functional Requirements
- [ ] All sections render correctly (Hero, Skills, Experience, About, Contact)
- [ ] Theme toggle works (light/dark mode)
- [ ] Fibonacci spiral visualization interactive
- [ ] Timeline visualization renders
- [ ] Chat widget opens and streams responses
- [ ] Navigation scroll spy works

### Technical Requirements
- [ ] `npm run dev` starts Vite server on localhost:3000
- [ ] `npm run build` produces production bundle
- [ ] Netlify deployment succeeds with serverless API
- [ ] All Vitest unit tests pass
- [ ] All Playwright BDD tests pass

### Performance Requirements
- [ ] Lighthouse Performance: 90+
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s

## Out of Scope

1. **Router addition**: No React Router/TanStack Router (single page app)
2. **SSR/SSG**: Vite SSR plugins (not needed for this SPA)
3. **API expansion**: Additional serverless functions
4. **Multi-page migration**: Converting to multi-page app

## Open Questions

None - the user has confirmed Netlify Functions as the preferred API backend approach.

## References

- Current Spec: `openspec/specs/chatbot/spec.md` (architecture diagram line 331)
- Project Context: `openspec/project.md` (Tech Stack section)
- Migration Plan: `C:\Users\TomRussell\.claude\plans\synchronous-baking-rose.md`
