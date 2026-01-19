# Technology Stack Design

## Problem Statement

The portfolio project requires careful technology selection to balance:
- **Custom visualization needs** (Fibonacci spiral is non-standard)
- **Standard visualization needs** (stacked area chart is common)
- **Free-tier constraints** (budget-conscious hosting and LLM)
- **Quality requirements** (Lighthouse 90+, WCAG 2.1 AA)
- **Future flexibility** (easy upgrades when needed)

## Research Methodology

Conducted comprehensive research across five areas:
1. **Visualization libraries**: Compared 5 options (Visx, Recharts, Nivo, Victory, D3 direct)
2. **AI chatbot frameworks**: Evaluated Vercel AI SDK vs LangChain vs custom
3. **Build tools**: Compared Vite vs Next.js vs CRA
4. **Styling solutions**: Analyzed Tailwind vs Panda CSS vs styled-components
5. **Hosting platforms**: Compared Vercel vs Cloudflare vs Netlify

All decisions backed by 2026 usage statistics, community adoption, and specific project requirements.

## Key Architectural Decisions

### 1. Hybrid Visualization Approach

**Decision**: Use Visx + Recharts (not pure D3 or single library)

**Rationale**:
- **Fibonacci spiral** needs low-level control → Visx provides D3 primitives in React
- **Stacked area chart** is standard → Recharts provides simple declarative API
- Hybrid approach: complexity only where needed, simplicity for standard charts

**Alternatives Considered**:
- **Pure D3**: Maximum control but DOM manipulation conflicts with React
- **Single library (Nivo/Victory)**: Would compromise either flexibility or simplicity
- **Recharts only**: Can't handle custom spiral layouts

**Trade-offs**:
- Pro: Optimal tool for each visualization type
- Pro: Smaller bundle (tree-shakable)
- Con: Two libraries to learn (mitigated: both have good docs)

### 2. Next.js with Hybrid Rendering

**Decision**: Next.js 15+ with SSG for portfolio, SSR for chatbot

**Rationale**:
- **SSG** gives best performance for static content (portfolio pages)
- **SSR** needed for AI chatbot (API routes, serverless functions)
- **SEO** important for portfolio discoverability
- **App Router** is the modern Next.js pattern (file-based routing)

**Alternatives Considered**:
- **Vite**: Faster dev but no SSR/SSG, chatbot would require separate backend
- **CRA**: Deprecated, not recommended in 2026

**Trade-offs**:
- Pro: Best of both worlds (static + dynamic)
- Pro: Built-in API routes for chatbot
- Con: More complex than pure SPA (acceptable for requirements)

### 3. Free-Tier LLM with Upgrade Path

**Decision**: OpenRouter free tier (Llama 3.3 70B) with environment variable upgrade

**Rationale**:
- **$0 cost** to start (important for portfolio project)
- **OpenRouter** supports 200+ models (easy A/B testing)
- **Single env var** change upgrades to paid models (GPT-4o-mini, Claude 3.5)
- **No code changes** needed to upgrade

**Architecture**:
```typescript
// .env.local
LLM_MODEL=meta-llama/llama-3.3-70b-instruct:free  // Start
// LLM_MODEL=anthropic/claude-3.5-sonnet           // Upgrade
```

**Alternatives Considered**:
- **Direct OpenAI/Anthropic**: No free tier, $5-20/month immediately
- **Multiple providers**: Complex fallback logic

**Trade-offs**:
- Pro: $0 to start, easy upgrade path
- Pro: Model flexibility (can test different models)
- Con: Free tier rate limits (acceptable for portfolio traffic)

### 4. Vercel Free Tier with Migration Path

**Decision**: Start on Vercel free, document Cloudflare migration

**Rationale**:
- **Best DX** in the industry (auto-deploy, preview URLs, edge functions)
- **Free tier** sufficient for initial launch (100GB bandwidth, 150k functions/month)
- **Next.js integration** is seamless (same company)
- **Cloudflare migration** available if limits hit (documented in proposal)

**Free Tier Analysis**:
- 150k function invocations = 75k-150k chatbot messages/month
- Unlikely to hit limits initially
- If popular: Easy migration to Cloudflare Pages (unlimited bandwidth)

