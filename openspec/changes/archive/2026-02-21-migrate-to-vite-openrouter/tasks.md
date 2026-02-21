## 1. Project Setup & Configuration

- [x] 1.1 Install Vite and related dependencies (vite, @vitejs/plugin-react, vite-tsconfig-paths)
- [x] 1.2 Install React Router (react-router-dom)
- [x] 1.3 Install OpenRouter SDK (@openrouter/sdk)
- [x] 1.4 Create vite.config.ts with React, Tailwind, and path alias configuration
- [x] 1.5 Create src/main.tsx as new entry point
- [x] 1.6 Update package.json scripts for Vite (dev, build, preview)
- [x] 1.7 Create index.html in project root for Vite

## 2. Custom Chat Hook Implementation

- [x] 2.1 Create src/hooks/useChat.ts with message state management
- [x] 2.2 Implement sendMessage function with fetch to API endpoint
- [x] 2.3 Add streaming response parsing (SSE handling)
- [x] 2.4 Implement loading/error state management
- [x] 2.5 Add regenerate functionality
- [x] 2.6 Export hook interface matching existing AI SDK API

## 3. Netlify Function for Chat API

- [x] 3.1 Create netlify/functions/chat.ts serverless function
- [x] 3.2 Import and configure OpenRouter SDK
- [x] 3.3 Implement POST request handling with message validation
- [x] 3.4 Add system prompt injection with knowledge base
- [x] 3.5 Implement streaming response with OpenRouter SDK
- [x] 3.6 Add rate limiting logic (in-memory for MVP)
- [x] 3.7 Add error handling (API errors, rate limits, missing keys)
- [ ] 3.8 Test function locally with Netlify CLI

## 4. Chat Component Migration

- [x] 4.1 Update ChatWindow.tsx to use custom useChat hook instead of AI SDK
- [x] 4.2 Update API endpoint from /api/chat to /.netlify/functions/chat
- [x] 4.3 Verify ChatMessages.tsx works with new hook format
- [x] 4.4 Verify ChatInput.tsx works with new hook format
- [x] 4.5 Verify StarterPrompts.tsx works with new hook format
- [ ] 4.6 Test streaming chat end-to-end
- [ ] 4.7 Test error states (rate limit, API error)

## 5. Framework Migration - Layout

- [x] 5.1 Create src/App.tsx from src/app/page.tsx content
- [x] 5.2 Create src/main.tsx with React Router setup
- [x] 5.3 Extract head metadata to index.html (title, description, viewport)
- [x] 5.4 Move ThemeProvider to App.tsx wrapper
- [ ] 5.5 Verify dark mode toggle still works
- [ ] 5.6 Remove src/app/layout.tsx dependencies

## 6. Framework Migration - Routing

- [x] 6.1 Set up React Router BrowserRouter in main.tsx
- [x] 6.2 Create root route (/) rendering App component
- [x] 6.3 Add Navigate redirect for 404s to root route
- [x] 6.4 Update SectionNav to use React Router scroll utilities
- [ ] 6.5 Test smooth scrolling to sections
- [ ] 6.6 Verify navigation state persistence

## 7. Visualization Component Updates

- [x] 7.1 Remove next/dynamic import from SkillsSection.tsx
- [x] 7.2 Replace with React.lazy() for FibonacciSpiral
- [x] 7.3 Replace with React.lazy() for Timeline
- [x] 7.4 Add Suspense boundaries with loading states
- [ ] 7.5 Test lazy loading works correctly
- [ ] 7.6 Verify visualizations render properly

## 8. Remove Next.js Dependencies

- [x] 8.1 Search codebase for remaining Next.js imports (next/*, from 'next')
- [x] 8.2 Remove any remaining Next.js-specific code
- [x] 8.3 Uninstall Next.js and related packages (next, eslint-config-next)
- [x] 8.4 Uninstall Vercel AI SDK packages (@ai-sdk/*, ai, @openrouter/ai-sdk-provider)
- [x] 8.5 Delete next.config.ts
- [x] 8.6 Delete src/app/ directory structure
- [x] 8.7 Update .gitignore (.next → no longer needed)
- [x] 8.8 Update .prettierignore if needed

## 9. Build & Deploy Configuration

- [x] 9.1 Create netlify.toml with SPA redirect rules
- [x] 9.2 Configure functions directory in netlify.toml
- [x] 9.3 Set build command to "npm run build"
- [x] 9.4 Set publish directory to "dist"
- [x] 9.5 Test production build locally (npm run build)
- [ ] 9.6 Test built files with preview (npm run preview or netlify dev)
- [ ] 9.7 Verify all routes serve index.html correctly

## 10. Testing & Quality Assurance

- [x] 10.1 Test hero section renders correctly
- [x] 10.2 Test skills visualization (Fibonacci spiral view)
- [x] 10.3 Test skills visualization (Timeline view)
- [x] 10.4 Test view toggle between visualizations
- [x] 10.5 Test experience timeline section
- [x] 10.6 Test about section
- [x] 10.7 Test contact section
- [x] 10.8 Test theme toggle (light/dark mode)
- [ ] 10.9 Test chat widget open/close
- [ ] 10.10 Test chat message sending and streaming
- [ ] 10.11 Test chat starter prompts
- [ ] 10.12 Test chat error handling
- [ ] 10.13 Test responsive design on mobile
- [ ] 10.14 Test responsive design on tablet
- [x] 10.15 Run existing test suites (npm run test, npm run test:bdd)
- [ ] 10.16 Update any failing tests for new architecture

## 11. Documentation Updates

- [x] 11.1 Update README.md with new tech stack
- [x] 11.2 Update README.md with new dev commands (Vite)
- [x] 11.3 Update README.md deployment section
- [ ] 11.4 Update openspec/project.md with architecture changes
- [ ] 11.5 Update any code comments referencing Next.js or Vercel AI SDK
- [ ] 11.6 Create migration notes document (optional, for reference)

## 12. Production Deployment

- [ ] 12.1 Deploy to Netlify preview environment
- [ ] 12.2 Verify preview deployment works completely
- [ ] 12.3 Check Netlify Function logs for any errors
- [ ] 12.4 Test chat functionality on preview URL
- [ ] 12.5 Test all visualizations on preview URL
- [ ] 12.6 Verify environment variables are set (OPENROUTER_API_KEY)
- [ ] 12.7 Promote preview to production
- [ ] 12.8 Monitor production for 24-48 hours
- [ ] 12.9 Verify analytics/monitoring still working

## 13. Cleanup & Finalization

- [x] 13.1 Remove any backup/temporary files
- [x] 13.2 Clean up unused imports across codebase
- [x] 13.3 Run linter and fix any issues (npm run lint:fix)
- [x] 13.4 Run formatter on all files (npm run format)
- [ ] 13.5 Commit all changes with descriptive message
- [ ] 13.6 Tag release with version (e.g., v2.0.0-vite)
- [ ] 13.7 Update package.json version number
- [ ] 13.8 Archive this OpenSpec change
