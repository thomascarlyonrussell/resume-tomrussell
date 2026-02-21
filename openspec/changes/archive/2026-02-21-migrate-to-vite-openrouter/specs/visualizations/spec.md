## MODIFIED Requirements

### Requirement: Client-Side Code Splitting

Visualizations SHALL use React lazy loading for code splitting.

The implementation SHALL:
- Use React.lazy() for large visualization components
- Use Suspense boundaries with loading states
- Remove Next.js dynamic imports
- Load visualization libraries on demand

#### Scenario: Initial page load
- **GIVEN** a visitor loads the site
- **WHEN** the page renders initially
- **THEN** visualization code is not loaded yet
- **AND** the bundle size is smaller
- **AND** initial render is faster

#### Scenario: Visualization section visible
- **GIVEN** visitor scrolls to the visualization section
- **WHEN** the Suspense boundary detects the component is needed
- **THEN** the visualization code is loaded dynamically
- **AND** a loading indicator displays during load
- **AND** the visualization renders when ready

#### Scenario: Subsequent visits
- **GIVEN** visualization code was loaded previously
- **WHEN** visitor scrolls to visualization section again
- **THEN** code is already cached
- **AND** visualization renders immediately
