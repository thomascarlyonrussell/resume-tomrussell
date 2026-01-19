# Site Structure Spec Delta

## MODIFIED Requirements

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
