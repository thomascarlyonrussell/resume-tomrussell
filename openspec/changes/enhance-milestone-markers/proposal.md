# Proposal: Enhance Milestone Markers

## Change ID
`enhance-milestone-markers`

## Problem Statement

The current timeline visualization displays career milestones in two separate, disconnected ways:
1. Simple star icons (★) with dashed reference lines within the chart
2. Year badges below the chart that users can hover/click for details

This separation creates a disconnect between the visual timeline and the interactive milestone information. Users must look away from the chart to see which years have milestones and must click badges to understand their significance.

## Proposed Solution

Replace the separate milestone badges with integrated, interactive **diamond-shaped markers** directly on the timeline chart, positioned on the x-axis.

**Design Rationale**: Research shows diamonds are the industry standard for milestone markers in project timelines and Gantt charts. They provide immediate visual recognition and clear distinction from circular data points.

Each marker will be:
- **Diamond shape** (rotated 45° square) positioned on the x-axis line (at y=0)
- **Size**: 8px default, 10px on hover
- **Color**: Engineering theme color (#06B6D4) with 0.8 opacity, full opacity on hover
- **Visual feedback**: Scale and opacity transitions on hover

Additionally, the category legend will be enhanced to support:
- **Hover**: Temporarily highlight/dim categories for visual emphasis
- **Click**: Drill down to show individual skills within that category

These markers will:
- Be precisely aligned with their year on the x-axis (using Recharts' coordinate system)
- Support hover interactions (show tooltip with milestone details)
- Support click interactions (open milestone detail modal)
- Provide visual feedback on hover (scale + opacity + glow)

## User Value

**Milestone Markers:**
- **Better information density**: Milestones visible directly on the timeline without looking elsewhere
- **Clearer temporal context**: Diamond markers positioned exactly at their year make it easier to correlate milestones with skill changes
- **Industry-standard design**: Diamonds are immediately recognizable as milestone indicators
- **Improved interactivity**: Hover/click interactions work directly on the chart markers

**Drill-Down View:**
- **Deeper insights**: Explore individual skills within a category to understand specific proficiency trends
- **Progressive disclosure**: Start with high-level category view, drill down for details
- **Better comparison**: See how individual skills within a category evolved relative to each other

## Scope

### In Scope
- Design and implement diamond milestone marker SVG component
- Position markers accurately on the x-axis using Recharts coordinate system
- Add hover state management and visual feedback
- Add click handling to open milestone detail modal
- Display tooltip on hover with milestone title, date, and description
- Remove separate milestone badges section
- Enhance category legend with hover highlighting
- Implement category drill-down to show individual skills
- Generate skill-level timeline data for drill-down view
- Create color palettes for skill differentiation within categories
- Add "Back to Categories" navigation
- Maintain accessibility (keyboard navigation, screen reader support)

### Out of Scope
- Changes to milestone data model
- Changes to milestone detail modal
- Changes to proficiency calculation algorithm
- Cross-category skill comparisons in drill-down mode

## Technical Approach

The implementation will use Recharts' native positioning capabilities to ensure pixel-perfect alignment. Since Recharts v3.6.0 has limitations with custom label components, we'll explore:

1. **ReferenceLine with overlay SVG** (if custom labels not supported)
2. **Scatter component with custom shapes** (if ReferenceLine insufficient)
3. **Absolutely positioned SVG layer** (fallback if Recharts approaches fail)

Details and trade-offs are captured in `design.md`.

## Research & References

**Milestone Marker Design Patterns:**
- [Atlassian: Milestone Chart Best Practices](https://www.atlassian.com/work-management/project-management/project-planning/milestone-chart) - Diamond markers are standard for milestones
- [d3-milestones Library](https://github.com/walterra/d3-milestones) - Uses bullet/circle markers with customizable styling
- [Highcharts Annotations](https://www.highcharts.com/demo/highcharts/annotations) - Connector-based annotation patterns
- [D3 Graph Gallery: Stacked Area](https://d3-graph-gallery.com/stackedarea) - Examples of area chart implementations

**Key Findings:**
- Diamonds are the most common milestone indicator in project management tools
- Different shapes convey meaning (stars=achievements, triangles=decisions, diamonds=milestones)
- Size hierarchy and color coding enhance clarity
- Avoiding label overlap is critical for readability

## Validation

The change will be considered complete when:

**Milestone Markers:**
- All diamond markers render on the x-axis at their correct year positions
- Hover shows tooltip with milestone details
- Click opens milestone detail modal
- Visual feedback (scale/opacity/glow) appears on hover
- No visual misalignment between markers and axis labels

**Drill-Down Functionality:**
- Category legend supports hover highlighting
- Click category triggers drill-down to individual skills
- Skill-level areas render correctly with color variations
- "Back to Categories" navigation works
- Animations respect reduced-motion preferences

**Quality Gates:**
- Accessibility maintained (keyboard nav, screen reader descriptions)
- Tests pass without regression (60/60)
- Lighthouse accessibility score ≥ 90
