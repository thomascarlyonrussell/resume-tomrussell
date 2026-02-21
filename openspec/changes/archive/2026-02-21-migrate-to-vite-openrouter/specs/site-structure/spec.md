## MODIFIED Requirements

### Requirement: Single Page Layout

The site SHALL be a single-page React application with client-side routing.

The application SHALL:
- Use Vite as the build tool
- Use React Router for routing (though only one route needed)
- Load as static files from CDN
- Have no server-side rendering

#### Scenario: Page load
- **GIVEN** a visitor navigates to the site
- **WHEN** the page loads
- **THEN** all sections are accessible via scrolling
- **AND** the page loads with the Hero section visible
- **AND** all content is rendered client-side

#### Scenario: Section navigation
- **GIVEN** the visitor is on any section
- **WHEN** they scroll down
- **THEN** they smoothly transition to the next section

---

## ADDED Requirements

### Requirement: Vite Build System

The site SHALL be built using Vite as the build tool.

The build system SHALL:
- Support React with JSX/TSX
- Include Tailwind CSS PostCSS plugin
- Support path aliases (@/ for src/)
- Output optimized static files to dist/
- Provide fast HMR (Hot Module Replacement) in development

#### Scenario: Development build
- **GIVEN** developer runs `npm run dev`
- **WHEN** Vite dev server starts
- **THEN** the site is accessible at localhost:5173
- **AND** changes trigger instant HMR updates

#### Scenario: Production build
- **GIVEN** developer runs `npm run build`
- **WHEN** Vite builds the application
- **THEN** optimized static files are output to dist/
- **AND** files include HTML, CSS, JS bundles
- **AND** assets are fingerprinted for caching

---

### Requirement: Static File Deployment

The site SHALL deploy as static files to Netlify CDN.

Deployment SHALL:
- Serve files from dist/ directory
- Use SPA fallback (all routes → index.html)
- Set appropriate cache headers
- Deploy serverless functions to /.netlify/functions/

#### Scenario: Production deploy
- **GIVEN** the dist/ folder contains built files
- **WHEN** deployment runs on Netlify
- **THEN** static files are served from CDN
- **AND** all URLs route to index.html for SPA handling
- **AND** Netlify Functions handle API routes

---

### Requirement: React Router Integration

The site SHALL use React Router for navigation structure.

Router configuration SHALL:
- Define single root route (/)
- Support smooth scroll to sections
- Maintain scroll position on refresh
- Handle 404s by redirecting to root

#### Scenario: Root route access
- **GIVEN** visitor navigates to /
- **WHEN** the route loads
- **THEN** the full single-page app is rendered
- **AND** all sections are accessible

#### Scenario: Invalid route access
- **GIVEN** visitor navigates to /nonexistent
- **WHEN** the route is processed
- **THEN** redirects to root route /
- **AND** renders the full page normally
