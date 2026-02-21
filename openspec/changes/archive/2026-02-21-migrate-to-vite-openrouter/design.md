## Context

Currently using Next.js 16 with Vercel AI SDK for a portfolio/resume website. The site is a relatively simple SPA with static resume data, interactive visualizations, and an AI chatbot. Already deployed to Netlify (not Vercel platform), but using Vercel-maintained tooling creates unnecessary ecosystem dependencies.

**Current Architecture:**
- Framework: Next.js App Router
- Build: Next.js (uses Turbopack/Webpack)
- Routing: File-based (src/app/)
- AI: Vercel AI SDK + @openrouter/ai-sdk-provider
- Deployment: Netlify Functions for API routes
- Data: Static JSON modules (no database)

**Target Architecture:**
- Framework: Vite + React Router
- Build: Vite (esbuild-based)
- Routing: React Router (client-side)
- AI: OpenRouter SDK + custom React hooks
- Deployment: Netlify static files (no runtime)
- Data: Static JSON modules (unchanged)

## Goals / Non-Goals

**Goals:**
- Complete removal of Vercel dependencies (Next.js, AI SDK)
- Maintain all existing functionality (visualizations, chatbot, dark mode)
- Simplify architecture to pure SPA (no SSR needed for portfolio site)
- Use official OpenRouter SDK instead of Vercel wrapper
- Keep existing UI components and styling (Tailwind, Framer Motion, Recharts)
- Deploy as static files to Netlify CDN

**Non-Goals:**
- Server-side rendering (not needed for this use case)
- Changing visual design or UX
- Rewriting data model or component logic
- Supporting multiple deployment platforms simultaneously
- Breaking existing URLs/routes

## Decisions

### **Decision 1: Vite + React Router vs TanStack Start vs Remix**

**Choice:** Vite + React Router (pure SPA)

**Rationale:**
- Portfolio site doesn't need SSR (no SEO concerns, content is resume)
- Simplest possible architecture = static files only
- React Router is mature, well-documented, Remix-team maintained
- Vite provides best dev experience (instant HMR)
- No runtime costs on Netlify (just static files)

**Alternatives Considered:**
- TanStack Start: Overkill for simple portfolio, RC status, SSR not needed
- Remix: Great framework but SSR adds complexity we don't need
- Keep Next.js: Doesn't solve Vercel dependency concern

### **Decision 2: OpenRouter SDK vs TanStack AI vs Custom Fetch**

**Choice:** OpenRouter SDK with custom React hooks

**Rationale:**
- Official SDK from OpenRouter team (no Vercel dependency)
- Type-safe, maintained, minimal dependencies (only Zod)
- Streaming support built-in
- Custom hooks straightforward (~50 lines)
- Full control over streaming implementation

**Alternatives Considered:**
- TanStack AI: Adds another framework dependency, RC status
- Custom fetch: More work, reinventing wheel for streaming
- Keep Vercel AI SDK: Doesn't solve Vercel dependency concern

### **Decision 3: API Route Pattern**

**Choice:** Netlify Function (serverless) for chat API

**Rationale:**
- Need server-side to protect API keys
- Already on Netlify
- Serverless function similar to current Next.js API route
- Simple POST endpoint that streams OpenRouter response

**Implementation:**
```
netlify/functions/chat.ts
├── Parse request (messages array)
├── Call OpenRouter SDK with streaming
├── Stream response back to client
└── Handle rate limiting
```

### **Decision 4: Routing Migration Strategy**

**Choice:** Convert Next.js App Router structure to React Router routes

**Mapping:**
- `src/app/page.tsx` → `src/App.tsx` (root route `/`)
- `src/app/layout.tsx` → `src/main.tsx` (root component)
- API routes → Netlify Functions (`netlify/functions/`)

**Rationale:**
- Single-page app only has one real route (homepage)
- No nested routing needed
- Simplifies migration significantly

### **Decision 5: Migration Approach**

**Choice:** Incremental migration with coexistence period

**Steps:**
1. Create new Vite config alongside Next.js
2. Migrate chat components to use new useChat hook
3. Remove Next.js-specific imports (dynamic, metadata)
4. Test build outputs side-by-side
5. Switch deployment after verification
6. Remove Next.js dependencies

**Rationale:**
- Lower risk than big-bang rewrite
- Can verify Vite build before removing Next.js
- Easy rollback if issues found

### **Decision 6: Keep npm, not Bun**

**Choice:** Stay with npm package manager

**Rationale:**
- One change at a time reduces risk
- npm is battle-tested, widely supported
- Speed difference negligible for development
- Can always switch to Bun later if desired

## Risks / Trade-offs

### **Risk: Losing SSR could impact SEO**
**Mitigation:** Portfolio site ranked by name search, social media links matter more than crawlers. Can add prerendering later if needed.

### **Risk: Custom streaming hooks may have bugs**
**Mitigation:** OpenRouter SDK handles streaming complexity, our hooks just manage React state. Keep implementation simple, test thoroughly.

### **Risk: Netlify Functions cold starts**
**Mitigation:** First message may be slow (~200-500ms), acceptable for chat UX. Could warm with ping if needed.

### **Trade-off: No framework-provided image optimization**
**Accept:** Not using many images, those we have are pre-optimized. Can add @unpic/react if needed.

### **Trade-off: Manual routing setup vs file-based**
**Accept:** Only one route, barely any routing needed. SPA approach simpler overall.

### **Risk: Breaking chat during migration**
**Mitigation:** Keep both API implementations until verified. Feature flag or parallel deploy.

## Migration Plan

### Phase 1: Setup (2-3 hours)
1. Install Vite + React Router dependencies
2. Create `vite.config.ts` with Tailwind, path aliases
3. Create `src/main.tsx` entry point
4. Verify basic Vite dev server runs

### Phase 2: Chat Migration (2-3 hours)
1. Create `src/hooks/useChat.ts` with OpenRouter SDK
2. Update ChatWindow to use new hook
3. Create Netlify Function for `/api/chat`
4. Test streaming chat works end-to-end

### Phase 3: Framework Migration (2-3 hours)
1. Convert `src/app/layout.tsx` → `src/main.tsx`
2. Convert `src/app/page.tsx` → `src/App.tsx`
3. Remove `next/dynamic` from SkillsSection
4. Update all Next.js Link → React Router Link
5. Test all components render correctly

### Phase 4: Build & Deploy (1-2 hours)
1. Run Vite build, verify output in `dist/`
2. Update `netlify.toml` for SPA fallback
3. Deploy to Netlify preview
4. Run full QA (all features)
5. Update package.json scripts

### Phase 5: Cleanup (1 hour)
1. Remove Next.js dependencies
2. Remove Next.js config files
3. Update documentation
4. Final production deploy

**Rollback Strategy:**
- Keep Next.js config in git until verified
- Deploy to preview URL first
- Can revert deployment in Netlify dashboard
- No data migration, all changes are application code

**Total Estimated Time:** 8-12 hours (1-2 days)
