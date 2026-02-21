# Visualizations Specification - Timeline Refactoring Deltas

This document contains specification changes for the timeline visualization.

---

## MODIFIED Requirements

### Requirement: Timeline Stacked Area Chart

The Timeline view SHALL display skills as a stacked area chart showing **cumulative proficiency** over time.

The chart SHALL:
- X-axis: Time (years, from career start to present)
- Y-axis: **Cumulative proficiency values** (sum of all skill proficiency in each category)
- Areas: Stacked by category, showing continuous skill evolution
- Colors: Match category colors from Fibonacci view
- Curves: **Smooth transitions** with no discrete steps at experience boundaries

**MODIFIED**: Changed from "Cumulative skill count" to "Cumulative proficiency values"

#### Scenario: Career progression with smooth curves
- **GIVEN** Tom's career spans 2015-2025
- **WHEN** viewing the timeline
- **THEN** areas show categories building up continuously over time
- **AND** the curves are smooth with no abrupt steps
- **AND** skills grow during experiences and decay after

#### Scenario: Y-axis proficiency values
- **GIVEN** the timeline chart is displayed
- **WHEN** viewing the Y-axis
- **THEN** the label reads "Cumulative Proficiency"
- **AND** values represent sum of proficiency across all skills in each category
- **AND** hover tooltips explain proficiency values

---

### Requirement: Timeline Interactivity

The Timeline view SHALL support hover/touch interaction with **proficiency-aware tooltips**.

On hover over a point in time, the view SHALL:
- Display a vertical indicator line
- Show a tooltip or panel with:
  - Date/year
  - **Skills active at that point with their proficiency values**
  - Category breakdown showing **cumulative proficiency** per category
  - Any milestones at or near that date

On click/tap, the view MAY:
- Lock the selection for detailed exploration
- Show milestone details if applicable

**MODIFIED**: Tooltip now shows proficiency values instead of just skill presence

#### Scenario: Time exploration with proficiency
- **GIVEN** the user hovers at the year 2022 on the timeline
- **WHEN** the hover occurs
- **THEN** a tooltip shows all skills active in 2022
- **AND** each skill displays its current proficiency value at that date
- **AND** category totals show cumulative proficiency
- **AND** any milestones from that year are highlighted

#### Scenario: Tooltip proficiency breakdown
- **GIVEN** hovering over 2022-06 where:
  - Python has proficiency 7.5
  - JavaScript has proficiency 5.0
  - Both in "software-development" category
- **WHEN** tooltip is displayed
- **THEN** shows "Software Development: 12.5" (7.5 + 5.0)
- **AND** shows individual skills: "Python (7.5), JavaScript (5.0)"

---

### Requirement: Timeline Animation

The Timeline view SHALL animate smoothly to emphasize continuous skill evolution.

The view SHALL:
- Animate the areas building up from left to right
- **Use smooth easing curves** that reflect the continuous proficiency progression
- Fade in milestone markers
- Support reduced-motion preferences

**MODIFIED**: Emphasis on smooth curves matching the continuous data

#### Scenario: Timeline entrance with smooth progression
- **GIVEN** the user switches to Timeline view
- **WHEN** the animation plays
- **THEN** areas grow smoothly from left to right
- **AND** curves animate continuously without steps
- **AND** animation duration is appropriate for the smoothness

---

## ADDED Requirements

### Requirement: Timeline Legend Explanation

The Timeline view SHALL include a legend explaining the Y-axis proficiency metric.

The legend SHALL:
- Clarify that Y-axis values are "Cumulative Proficiency" not skill counts
- Explain that proficiency increases during experiences and decreases after
- Provide context: "Higher values indicate deeper expertise across more skills"
- Use clear, accessible language

#### Scenario: First-time user understanding
- **GIVEN** a first-time visitor viewing the timeline
- **WHEN** they see the chart
- **THEN** the legend explains what proficiency values mean
- **AND** they understand why curves rise and fall
- **AND** they can interpret the Y-axis correctly

---

### Requirement: Category Legend with Proficiency Context

The category legend SHALL display current proficiency totals alongside colors.

For each category, the legend SHALL show:
- Category color indicator
- Category name
- **Current total proficiency** (sum of all skills in category at present)

**ADDED**: Proficiency totals in legend

#### Scenario: Category proficiency display
- **GIVEN** current date is 2025-01
- **AND** "Software Development" category has:
  - Python (proficiency 8.0)
  - JavaScript (proficiency 5.5)
  - TypeScript (proficiency 6.0)
- **WHEN** viewing the category legend
- **THEN** shows "Software Development: 19.5" with category color

---

### Requirement: Smooth Curve Interpolation

The Timeline chart SHALL use appropriate curve interpolation to reflect continuous skill evolution.

The chart SHALL:
- Use `monotone` or `basis` curve type (not `linear` or `step`)
- Ensure curves never show sharp corners at experience boundaries
- Maintain mathematical accuracy while providing smooth visual representation

#### Scenario: Curve smoothness validation
- **GIVEN** a skill transitions from one experience to another
- **WHEN** viewing the timeline curve
- **THEN** the transition is visually smooth (no sharp angles)
- **AND** the curve accurately represents the underlying proficiency data

---

### Requirement: Accessible Proficiency Information

The Timeline view SHALL provide accessible alternatives to visual proficiency display.

The view SHALL:
- Include screen-reader text describing proficiency meaning
- Provide ARIA labels for proficiency values
- Ensure keyboard navigation can access proficiency data
- Include text summary of proficiency trends

#### Scenario: Screen reader usage
- **GIVEN** a screen reader user navigating the timeline
- **WHEN** they focus on a data point
- **THEN** they hear "June 2022, Software Development proficiency: 12.5"
- **AND** they understand the metric without seeing the chart

---

## REMOVED Requirements

None - existing requirements remain valid with modifications above.
