## Why

Remove all Vercel dependencies to achieve complete platform independence. Next.js (Vercel-maintained framework) and the Vercel AI SDK create unnecessary ties to the Vercel ecosystem. Migrating to Vite + OpenRouter SDK eliminates these dependencies while maintaining all functionality, simplifies the build architecture with a pure SPA approach, and uses official OpenRouter tooling instead of Vercel-wrapped providers.

## What Changes

- **BREAKING**: Replace Next.js with Vite + React Router for application framework
- **BREAKING**: Replace Vercel AI SDK with OpenRouter official SDK for chat functionality
- Remove Next.js-specific patterns (dynamic imports, App Router, metadata API)
- Migrate to pure client-side SPA architecture deployed as static files
- Build custom React hooks for streaming chat with OpenRouter SDK
- Update routing from Next.js App Router to React Router client-side routing
- Simplify deployment to static file hosting on Netlify CDN
- Remove all Vercel transitive dependencies (@vercel/oidc, etc.)

## Capabilities

### New Capabilities
<!-- None - replacing implementation, not adding features -->

### Modified Capabilities
- `chatbot`: Chat implementation changes from Vercel AI SDK to OpenRouter SDK with custom streaming hooks
- `site-structure`: Framework changes from Next.js App Router to Vite + React Router SPA
- `visualizations`: Remove next/dynamic imports, use standard React lazy loading

## Impact

**Dependencies Removed:**
- `next` (~1.2MB, Vercel framework)
- `@ai-sdk/react`, `@ai-sdk/openai`, `@openrouter/ai-sdk-provider`, `ai` (Vercel AI SDK stack)
- `eslint-config-next`

**Dependencies Added:**
- `vite`, `@vitejs/plugin-react` (build tooling)
- `react-router-dom` (client-side routing)
- `@openrouter/sdk` (official OpenRouter SDK)

**Files Modified:**
- Framework files: `src/app/layout.tsx` → `src/main.tsx`, `src/app/page.tsx` → `src/App.tsx`
- Build config: `next.config.ts` → `vite.config.ts`
- Chat components: New `useChat` hook, updated API endpoint pattern
- Routing: Navigation from Next.js Link to React Router Link
- Visualizations: Remove `dynamic()` imports from SkillsSection

**Build System:**
- Development: `npm run dev` runs Vite dev server
- Production: `npm run build` outputs static files to `dist/`
- Deployment: Netlify serves static files (no runtime needed)
- No SSR - pure client-side application

**Benefits:**
- Zero Vercel dependencies or ecosystem ties
- Simpler architecture (static SPA)
- Faster dev server (Vite HMR)
- Cheaper hosting (static files only)
- Full control over AI streaming implementation