**Alternatives Considered**:
- **Cloudflare Pages**: Better long-term (unlimited bandwidth) but steeper setup
- **Netlify**: Middle ground, less DX than Vercel

**Trade-offs**:
- Pro: Best development experience
- Pro: Sufficient for launch
- Con: May need migration if very popular (acceptable, path documented)

### 5. Dark Mode from Day 1

**Decision**: Build dark mode into foundation, not retrofit later

**Rationale**:
- **Easier upfront** than retrofitting (avoids rework)
- **Modern expectation** for developer portfolios
- **Tailwind built-in** support (dark: variants)
- **System + manual** toggle (respects user preference)

**Implementation**:
- Use `next-themes` for system detection
- Tailwind `dark:` variants for styling
- Store preference in localStorage

**Trade-offs**:
- Pro: Better UX, modern appearance
- Pro: Easier now than later
- Con: Slightly more upfront work (1-2 days, acceptable)

## Implementation Strategy

### Phased Approach

**Phase order rationale**:
1. **Foundation first** (Next.js + Tailwind + dark mode) - enables all other work
2. **Data layer second** - transforms JSON to TypeScript, testable in isolation
3. **Fibonacci spiral third** - signature feature, highest priority
4. **Core pages fourth** - context for visualizations
5. **Chatbot fifth** - independent feature, can be MVP
6. **Timeline sixth** - second visualization, shares infrastructure with Fibonacci
7. **Integration seventh** - connects both visualizations
8. **Polish last** - optimization and testing

### Quality Gates

Each phase has **verification criteria** before proceeding:
- TypeScript compilation success
- Unit tests pass
- Lighthouse scores maintained
- Accessibility standards met
- No console errors or warnings

### Dependency Management

**Critical path**:
1. Foundation → Everything depends on this
2. Data layer → Both visualizations depend on this
3. Fibonacci OR Timeline → Can be parallel, but Fibonacci prioritized
4. Chatbot → Independent, can proceed in parallel with visualizations

**Parallelization opportunities**:
- Core pages + Chatbot (after foundation)
- Fibonacci + Timeline (after data layer, but Fibonacci prioritized)

## Upgrade Paths

### LLM Upgrade
```typescript
// Current: Free tier
LLM_MODEL=meta-llama/llama-3.3-70b-instruct:free

// Upgrade options (one line change):
LLM_MODEL=openai/gpt-4o-mini        // $0.15/$0.60 per M tokens
LLM_MODEL=anthropic/claude-3.5-sonnet  // $3/$15 per M tokens
```

### Hosting Migration
If Vercel limits hit:
1. Export Next.js static files
2. Deploy to Cloudflare Pages
3. Update DNS
4. Cost: $0 (both are free tier)

### RAG Implementation
If chatbot quality insufficient:
1. Generate embeddings from JSON data
2. Set up Supabase pgvector (free tier)
3. Implement semantic search in API route
4. Estimated: 2-3 days additional work

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Vercel free tier exceeded | Low | Medium | Documented migration to Cloudflare |
| Free LLM quality insufficient | Medium | Low | One-line upgrade to paid model |
| Visx learning curve too steep | Low | Medium | Extensive documentation and examples |
| Performance targets not met | Low | High | SSG ensures fast load, monitoring |
| Accessibility compliance fails | Low | High | Built-in from start, regular audits |

## Success Metrics

### Technical Metrics
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 90+
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <200KB (compressed)

### Quality Metrics
- WCAG 2.1 AA: 100% compliance
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile responsiveness: 375px to 1920px
- TypeScript strict: No errors or warnings

### Cost Metrics
- Initial cost: $0 (all free tiers)
- Est. monthly (100 visitors): $0
- Est. monthly (1000 visitors): $0-5
- Est. monthly (10k visitors): $5-20

## Conclusion

This technology stack balances free-tier constraints with quality requirements while maintaining clear upgrade paths. Each decision is backed by research and specific to this project's unique combination of:
- Custom Fibonacci spiral visualization
- Standard timeline visualization
- AI chatbot with portfolio context
- Accessibility and performance requirements
- Budget-conscious approach with growth flexibility
