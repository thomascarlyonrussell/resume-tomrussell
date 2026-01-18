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

The Fibonacci view SHALL include a legend explaining the visualization.

The legend SHALL show:
- Category colors and their meanings
- Size scale explanation (proficiency mapping)

#### Scenario: Understanding the visualization
- **GIVEN** a first-time visitor
- **WHEN** viewing the Fibonacci spiral
- **THEN** they can reference the legend to understand what they're seeing

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
