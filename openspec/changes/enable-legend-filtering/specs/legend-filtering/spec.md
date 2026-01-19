# Legend Filtering Specification Delta

## Overview

This delta extends the visualizations spec to add interactive category filtering through the legend component.

**Target Spec**: `visualizations`

**Change Type**: Enhancement

---

## MODIFIED Requirements

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

## ADDED Requirements

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

## Technical Notes

### Data Flow
```
SkillsSection
  └─ selectedCategoryFilter: CategoryId | null
  └─ handleCategoryToggle: (categoryId: CategoryId) => void
     ↓
  FibonacciSpiral
    └─ Filters skills with useMemo
    └─ Passes props to Legend
       ↓
    Legend
      └─ Renders interactive buttons
      └─ Calls onCategoryToggle on click
```

### Performance Considerations
- Filtering uses `useMemo` to prevent unnecessary recalculation
- Layout only recalculates when filtered skills array changes
- Category ID comparison is O(1) string equality
- Skill count helper function memoized at data layer

### Accessibility Implementation
- `role="radiogroup"` for legend filter group
- `role="radio"` for category buttons (single-select behavior)
- `aria-checked` reflects current filter state
- `aria-label` includes category name and skill count
- Live region (aria-live="polite") announces filter changes

### Animation Budget
- Exit animation: 200ms fade + scale
- Layout animation: Spring physics (handled by Framer Motion)
- Total perceived delay: <300ms for responsive feel
- Reduced motion: 10ms instant transitions
