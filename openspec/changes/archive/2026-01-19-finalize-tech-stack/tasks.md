# Implementation Tasks

## Documentation Updates

- [x] Research visualization libraries (Visx, Recharts, Nivo, Victory, D3)
- [x] Research AI chatbot frameworks (AI SDK, LangChain)
- [x] Research hosting platforms (Netlify, Cloudflare)
- [x] Research LLM providers and pricing
- [x] Create comprehensive research document
- [ ] Update project.md with finalized tech stack
- [ ] Validate OpenSpec proposal

## Phase 1: Project Foundation

- [ ] Initialize Next.js 15+ with App Router and TypeScript
- [ ] Configure Tailwind CSS v4
- [ ] Set up dark mode (system + manual toggle)
- [ ] Configure ESLint + Prettier
- [ ] Set up Netlify deployment
- [ ] Verify: Dark mode works, TypeScript compiles, Netlify deploys

## Phase 2: Data Layer

- [ ] Create TypeScript interfaces from specs
- [ ] Transform resources/skills.json → src/data/skills.ts
- [ ] Transform resources/categories.json → src/data/categories.ts
- [ ] Implement Fibonacci calculation functions
- [ ] Create unit tests
- [ ] Verify: Calculations match spec scenarios

## Phase 3: Fibonacci Spiral (Priority)

- [ ] Install Visx dependencies
- [ ] Research spiral positioning algorithm
- [ ] Create FibonacciSpiral.tsx component
- [ ] Implement skill sizing and positioning
- [ ] Add category colors from categories.json
- [ ] Create SkillTooltip component
- [ ] Add Framer Motion animations
- [ ] Add accessibility (keyboard nav, ARIA labels)
- [ ] Verify: Matches visualization spec requirements

## Phase 4: Core Pages

- [ ] Create homepage with hero
- [ ] Add about/bio section
- [ ] Add experience section
- [ ] Optimize with Next.js Image
- [ ] Test mobile responsiveness
- [ ] Verify: SSG working, Lighthouse 90+

## Phase 5: AI Chatbot

- [ ] Set up OpenRouter account
- [ ] Install AI SDK + assistant-ui
- [ ] Create API route (src/app/api/chat/route.ts)
- [ ] Configure Llama 3.3 70B (free tier)
- [ ] Create chatbot-knowledge.ts
- [ ] Implement streaming with useChat
- [ ] Add rate limiting
- [ ] Verify: Streaming works, accurate responses, within free tier

## Phase 6: Timeline Visualization

- [ ] Install Recharts
- [ ] Transform data for timeline
- [ ] Create TimelineArea.tsx component
- [ ] Match colors with Fibonacci view
- [ ] Add milestone markers
- [ ] Add animations
- [ ] Verify: Shows career progression, accessible

## Phase 7: Integration

- [ ] Create VisualizationSection container
- [ ] Add toggle control
- [ ] Implement smooth transitions
- [ ] Test both views on mobile
- [ ] Verify: Toggle smooth, both views work

## Phase 8: Polish & Deploy

- [ ] Lighthouse audit
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Add meta tags and OpenGraph
- [ ] Set up Netlify Analytics
- [ ] Deploy to production
- [ ] Verify: All quality standards met
