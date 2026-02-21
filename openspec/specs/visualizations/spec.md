# Visualizations Specification

## Purpose

Define the interactive data visualizations that showcase Tom's skills and career progression. These visualizations are the centerpiece of the portfolio site.

## Overview

Two complementary visualizations present the same underlying skill data from different perspectives:

1. **Fibonacci Spiral View** - Skills sized by intensity/proficiency, arranged in a golden spiral
2. **Timeline Stacked Area View** - Category growth over time, showing career progression

Users toggle between views to explore the data from different angles.

---
## Requirements
### Requirement: View Toggle

The visualization section SHALL include a toggle to switch between views.

The toggle SHALL:
- Clearly indicate which view is currently active
- Provide labels: "Skills" (Fibonacci) and "Career" (Timeline)
- Animate smoothly between states

#### Scenario: Toggle interaction
- **GIVEN** the Fibonacci view is displayed
- **WHEN** user clicks the Timeline toggle option
- **THEN** the view transitions smoothly to Timeline
- **AND** the toggle updates to show Timeline as active

---

### Requirement: Fibonacci Spiral Layout

Skills SHALL be arranged along a Fibonacci/golden spiral pattern.

The layout SHALL:
- Position skills in a spiral emanating from center
- Size each skill element using the Fibonacci sizing formula (see data-model spec)
  - `size = proficiency × weighted_years × degradation_factor`
  - Final size mapped to Fibonacci sequence: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
- Color-code skills by category
- Fill the available viewport space appropriately

#### Scenario: Skill sizing with experience
- **GIVEN** an active skill with proficiency 8 and 10 years experience
- **WHEN** displayed in the spiral
- **THEN** calculated size = 8 × (10 × 1.0) × 1.0 = 80, mapped to 89
- **AND** appears much larger than a proficiency 3 skill with 2 years

#### Scenario: Degraded skill sizing
- **GIVEN** an inactive skill (ended 6 years ago) with proficiency 5 and 3 years experience
- **WHEN** displayed in the spiral
- **THEN** calculated size = 5 × (3 × 0.625) × 0.25 ≈ 2.34, mapped to 3
- **AND** appears smaller due to time degradation
#### Scenario: Category coloring
- **GIVEN** skills from "software-development" and "ai-automation" categories
- **WHEN** displayed in the spiral
- **THEN** each category has a distinct, consistent color

---

### Requirement: Fibonacci Interactivity

The Fibonacci view SHALL support mouse/touch interaction.

On hover/focus, the view SHALL:
- Highlight the hovered skill
- Display a tooltip or info panel showing:
  - Skill name
  - Category and subcategory
  - Proficiency level (visual + numeric)
  - Brief description (if available)
  - Years of experience with the skill

On click/tap, the view MAY:
- Expand to show more detail
- Filter related skills
- Show associated milestones

#### Scenario: Hover interaction
- **GIVEN** the user hovers over a skill element
- **WHEN** the cursor is over "Python"
- **THEN** a tooltip appears with Python's details
- **AND** the element visually highlights

#### Scenario: Touch interaction
- **GIVEN** a mobile user
- **WHEN** they tap a skill element
- **THEN** the detail panel appears
- **AND** they can tap elsewhere to dismiss

---

### Requirement: Fibonacci Animation

The Fibonacci view SHALL include entrance and transition animations.

The view SHALL:
- Animate skills into position on initial load
- Stagger the animation for visual interest
- Support reduced-motion preferences

#### Scenario: Initial load
- **GIVEN** the user scrolls to the visualization section
- **WHEN** Fibonacci view loads
- **THEN** skills animate into the spiral formation
- **AND** animation respects user's motion preferences

---

### Requirement: Fibonacci Legend

The Fibonacci view SHALL include an interactive legend explaining and controlling the visualization.

The legend SHALL show:
- Category colors and their meanings
- Skill count for each category
- Size scale explanation (proficiency mapping)

The legend SHALL support:
- Click/tap interaction to filter by category
- Visual feedback showing selected category
- Keyboard navigation (arrow keys, Space/Enter, Escape)
- Screen reader announcements of filter state

#### Scenario: Understanding the visualization
- **GIVEN** a first-time visitor
- **WHEN** viewing the Fibonacci spiral
- **THEN** they can reference the legend to understand what they're seeing

#### Scenario: Category filtering via legend
- **GIVEN** the Fibonacci view displays all skills
- **WHEN** user clicks "Software Development" in the legend
- **THEN** the spiral filters to show only Software Development skills
- **AND** the legend highlights "Software Development" as selected
- **AND** other categories are visually dimmed

