# Project Context

## Purpose

A personal portfolio and resume website for Tom Russell that serves as a professional presence and personal branding platform. The site showcases career history, skills, and projects through innovative interactive visualizations and an AI-powered chatbot.

### Goals

1. **Professional Presence** - Establish a memorable online identity
2. **Personal Branding** - Showcase unique skills and approach
3. **Interactive Experience** - Engage visitors through distinctive visualizations
4. **AI-Powered Discovery** - Enable visitors to learn about Tom through conversational AI

### Target Audience

- Potential employers and recruiters (future consideration)
- Professional network and colleagues
- Industry peers interested in Tom's work
- Anyone exploring Tom's professional background

## Tech Stack

### Hosting & Deployment
- **Platform**: Vercel Hobby tier (free: 100GB bandwidth, 150k function invocations/month)
- **Repository**: GitHub
- **CI/CD**: Vercel auto-deploy from GitHub with preview deployments
- **Migration Path**: Cloudflare Pages if limits exceeded (unlimited bandwidth)

### Frontend
- **Framework**: Next.js 15+ with App Router
- **Rendering**: SSG for portfolio pages, SSR for chatbot interactions
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with dark mode (system preference + manual toggle)
- **Animations**: Framer Motion for smooth transitions and visualization effects
- **Visualizations**:
  - **Visx** for custom Fibonacci spiral (low-level D3 primitives in React)
  - **Recharts** for stacked area timeline (declarative API for standard charts)

### AI/Chatbot
- **SDK**: Vercel AI SDK (streaming support with useChat hook)
- **UI Library**: assistant-ui (production-ready chat interface)
- **LLM Gateway**: OpenRouter (supports 200+ models)
- **Initial Model**: Llama 3.3 70B Instruct (free tier, rate-limited)
- **Upgrade Path**: GPT-4o-mini or Claude 3.5 Sonnet (via LLM_MODEL env var)
- **Knowledge Base**: System prompt injection with structured resume data
- **Future Enhancement**: RAG with Supabase pgvector (optional upgrade)

### Key Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^4.0.0",
  "framer-motion": "^11.0.0",
  "@visx/shape": "latest",
  "@visx/scale": "latest",
  "@visx/curve": "latest",
  "recharts": "^2.0.0",
  "ai": "latest",
  "@assistant-ui/react": "latest",
  "next-themes": "latest"
}
```

## Project Conventions

### Code Style
- TypeScript for type safety
- ESLint + Prettier for formatting
- Component-based architecture
- CSS-in-JS via Tailwind

### File Organization
```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
│   ├── ui/           # Base UI components
│   ├── visualizations/ # D3 visualization components
│   └── chat/         # Chatbot components
├── data/             # Static data files (skills, experience)
├── lib/              # Utility functions and API helpers
└── styles/           # Global styles and Tailwind config
```

### Naming Conventions
- Components: PascalCase (e.g., `FibonacciSpiral.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Data files: kebab-case (e.g., `skills-data.json`)
- API routes: kebab-case (e.g., `api/chat/route.ts`)

### Git Workflow
- Conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Feature branches: `feature/feature-name`
- PR-based workflow

## Domain Context

### Design Direction

**Aesthetic**: Modern, creative, corporate - demonstrating technical capability while maintaining professionalism

**Key Characteristics**:
- Clean, readable typography
- Smooth animations and transitions
- Dark/light mode support
- Mobile-responsive design
- Interactive data visualizations as the centerpiece

### Data Sources

Career and skills data stored in structured TypeScript files:
- `src/data/skills.ts` - Skills with categories, proficiency, and timeline
- `src/data/experience.ts` - Work history and roles
- `src/data/projects.ts` - Notable projects and achievements
- `src/data/chatbot-knowledge.ts` - Structured content for AI system prompt

## Important Constraints

### Performance Targets
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 90+
- Lighthouse SEO: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

### Accessibility
- WCAG 2.1 AA compliance (100%)
- Keyboard navigation for all interactive elements
- Screen reader compatibility (NVDA, JAWS, VoiceOver tested)
- Color contrast ratios: 4.5:1 minimum for text
- Reduced motion support (`prefers-reduced-motion`)
- Visible focus indicators
- ARIA labels for visualization elements

### Code Quality
- TypeScript strict mode enabled
- Zero ESLint errors or warnings
- Prettier formatting enforced
- Unit tests for calculation logic
- Conventional commits (feat:, fix:, docs:, style:, refactor:)

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile: iOS Safari, Chrome Android

## External Dependencies

### Environment Variables
```
OPENROUTER_API_KEY=     # OpenRouter API key for LLM access
NEXT_PUBLIC_SITE_URL=   # Public site URL
```

