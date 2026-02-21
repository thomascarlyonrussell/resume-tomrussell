# Site Structure Specification

## Purpose

Define the overall page layout, navigation, and section organization for Tom Russell's portfolio website.

## Overview

The site is a single-page application with distinct sections that visitors scroll through. The design balances creative visual impact with professional presentation.

---
## Requirements
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

### Requirement: Section Order

The page SHALL contain sections in this order:
1. Hero / Introduction
2. Skills & Experience Visualization (toggleable views)
3. Work Experience Timeline
4. About Me & Career Highlights
5. Contact / Footer

#### Scenario: Complete page scroll
- **GIVEN** a visitor at the top of the page
- **WHEN** they scroll through the entire page
- **THEN** they encounter: Hero → Skills → Experience → About → Contact

**Rationale**: Moving the About section after Experience creates a more logical narrative flow. Visitors first see what Tom knows (Skills) and where he's worked (Experience), then learn about who he is (About) before reaching out (Contact).

---

### Requirement: Hero Section

The Hero section SHALL introduce Tom Russell with visual impact.

The Hero section SHALL include:
- Tom's name prominently displayed
- A professional tagline or title
- Subtle animation or visual interest
- Visual indication to scroll down

#### Scenario: First impression
- **GIVEN** a new visitor arrives at the site
- **WHEN** the Hero section loads
- **THEN** Tom's name is immediately visible
- **AND** the visitor understands this is a professional portfolio

---

### Requirement: About Section

The About section SHALL provide a brief professional summary.

The About section SHALL include:
- A concise professional bio (2-3 paragraphs max)
- Key highlights or value proposition
- Professional photo (optional, placeholder acceptable initially)

#### Scenario: Learning about Tom
- **GIVEN** a visitor scrolls to the About section
- **WHEN** they read the content
- **THEN** they understand Tom's professional background and focus areas

---

### Requirement: Visualization Section

The Visualization section SHALL be the centerpiece of the site.

The section SHALL include:
- A toggle control to switch between two views
- Fibonacci Spiral View (skills by intensity)
- Timeline Stacked Area View (skills over time)
- Interactive hover/click behaviors
- Smooth transitions between views

#### Scenario: Default view
- **GIVEN** a visitor scrolls to the Visualization section
- **WHEN** the section comes into view
- **THEN** one view (Fibonacci ["Skills"] or Timeline ["Career"]) is displayed by default

#### Scenario: View toggle
- **GIVEN** the visitor is viewing the Visualization section
- **WHEN** they click the toggle control
- **THEN** the view smoothly transitions to the alternate visualization

---

### Requirement: Contact Section

The Contact section SHALL provide ways to reach Tom.

The Contact section SHALL include:
- Professional email address (or contact form)
- LinkedIn profile link
- GitHub profile link
- Any other relevant professional links

The Contact section SHOULD include:
- A brief call-to-action message

#### Scenario: Contacting Tom
- **GIVEN** a visitor wants to contact Tom
- **WHEN** they scroll to the Contact section
- **THEN** they can find email, LinkedIn, and GitHub links

---

### Requirement: Chatbot Widget

A chatbot widget SHALL be accessible from a fixed position on the page.

The widget SHALL:
- Be positioned center-bottom of the viewport
- Be collapsible/expandable
- Persist across all sections (fixed position)
- Not obstruct critical content when collapsed

#### Scenario: Opening chat
- **GIVEN** the visitor is on any section of the page
- **WHEN** they click the chat widget
- **THEN** the chat interface expands
- **AND** they can interact with the AI chatbot

#### Scenario: Chat while scrolling
- **GIVEN** the chat widget is open
- **WHEN** the visitor scrolls the page
- **THEN** the chat widget remains visible and functional

---

### Requirement: Responsive Design

The site SHALL be fully responsive across device sizes.

The site SHALL support:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

#### Scenario: Mobile viewing
- **GIVEN** a visitor on a mobile device
- **WHEN** they view the site
- **THEN** all content is readable and accessible
- **AND** visualizations adapt to smaller screens
- **AND** the chatbot remains usable

---

### Requirement: Navigation Indicators

The site SHALL provide visual indicators of current position with interactive navigation.

The navigation SHALL:
- Display the currently active section with a larger, colored dot
- Show section labels on hover via tooltips
- Allow clicking to jump directly to any section
- Maintain keyboard accessibility with focus indicators

#### Scenario: Scroll progress
- **GIVEN** a visitor is scrolling through the site
- **WHEN** they are partway through
- **THEN** they see which section is active via the navigation dots
- **AND** they can hover over dots to see section labels
- **AND** they can click dots to jump to sections

#### Scenario: Hover interaction
- **GIVEN** a visitor sees the navigation component
- **WHEN** they hover over any navigation dot
- **THEN** a tooltip appears showing the section label

**Rationale**: Working hover tooltips improve discoverability and usability of the navigation system.

---

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

---

## Visual Hierarchy

```
+---------------------------------------------+
|                   HERO                       |
|           Tom Russell                        |
|       [Tagline / Title]                      |
|              v                               |
+---------------------------------------------+
|             VISUALIZATIONS                   |
|     [Toggle: Fibonacci | Timeline]           |
|                                              |
|   +-------------------------------------+   |
|   |                                     |   |
|   |     [Interactive Visualization]     |   |
|   |                                     |   |
|   +-------------------------------------+   |
|                                              |
+---------------------------------------------+
|               EXPERIENCE                     |
|          [Work Timeline]                     |
|                                              |
+---------------------------------------------+
|                  ABOUT                       |
|   [Photo]    [Professional Bio]              |
|              [Key Highlights]                |
+---------------------------------------------+
|                 CONTACT                      |
|   [CTA Message]                              |
|   [Email] [LinkedIn] [GitHub]                |
+---------------------------------------------+
        +-------------------+
        |   Chat with AI    |  <- Fixed position
        +-------------------+
```