#### Scenario: Clearing filter
- **GIVEN** a category filter is active
- **WHEN** user clicks the same category again
- **THEN** the filter clears and all skills are shown
- **AND** the legend returns to default state with no category highlighted

#### Scenario: Keyboard navigation in legend
- **GIVEN** keyboard focus is in the legend
- **WHEN** user presses arrow keys
- **THEN** focus moves between category items
- **AND** pressing Space or Enter toggles the filter
- **AND** pressing Escape clears any active filter

#### Scenario: Screen reader announcement
- **GIVEN** a screen reader user
- **WHEN** they activate a category filter
- **THEN** the screen reader announces: "Filtered to [Category Name], showing [N] skills"

---

### Requirement: Timeline Stacked Area Chart

The Timeline view SHALL display skills as a stacked area chart over time.

The chart SHALL:
- X-axis: Time (years, from career start to present)
- Y-axis: Cumulative skill count or weighted value per category
- Areas: Stacked by category, showing growth over time
- Colors: Match category colors from Fibonacci view

#### Scenario: Career progression
- **GIVEN** Tom's career spans 2015-2025
- **WHEN** viewing the timeline
- **THEN** areas show categories building up over time
- **AND** the total height increases as skills accumulate

---

### Requirement: Timeline Interactivity

The Timeline view SHALL support hover/touch interaction.

On hover over a point in time, the view SHALL:
- Display a vertical indicator line
- Show a tooltip or panel with:
  - Date/year
  - Skills active at that point
  - Category breakdown
  - Any milestones at or near that date

On click/tap, the view MAY:
- Lock the selection for detailed exploration
- Show milestone details if applicable

#### Scenario: Time exploration
- **GIVEN** the user hovers at the year 2022 on the timeline
- **WHEN** the hover occurs
- **THEN** a tooltip shows all skills active in 2022
- **AND** any milestones from that year are highlighted

---

### Requirement: Timeline Milestone Markers

The Timeline view SHALL display milestones as markers.

Milestones SHALL:
- Appear as points or icons on the timeline
- Be positioned at their date on the X-axis
- Be interactive (hover for details)

#### Scenario: Milestone visibility
- **GIVEN** a milestone "LoadSEER Next Launch" in 2023
- **WHEN** viewing the timeline
- **THEN** a marker appears at the 2023 position
- **AND** hovering shows the milestone details

---

### Requirement: Timeline Animation

The Timeline view SHALL animate on load and when data changes.

The view SHALL:
- Animate the areas building up from left to right
- Fade in milestone markers
- Support reduced-motion preferences

#### Scenario: Timeline entrance
- **GIVEN** the user switches to Timeline view
- **WHEN** the animation plays
- **THEN** areas grow from the start date toward present
- **AND** the effect suggests career growth over time

---

### Requirement: Timeline Legend

The Timeline view SHALL include a legend.

The legend SHALL show:
- Category colors and names
- Explanation of the stacked area representation

#### Scenario: Legend clarity
- **GIVEN** a first-time visitor
- **WHEN** viewing the Timeline
- **THEN** they can reference the legend to understand category colors

---

### Requirement: Responsive Sizing

Both visualizations SHALL adapt to viewport size.

The visualizations SHALL:
- Fill available width in their container
- Maintain aspect ratio or adapt layout for mobile
- Remain readable at all supported breakpoints

#### Scenario: Mobile viewport
- **GIVEN** a mobile device with 375px width
- **WHEN** viewing either visualization
- **THEN** the content fits without horizontal scroll
- **AND** interactions work via touch

---

### Requirement: Visualization Accessibility

Both visualizations SHALL be accessible.

The visualizations SHALL:
- Support keyboard navigation
- Provide screen reader descriptions
- Use sufficient color contrast
- Not rely solely on color to convey information
- Respect prefers-reduced-motion

#### Scenario: Screen reader user
- **GIVEN** a user with a screen reader
- **WHEN** they navigate to the visualization section
- **THEN** they hear a summary description of the data
- **AND** can access individual skill information

#### Scenario: Keyboard navigation
- **GIVEN** a keyboard-only user
- **WHEN** they tab into the visualization
- **THEN** they can navigate between skill elements
- **AND** access tooltips/details with Enter/Space

---

### Requirement: Visualization Performance

Visualizations SHALL perform smoothly.

The visualizations SHALL:
- Render at 60fps during animations
- Not block the main thread during initial render
- Lazy-load if not immediately in viewport

#### Scenario: Large dataset
- **GIVEN** 50+ skills in the dataset
- **WHEN** rendering either visualization
- **THEN** performance remains smooth
- **AND** animations don't stutter

---

### Requirement: Client-Side Code Splitting

