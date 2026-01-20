# Visualizations Spec Delta

## MODIFIED Requirements

### Requirement: Timeline Milestone Markers

The Timeline view SHALL display milestones as integrated interactive markers on the x-axis.

Milestone markers SHALL:
- Be positioned precisely on the x-axis at their year coordinate
- Use diamond shape (rotated 45° square polygon)
- Default size: 8px, hover size: 10px
- Use engineering theme color (#06B6D4 / cyan-500)
- Support hover interaction with visual feedback:
  - Scale from 8px to 10px
  - Increase opacity from 0.8 to 1.0
  - Apply subtle glow/drop-shadow effect
- Support click interaction to open milestone detail modal
- Display tooltip on hover showing:
  - Milestone title
  - Date
  - Description
  - "Click for more details" hint

Markers SHALL be:
- Aligned using Recharts' native coordinate system (not manual calculations)
- Rendered within the chart SVG (not as overlay)
- Keyboard accessible (tab navigation, Enter/Space to activate)
- Screen reader announced ("Hover or click milestone markers to explore career events")

#### Scenario: Milestone marker visibility
- **GIVEN** a milestone "Promoted to VP, Product Manager" dated 2020-04
- **WHEN** viewing the Timeline
- **THEN** a diamond-shaped marker appears on the x-axis at the 2020 tick
- **AND** the marker is interactive

#### Scenario: Milestone hover interaction
- **GIVEN** milestone markers are visible on the timeline
- **WHEN** user hovers over the 2020 milestone marker
- **THEN** the diamond scales from 8px to 10px
- **AND** opacity increases from 0.8 to 1.0
- **AND** a subtle glow effect appears
- **AND** a tooltip appears above the chart showing:
  - "Promoted to VP, Product Manager"
  - "2020-04"
  - Full description
  - "Click for more details"
- **AND** transitions are smooth (0.15s ease-out)

#### Scenario: Milestone click interaction
- **GIVEN** user hovers over a milestone marker
- **WHEN** they click the marker
- **THEN** the milestone detail modal opens
- **AND** displays complete milestone information
- **AND** the modal can be closed to return to the timeline

#### Scenario: Precise x-axis alignment
- **GIVEN** the x-axis displays years from 2009 to 2026
- **WHEN** milestone markers are rendered for years 2011, 2014, 2015, 2016, 2018, 2019, 2020, 2021, 2022, 2024
- **THEN** each diamond marker is centered exactly on the x-axis line at its year
- **AND** markers align perfectly with x-axis tick marks
- **AND** alignment is maintained across all viewport sizes

#### Scenario: Keyboard accessibility
- **GIVEN** a keyboard-only user
- **WHEN** they tab through interactive elements
- **THEN** milestone markers receive focus in logical order (left to right by year)
- **AND** focused marker shows visual focus indicator
- **AND** pressing Enter or Space opens the milestone detail modal
- **AND** screen reader announces milestone information on focus

---

## ADDED Requirements

### Requirement: Timeline X-Axis Year Display

The Timeline view SHALL display all years on the x-axis.

The x-axis SHALL:
- Show tick marks for every year in the data range
- Not filter or skip years (e.g., not "every other year")
- Provide clear temporal reference for both data and milestones

#### Scenario: Complete year range
- **GIVEN** timeline data from 2009 to 2026
- **WHEN** viewing the timeline
- **THEN** every year from 2009 to 2026 has a tick mark and label
- **AND** years are evenly spaced across the x-axis

### Requirement: Category Legend Interaction

The Timeline view SHALL support two levels of interaction via the category legend:
1. **Hover**: Highlight/dim for visual emphasis
2. **Click**: Drill down to show individual skills within the category

The category legend SHALL:
- Be positioned below the chart
- Display all categories with their colors
- Support hover interaction to temporarily highlight a category:
  - Hovered category: full opacity
  - Other categories: dimmed (fillOpacity=0.15, strokeOpacity=0.3)
- Support click interaction to drill down into individual skills
- Provide visual affordance that categories are clickable (cursor pointer, hover effect)

#### Scenario: Category hover emphasis
- **GIVEN** all categories are displayed normally
- **WHEN** user hovers over "AI & Automation" in the legend
- **THEN** the AI & Automation area is highlighted with full opacity
- **AND** all other categories dim temporarily
- **WHEN** user moves mouse away
- **THEN** all categories return to normal appearance

#### Scenario: Category click triggers drill-down
- **GIVEN** the timeline displays category-level aggregated view
- **WHEN** user clicks "Software Development" in the legend
- **THEN** the view transitions to drill-down mode showing individual skills
- **AND** only skills within "Software Development" are displayed
- **AND** each skill has its own colored series in the stacked area chart
- **AND** the legend updates to show individual skills
- **AND** a "Back to Categories" button appears above the chart

### Requirement: Timeline Category Stacking Order

The Timeline view SHALL stack categories chronologically by first appearance.

Category stacking SHALL:
- Order categories from bottom to top based on when they first appear in the timeline
- Place earliest categories at the bottom of the stack
- Place newer categories on top
- Maintain visual continuity (earlier skills form the foundation)

#### Scenario: Chronological stacking
- **GIVEN** "Engineering" skills start in 2009 and "AI & Automation" skills start in 2023
- **WHEN** viewing the stacked area chart
- **THEN** the Engineering category appears at the bottom of the stack
- **AND** the AI & Automation category appears near the top
- **AND** the visual metaphor suggests foundation → new skills building on top

---

### Requirement: Category Drill-Down View

The Timeline view SHALL support drilling down into individual skills within a selected category.

When a category is clicked, the view SHALL:
- Transition to "drill-down mode" displaying only skills from the selected category
- Replace category-level aggregation with skill-level series
- Display each skill as its own area in a stacked area chart
- Use color variations within the category's color palette for individual skills:
  - Generate shades/tints of the category color (e.g., lighter to darker variants)
  - Or use predefined color sets per category
  - Ensure sufficient contrast between adjacent skills
- Maintain chronological stacking (earliest skills at bottom)
- Update chart title or subtitle to indicate drill-down context (e.g., "Software Development Skills")
- Preserve milestone markers and x-axis
- Update Y-axis to reflect cumulative proficiency of displayed skills only

The drill-down view SHALL include:
- "Back to Categories" button or breadcrumb navigation to return to category view
- Legend showing individual skills within the category (not all categories)
- Skill series that use the same proficiency calculation as category aggregation
- Tooltip showing skill-specific proficiency values

#### Scenario: Drill down into category
- **GIVEN** the timeline displays all categories
- **WHEN** user clicks "Software Development" category
- **THEN** the chart transitions to show only Software Development skills
- **AND** skills like "Python", "JavaScript", "TypeScript", "React", etc. each have their own area
- **AND** each skill area uses a shade of the Software Development color
- **AND** the legend shows individual skills instead of categories
- **AND** a "Back to Categories" button appears

#### Scenario: Skill-level proficiency display
- **GIVEN** drill-down mode showing "AI & Automation" skills
- **WHEN** viewing "OpenAI API", "LangChain", "prompt-engineering" as individual series
- **WHEN** hovering over 2024-06
- **THEN** tooltip shows:
  - "June 2024"
  - "OpenAI API: 7.2"
  - "LangChain: 5.8"
  - "prompt-engineering: 6.5"
  - "Total AI & Automation Proficiency: 19.5"

#### Scenario: Return to category view
- **GIVEN** drill-down mode is active showing "Product Management" skills
- **WHEN** user clicks "Back to Categories" button
- **THEN** the chart transitions back to category-level aggregation
- **AND** all categories are visible again
- **AND** the legend shows categories instead of skills
- **AND** the "Back to Categories" button is hidden

#### Scenario: Drill-down stacking order
- **GIVEN** drill-down mode for "Software Development"
- **AND** "Python" first appeared in 2011, "TypeScript" in 2018, "React" in 2016
- **WHEN** viewing the stacked areas
- **THEN** Python appears at the bottom (earliest)
- **AND** React appears in the middle
- **AND** TypeScript appears higher up (most recent)

#### Scenario: Skill color differentiation
- **GIVEN** "Software Development" category color is cyan (#06B6D4)
- **WHEN** drilling down into 8 Software Development skills
- **THEN** each skill has a distinct shade from light cyan to dark cyan
- **AND** adjacent skills have sufficient contrast to distinguish them
- **AND** color assignment is consistent across sessions

#### Scenario: Drill-down with milestones
- **GIVEN** drill-down mode showing "Engineering" skills
- **WHEN** milestones are visible on the timeline
- **THEN** milestone markers remain interactive and visible
- **AND** clicking a milestone still opens the detail modal
- **AND** milestone context is preserved

#### Scenario: Keyboard navigation in drill-down
- **GIVEN** drill-down mode is active
- **WHEN** user tabs through interactive elements
- **THEN** focus order includes:
  - "Back to Categories" button (first)
  - Skill legend items (in display order)
  - Milestone markers (left to right)
- **AND** pressing Escape key returns to category view

#### Scenario: Animation during drill-down transition
- **GIVEN** user clicks a category to drill down
- **WHEN** the transition occurs
- **THEN** areas morph smoothly from category aggregates to individual skills
- **AND** transition duration is 300-500ms
- **AND** uses ease-in-out easing
- **AND** respects reduced-motion preferences (instant transition if prefers-reduced-motion)

---

### Requirement: Drill-Down Data Calculation

The system SHALL calculate individual skill proficiency series for drill-down view.

Data calculation SHALL:
- Use the same proficiency calculation method as category aggregation (linear progression/decay)
- Generate timeline data points with proficiency values per skill (not per category)
- Filter skills to only those in the selected category
- Maintain data structure compatibility with Recharts stacked area chart

The data layer SHALL provide:
- `generateSkillTimelineData(categoryId: string): SkillTimelineDataPoint[]`
  - Returns timeline data with skill-level proficiency values
  - Each data point has dynamic properties for each skill in the category
  - Example: `{ date: "2022-06", python: 7.2, javascript: 5.0, typescript: 6.5, ... }`

#### Scenario: Skill timeline data generation
- **GIVEN** "Software Development" category contains Python, JavaScript, TypeScript
- **WHEN** calling `generateSkillTimelineData('software-development')`
- **THEN** returns array of data points with:
  - `date`, `year`, `month` properties
  - `python`, `javascript`, `typescript` properties with proficiency values
  - Values calculated using same progression/decay logic as category aggregation

#### Scenario: Skill proficiency independence
- **GIVEN** Python proficiency at 2022-06 is 7.2
- **AND** this is calculated from Experience A (progressing) and Experience B (decaying)
- **WHEN** displayed in drill-down view
- **THEN** Python's proficiency value matches the sum used in category aggregation
- **AND** JavaScript's proficiency is calculated independently
