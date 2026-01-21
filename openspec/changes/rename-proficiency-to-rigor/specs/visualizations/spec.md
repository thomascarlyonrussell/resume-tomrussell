# Visualizations Specification - Delta

## MODIFIED Requirements

### Requirement: Timeline Stacked Area Chart

The Timeline view SHALL display skill proficiencies as a stacked area chart over time.

The chart SHALL:
- X-axis: Time (years, from career start to present)
- Y-axis: Cumulative proficiency (sum of skill proficiencies per category or per skill)
- Areas: Stacked by category (default) or by skill (drill-down)
- Colors: Match category colors from Fibonacci view

The chart SHALL support two view modes:
1. **Category view** (default): Sum of all skill proficiencies within each category
2. **Skill view** (drill-down): Individual skill proficiencies within a selected category

#### Scenario: Career progression with proficiency
- **GIVEN** Tom's career spans 2009-2025
- **WHEN** viewing the timeline at category level
- **THEN** Y-axis shows cumulative proficiency per category
- **AND** areas grow as skills build proficiency through experience
- **AND** areas shrink slightly during periods of skill decay

#### Scenario: Skill proficiency decay visible
- **GIVEN** a skill was used intensively (rigor 5) in 2015-2018
- **AND** not used from 2018-2020
- **AND** used again (rigor 8) from 2020-present
- **WHEN** viewing the timeline
- **THEN** the skill's contribution shows growth during 2015-2018
- **AND** shows decay during 2018-2020 gap
- **AND** shows renewed growth from 2020-present

---

### Requirement: Timeline Drill-Down

The Timeline view SHALL support drill-down from category level to skill level.

Drill-down SHALL:
- Allow user to click/tap a category to see individual skills within it
- Show individual skill proficiencies as separate stacked areas
- Provide a back/up navigation to return to category view
- Animate smoothly between view levels

#### Scenario: Drilling down into a category
- **GIVEN** the timeline is showing category-level view
- **WHEN** user clicks on the "Software Development" category
- **THEN** the view transitions to show individual skills within Software Development
- **AND** each skill (Python, C#, GitHub, etc.) shows as a separate stacked area
- **AND** Y-axis shows individual skill proficiencies

#### Scenario: Returning to category view
- **GIVEN** the timeline is showing skill-level view for a category
- **WHEN** user clicks the back/up navigation
- **THEN** the view transitions back to category-level
- **AND** shows all categories stacked again

#### Scenario: Skill-level tooltip
- **GIVEN** the timeline is at skill-level view
- **WHEN** user hovers over a specific skill area at a point in time
- **THEN** tooltip shows:
  - Skill name
  - Proficiency value at that point
  - Experience(s) contributing at that time
  - Rigor level from the active experience

---

### Requirement: Timeline Interactivity

The Timeline view SHALL support hover/touch interaction.

On hover over a point in time, the view SHALL:
- Display a vertical indicator line
- Show a tooltip or panel with:
  - Date/year
  - Total proficiency at that point (category or skill level)
  - Breakdown of contributing skills/categories
  - Any milestones at or near that date

For category-level view, tooltip SHALL show:
- Category name and total proficiency
- Top contributing skills within the category

For skill-level view, tooltip SHALL show:
- Skill name and proficiency
- Active experience(s) at that time
- Rigor level from active experience

#### Scenario: Time exploration at category level
- **GIVEN** the user hovers at year 2022 on the category-level timeline
- **WHEN** the hover occurs
- **THEN** a tooltip shows:
  - Total proficiency for visible categories
  - Top skills contributing to each category
  - Any milestones from that year

#### Scenario: Time exploration at skill level
- **GIVEN** the user hovers at year 2022 on the skill-level timeline for Software Development
- **WHEN** the hover occurs
- **THEN** a tooltip shows:
  - Proficiency value for each skill at that point
  - Which experience was active for each skill
  - Rigor level from each active experience

---

### Requirement: Fibonacci Interactivity

The Fibonacci view SHALL support mouse/touch interaction.

On hover/focus, the view SHALL:
- Highlight the hovered skill
- Display a tooltip or info panel showing:
  - Skill name
  - Category and subcategory
  - Computed proficiency (binned to Fibonacci scale)
  - Brief description (if available)
  - Years of experience with the skill
  - Current decay status (active, recent, old)

Note: The displayed proficiency is the time-dynamic computed value, not the raw rigor from experiences.

#### Scenario: Hover interaction showing computed proficiency
- **GIVEN** the user hovers over a skill element
- **WHEN** the cursor is over "Python"
- **THEN** a tooltip appears showing:
  - Name: Python
  - Category: Software Development
  - Proficiency: 8 (Expert) - the Fibonacci-binned computed value
  - Years: 10.5 years
  - Status: Active (no decay)
- **AND** the element visually highlights

#### Scenario: Hover on degraded skill
- **GIVEN** the user hovers over an inactive skill
- **WHEN** the cursor is over "Microsoft Access" (last used 2015)
- **THEN** a tooltip shows:
  - Proficiency: 1 (Beginner) - reduced due to decay
  - Status: Degraded (>5 years since last use)
  - Original peak rigor from experiences may be mentioned