Visualizations SHALL use React lazy loading for code splitting.

The implementation SHALL:
- Use React.lazy() for large visualization components
- Use Suspense boundaries with loading states
- Load visualization libraries on demand
- Reduce initial bundle size

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

---

### Requirement: Legend Interactivity

The legend SHALL be interactive and respond to user input.

Legend items SHALL:
- Be keyboard focusable (Tab key)
- Be clickable/tappable
- Show hover state with visual feedback
- Show focus state with visible focus ring
- Use appropriate ARIA roles and attributes

#### Scenario: Mouse hover feedback
- **GIVEN** the user hovers over a category in the legend
- **WHEN** the cursor is over "AI & Automation"
- **THEN** the category shows hover feedback (brightness/scale change)
- **AND** cursor changes to pointer

#### Scenario: Touch interaction
- **GIVEN** a mobile user
- **WHEN** they tap a category in the legend
- **THEN** the filter toggles for that category
- **AND** visual feedback is immediate

#### Scenario: Keyboard accessibility
- **GIVEN** a keyboard-only user
- **WHEN** they Tab to the legend
- **THEN** they can navigate categories with arrow keys
- **AND** activate filtering with Space or Enter
- **AND** clear filter with Escape

---

### Requirement: Filtered Spiral Animation

The Fibonacci spiral SHALL animate smoothly when filtering changes.

When a filter is applied, the view SHALL:
- Fade out and scale down skills being removed
- Re-layout remaining skills with smooth transitions
- Use spring physics for natural motion
- Respect `prefers-reduced-motion` user preference

When a filter is cleared, the view SHALL:
- Fade in and scale up skills being added
- Re-layout all skills smoothly
- Maintain consistent animation timing

#### Scenario: Filter application animation
- **GIVEN** all skills are visible
- **WHEN** user filters to a single category
- **THEN** non-matching skills fade out and scale down over 200ms
- **AND** remaining skills re-position smoothly with spring animation
- **AND** the spiral remains centered

#### Scenario: Filter removal animation
- **GIVEN** a category filter is active
- **WHEN** user clears the filter
- **THEN** filtered-out skills fade in and scale up
- **AND** all skills re-position to their original locations
- **AND** animation feels smooth and continuous

#### Scenario: Reduced motion preference
- **GIVEN** user has `prefers-reduced-motion` enabled
- **WHEN** they apply or clear a filter
- **THEN** animations are instant (opacity changes only, no scale or delays)
- **AND** layout transitions are minimal

---

### Requirement: Filter State Management

The visualization section SHALL manage filter state consistently.

Filter state SHALL:
- Be owned by the parent container (`SkillsSection`)
- Be passed down to child components as props
- Be single-select (only one category at a time)
- Default to null (no filter, all skills shown)

#### Scenario: Initial state
- **GIVEN** the visualization loads for the first time
- **WHEN** the Fibonacci view is displayed
- **THEN** no filter is applied (all skills visible)
- **AND** no category is highlighted in legend

#### Scenario: State propagation
- **GIVEN** user clicks a category in the legend
- **WHEN** the state updates in SkillsSection
- **THEN** FibonacciSpiral receives the new filter state
- **AND** re-renders with filtered skills
- **AND** Legend receives the state and updates visual indicators

---

### Requirement: Filtered Skill Counts

The legend SHALL display the number of skills in each category.

Skill counts SHALL:
- Be calculated from the complete skill dataset
- Be displayed next to each category name (e.g., "Engineering (8)")
- Update when the underlying data changes
- Be announced to screen readers

#### Scenario: Count display
- **GIVEN** the legend is rendered
- **WHEN** viewing category items
- **THEN** each category shows format: "[Category Name] ([Count])"
- **EXAMPLE**: "Software Development (15)"

#### Scenario: Count accuracy
- **GIVEN** the skill dataset contains 8 Engineering skills
- **WHEN** viewing the legend
- **THEN** Engineering displays as "Engineering (8)"
- **AND** the count matches the actual number of skills

---

## Technical Implementation Notes

### D3.js Usage

Both visualizations will use D3.js for:
- Data binding and scales
- SVG generation
- Transitions and animations
- Event handling

### Component Structure

```
src/components/visualizations/
├── VisualizationSection.tsx   # Container with toggle
├── FibonacciSpiral.tsx        # Fibonacci view component
├── TimelineArea.tsx           # Timeline view component
├── SkillTooltip.tsx           # Shared tooltip component
├── Legend.tsx                 # Shared legend component
└── hooks/
    ├── useFibonacciLayout.ts  # Spiral positioning logic
    └── useTimelineData.ts     # Timeline data transformation
```
