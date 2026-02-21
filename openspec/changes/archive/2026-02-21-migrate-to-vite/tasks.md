# Tasks: Migrate to Vite

## Phase 1: Dependencies & Configuration

- [ ] Install new dependencies
  ```bash
  npm install react-helmet-async
  npm install -D vite vite-tsconfig-paths
  ```
- [ ] Remove Next.js dependencies
  ```bash
  npm uninstall next eslint-config-next
  ```
- [ ] Create `vite.config.ts` with React plugin and path aliases
- [ ] Create `index.html` entry point at project root
- [ ] Update `tsconfig.json` to remove Next.js plugin reference
- [ ] Update `.gitignore` (remove `.next`, add `dist`)

## Phase 2: Entry Point Migration

- [ ] Create `src/main.tsx` with React DOM render
  - Import `HelmetProvider` from react-helmet-async
  - Import `ThemeProvider` from existing component
  - Wrap `App` component with providers
  - Import `globals.css`
- [ ] Create `src/App.tsx` from merged `layout.tsx` + `page.tsx`
  - Add `<Helmet>` component with all SEO metadata
  - Include skip link for accessibility
  - Include ThemeToggle, SectionNav, all sections, ChatWidget
- [ ] Move `src/app/globals.css` to `src/styles/globals.css` (optional)
- [ ] Move `public/favicon.ico` if needed

## Phase 3: Remove Client Directives

- [ ] Remove `'use client'` from all component files:
  - `src/components/chat/ChatButton.tsx`
  - `src/components/chat/ChatHeader.tsx`
  - `src/components/chat/ChatInput.tsx`
  - `src/components/chat/ChatMessages.tsx`
  - `src/components/chat/ChatWidget.tsx`
  - `src/components/chat/ChatWindow.tsx`
  - `src/components/chat/ErrorMessage.tsx`
  - `src/components/chat/LoadingIndicator.tsx`
  - `src/components/chat/Message.tsx`
  - `src/components/chat/StarterPrompts.tsx`
  - `src/components/experience/ExperienceCard.tsx`
  - `src/components/navigation/SectionNav.tsx`
  - `src/components/sections/AboutSection.tsx`
  - `src/components/sections/ContactSection.tsx`
  - `src/components/sections/ExperienceSection.tsx`
  - `src/components/sections/HeroSection.tsx`
  - `src/components/sections/SkillsSection.tsx`
  - `src/components/ui/ScrollCue.tsx`
  - `src/components/ui/ThemeProvider.tsx`
  - `src/components/ui/ThemeToggle.tsx`
  - (any other files with 'use client')

## Phase 4: API Route Migration

- [ ] Create `netlify/functions/chat.ts` for Netlify Functions
- [ ] Copy contents from `src/app/api/chat/route.ts`
- [ ] Verify handler structure works with Netlify Functions
- [ ] Test locally with `netlify dev`

## Phase 5: Update Build Scripts

- [ ] Update `package.json` scripts:
  ```json
  {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:bdd": "playwright test",
    "test:all": "npm run test:run && npm run test:bdd"
  }
  ```

## Phase 6: Test Configuration

- [ ] Update `vitest.config.ts` paths if files moved
- [ ] Update `playwright.config.ts` webServer command
  - Change command to `npm run dev`
  - Verify baseURL is `http://localhost:3000`
- [ ] Run unit tests: `npm run test:run`
- [ ] Run BDD tests: `npm run test:bdd`

## Phase 7: Cleanup

- [ ] Delete `src/app/layout.tsx`
- [ ] Delete `src/app/page.tsx`
- [ ] Delete `src/app/api/` directory
- [ ] Delete `next.config.ts`
- [ ] Delete `next-env.d.ts`
- [ ] Delete `.next/` directory (if present)

## Phase 8: Documentation Updates

- [ ] Update `openspec/project.md` Tech Stack section
  - Change "Framework: Next.js 15+ with App Router" → "Build Tool: Vite with React 19"
  - Update "Next.js over Vite" rationale section
  - Update file organization section
- [ ] Update `openspec/specs/chatbot/spec.md` architecture diagram
- [ ] Apply change via `openspec archive migrate-to-vite --yes`

## Phase 9: Verification

- [ ] Start dev server: `npm run dev`
- [ ] Verify all sections render
- [ ] Test theme toggle (light/dark)
- [ ] Test chat widget (open, send message, receive response)
- [ ] Test Fibonacci spiral interactions
- [ ] Test timeline visualization
- [ ] Test navigation scroll spy
- [ ] Run production build: `npm run build`
- [ ] Preview production build: `npm run preview`

## Phase 10: Deployment

- [ ] Deploy to Netlify preview
- [ ] Test serverless API in preview environment
- [ ] Verify all functionality in preview
- [ ] Deploy to production
- [ ] Smoke test production deployment

---

## Parallel Work Opportunities

Tasks that can be done simultaneously:
- Phase 1 (deps) + Phase 3 (remove directives) - independent file changes
- Phase 4 (API) + Phase 2 (entry points) - independent areas

## Dependencies

```
Phase 1 (deps) ──┬── Phase 2 (entry) ── Phase 5 (scripts) ── Phase 6 (tests)
                 │
                 └── Phase 4 (API) ─────────────────────────────────────────┘
                                                                            │
Phase 3 (directives) ──────────────────────────────────────────────────────┘
                                                                            │
                                            Phase 7 (cleanup) ─── Phase 8 (docs) ─── Phase 9 (verify) ─── Phase 10 (deploy)
```

## Rollback Plan

If issues are found after deployment:
1. Revert migration commit
2. `npm install` to restore Next.js dependencies
3. Deploy reverted version