### External Services
- **OpenRouter** - LLM API gateway for chatbot
- **Vercel** - Hosting and serverless functions
- **GitHub** - Source control and CI/CD integration

## Technology Selection Rationale

### Visualization Libraries

**Visx for Fibonacci Spiral**:
- Provides low-level D3 primitives wrapped in React components
- Perfect for custom layouts like the Fibonacci spiral
- Developed by Airbnb, 19.2K+ GitHub stars
- First-class TypeScript support, tree-shakable

**Recharts for Timeline**:
- Simplest implementation for stacked area charts (~20 lines of code)
- Clean, declarative API with composable components
- 24.8K+ GitHub stars, mature and well-documented
- Good TypeScript support

**Hybrid Approach**: Use the right tool for each job - Visx for complex custom layouts, Recharts for standard charts.

### Next.js over Vite

- **SSG** provides optimal performance for static portfolio content
- **SSR** enables AI chatbot with secure server-side API routes
- Built-in image optimization and SEO features
- Hybrid rendering (static + dynamic) in one framework
- 57.1% adoption rate in 2026

### Tailwind CSS v4

- 75.5% retention rate (highest among CSS frameworks)
- Excellent integration with D3/Visx: Tailwind handles styling, D3 handles SVG logic
- JIT compiler keeps bundles lean
- Zero runtime overhead (unlike styled-components/Emotion)
- Built-in dark mode support with `dark:` variants

### OpenRouter Free Tier

- $0 cost to start with Llama 3.3 70B Instruct
- Single API supports 200+ models for easy experimentation
- **One environment variable** to upgrade (no code changes):
  ```bash
  LLM_MODEL=meta-llama/llama-3.3-70b-instruct:free  # Free tier
  LLM_MODEL=openai/gpt-4o-mini                      # Paid upgrade
  LLM_MODEL=anthropic/claude-3.5-sonnet             # Premium upgrade
  ```
- Flexible model selection based on needs and budget

### Vercel Free Tier

- Best developer experience (auto-deploy, preview URLs, edge functions)
- 150k function invocations/month = 75k-150k chatbot messages
- Sufficient for initial launch and growth
- Easy migration to Cloudflare Pages if limits exceeded

### Dark Mode from Day 1

- Easier to build in initially than retrofit later
- Modern expectation for developer portfolios
- Tailwind has built-in support
- Respects system preferences with manual override

## Implementation Phases

### Phase 1: Project Foundation (Week 1)
- Initialize Next.js 15+ with App Router and TypeScript
- Configure Tailwind CSS v4 with custom design system
- Set up dark mode toggle (system preference + manual override)
- Create base layout component with navigation
- Configure ESLint, Prettier, and Git hooks
- Set up Vercel deployment pipeline

### Phase 2: Data Layer & Type System (Week 1)
- Create TypeScript interfaces for all data models
- Transform `resources/*.json` → `src/data/*.ts`
- Implement Fibonacci sizing calculation functions
- Implement time degradation factor calculations
- Create unit tests for all calculation logic

### Phase 3: Fibonacci Spiral Visualization (Week 2)
- Research and prototype spiral positioning algorithm
- Build FibonacciSpiral component with Visx
- Implement skill sizing based on calculations
- Add category coloring from categories.json
- Create interactive tooltips
- Add Framer Motion entrance animations
- Ensure keyboard navigation and screen reader support

### Phase 4: Core Portfolio Pages (Week 2-3)
- Create homepage with hero section
- Add skills section with Fibonacci visualization
- Build about/bio section
- Add experience timeline (text-based initially)
- Implement smooth scroll navigation
- Optimize images with Next.js Image component

### Phase 5: AI Chatbot MVP (Week 3)
- Set up OpenRouter account and API key
- Create Next.js API route for chat
- Integrate Vercel AI SDK with streaming
- Configure Llama 3.3 70B (free tier)
- Create chatbot-knowledge.ts with portfolio context
- Install and configure assistant-ui components
- Add rate limiting and error handling

### Phase 6: Timeline Visualization (Week 4)
- Transform skill data for timeline aggregation
- Build TimelineArea component with Recharts
- Match category colors from Fibonacci view
- Add milestone markers
- Implement hover interactions
- Add smooth entrance animations

### Phase 7: Visualization Integration (Week 4)
- Create VisualizationSection container
- Add toggle control between views
- Implement smooth transitions
- Ensure shared styling and legends
- Optimize mobile experience

### Phase 8: Polish & Deploy (Week 4)
- Comprehensive Lighthouse audits
- Full accessibility audit (WCAG 2.1 AA)
- Cross-browser and mobile testing
- Add meta tags and OpenGraph images
- Set up Vercel Analytics
- Deploy to production with custom domain

**Estimated Timeline**: 3-4 weeks for production-ready site (prioritizing quality over speed)
