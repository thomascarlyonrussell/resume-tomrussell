# Change: Finalize Technology Stack Based on Research

## Why

The project.md currently lists generic technology choices (e.g., "D3.js" for visualizations) without specific implementation details or rationale. After comprehensive research into React visualization libraries, AI chatbot frameworks, build tools, styling solutions, and hosting platforms, we need to finalize and document specific technology decisions that will guide implementation.

**Problem**: Generic tech stack decisions don't provide enough guidance for implementation. Questions remain:
- Which specific D3 integration approach? (Pure D3, Visx, Recharts, Nivo, Victory?)
- Which AI chatbot framework? (AI SDK, LangChain, custom?)
- Free-tier LLM options and upgrade paths?
- Netlify hosting limitations vs alternatives?
- Build tool configuration (Next.js version, app router, SSG/SSR strategy)?

**Opportunity**: Research has identified optimal choices for this specific use case (portfolio with custom Fibonacci spiral, stacked area chart, AI chatbot, dark mode, accessibility).

## What Changes

### Technology Stack Finalization

**Visualizations** (MODIFIED):
- Replace generic "D3.js" with hybrid approach:
  - **Visx** for custom Fibonacci spiral (low-level D3 primitives in React)
  - **Recharts** for stacked area timeline (simple declarative API)
  - Rationale: Visx gives control for custom layouts, Recharts simplifies standard charts

**Frontend Framework** (CLARIFIED):
- Specify **Next.js 15+ with App Router**
- Rendering strategy: **SSG for portfolio pages, SSR for chatbot**
- Rationale: Best performance (SSG) with dynamic capabilities (SSR) where needed

**Styling** (CLARIFIED):
- Specify **Tailwind CSS v4**
- **Dark mode from day 1** (system preference + manual toggle)
- Rationale: Best integration with D3/Visx, zero runtime overhead, rapid development

**AI Chatbot** (MODIFIED):
- LLM: **OpenRouter with free tier** (Llama 3.3 70B)
- Easy upgrade path: Change `LLM_MODEL` env var (no code changes)
- Rationale: $0 cost to start, flexible model selection, simple upgrade

**Hosting** (CLARIFIED):
- **Netlify** managed hosting for deployment and preview workflows
- Document limitations: 100GB bandwidth, 150k function invocations/month
- Migration path to Cloudflare Pages if needed
- Rationale: Best development experience, sufficient for initial launch

**Animations** (EXPLICIT):
- **Framer Motion** for page transitions and visualization animations
- Respect `prefers-reduced-motion`

**Chat UI** (EXPLICIT):
- **assistant-ui** library for production-ready chat interface
- Auto-scroll, markdown rendering, streaming support

### Implementation Approach

**Phase-based development** (8 phases):
1. Project Foundation (Next.js + Tailwind + dark mode)
2. Data Layer & Type System (transform JSON → TypeScript)
3. Fibonacci Spiral (priority visualization)
4. Core Portfolio Pages (homepage, about, experience)
5. AI Chatbot MVP (system prompt approach)
6. Timeline Visualization (stacked area chart)
7. Visualization Toggle & Integration
8. Polish & Deploy

**Quality standards enforced**:
- Lighthouse 90+ across all metrics
- WCAG 2.1 AA compliance
- TypeScript strict mode
- Unit tests for calculations
- Comprehensive browser testing

## Impact

**Affected Specs**:
- `project.md` - Tech stack section needs updates

**Affected Code**:
- None yet (project not started)
- Will guide all future implementation

**Benefits**:
- Clear implementation guidance based on research
- Documented rationale for technology choices
- Upgrade paths defined for free-tier services
- Quality standards established upfront

**Risks**:
- Netlify tier limits (mitigated: migration path documented)
- Free LLM quality (mitigated: easy upgrade path via env var)
- Learning curve for Visx (mitigated: research shows it's best for custom layouts)

**Migration Considerations**:
- None (new project)
- All free-tier choices have documented upgrade paths
