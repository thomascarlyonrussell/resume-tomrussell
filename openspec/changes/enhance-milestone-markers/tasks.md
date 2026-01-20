# Tasks: Enhance Milestone Markers

## Implementation Checklist

### Phase 1: Foundation
- [ ] Remove milestone year filter (show all years on x-axis)
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Remove `.filter((year) => year % 2 === 1)` from yearTicks
  - **Validation**: X-axis shows every year from 2009-2026

- [ ] Add category filtering state management
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add `useState<string | null>(null)` for highlightedCategory
  - **Validation**: State exists and can be updated

### Phase 2: Category Legend Enhancement
- [ ] Convert category legend to interactive buttons
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Convert `<div>` to `<button>` with onClick handler
  - **Validation**: Legend items are clickable

- [ ] Add visual feedback for selected/unselected categories
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Apply conditional classNames (highlight, dim)
  - **Validation**: Selected category shows background, others dim

- [ ] Apply opacity changes to Area components
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add fillOpacity/strokeOpacity based on highlightedCategory
  - **Validation**: Click legend → corresponding area highlights, others dim

### Phase 3: Chronological Category Stacking
- [ ] Compute category first-appearance order
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add useMemo to sort categories by first non-zero data point
  - **Validation**: Categories render bottom-to-top by first appearance date

- [ ] Update Area rendering to use sorted categories
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Replace `[...categories].reverse()` with `sortedCategories`
  - **Validation**: Earlier skills at bottom, newer skills on top

### Phase 4: Milestone Marker Investigation
- [ ] Research Recharts v3.6.0 capabilities for custom markers
  - **Actions**: Check docs, test Customized component, test ReferenceLine custom labels
  - **Outcome**: Document which approaches work/don't work

- [ ] Evaluate alternative approaches (SVG overlay, Scatter, etc.)
  - **Actions**: Prototype each approach, measure alignment accuracy
  - **Outcome**: Select most reliable approach

### Phase 5: Milestone Marker Implementation

**Dependency**: Phase 4 complete with approach selected

- [ ] Create MilestoneMarker SVG component
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Component**: Renders dot-line-hexagon with hover states
  - **Validation**: Component renders correctly in isolation

- [ ] Integrate markers into chart (approach-dependent)
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Implementation**: Use selected approach from Phase 4
  - **Validation**: Markers appear on chart at milestone years

- [ ] Verify marker positioning accuracy
  - **Actions**: Visual inspection, screenshot comparison
  - **Validation**: Markers align exactly with x-axis ticks

- [ ] Connect hover/click event handlers
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Wire setHoveredMilestone and setSelectedMilestone
  - **Validation**: Hover shows tooltip, click opens modal

### Phase 6: Tooltip Repositioning
- [ ] Move milestone tooltip above chart
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Position tooltip at top of chart container (not in separate section)
  - **Validation**: Tooltip appears near hovered marker

- [ ] Remove old milestone badges section
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Delete "★ Career Milestones" section with year badges
  - **Validation**: Badges removed, chart-integrated markers remain

### Phase 7: Visual Polish
- [ ] Add smooth transitions to marker hover states
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: CSS transitions (0.15s ease-out) on radius, stroke-width, fill
  - **Validation**: Hover transitions are smooth

- [ ] Ensure marker colors match theme
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Use `var(--color-engineering)` for consistency
  - **Validation**: Colors match rest of timeline

- [ ] Optimize chart bottom margin for marker visibility
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Increase bottom margin if needed (20px → 40px)
  - **Validation**: Hexagons not cut off by chart bounds

### Phase 8: Accessibility & Testing
- [ ] Add keyboard navigation to markers
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add tabindex, focus handlers, keyboard event listeners
  - **Validation**: Tab to markers, Enter/Space activates

- [ ] Update screen reader description
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Update sr-only text to mention integrated markers
  - **Validation**: Screen reader announces marker interactivity

- [ ] Add/update tests for milestone interactions
  - **File**: `src/components/visualizations/TimelineArea.test.tsx`
  - **Tests**: Hover, click, tooltip display, modal open
  - **Validation**: All tests pass

- [ ] Run full test suite
  - **Command**: `npm test`
  - **Validation**: No regressions, 60/60 tests pass

- [ ] Manual testing across viewports
  - **Actions**: Test on 375px, 768px, 1024px, 1920px
  - **Validation**: Markers render correctly at all sizes

### Phase 9: Validation
- [ ] Validate OpenSpec compliance
  - **Command**: `openspec validate enhance-milestone-markers --strict --no-interactive`
  - **Validation**: All requirements met, no validation errors

- [ ] Lighthouse accessibility audit
  - **Target**: 90+ accessibility score maintained
  - **Validation**: No accessibility regressions

- [ ] Visual regression testing
  - **Actions**: Screenshot comparison before/after
  - **Validation**: Unintended visual changes identified

## Notes

- **Parallel work**: Phases 2-3 (legend enhancement, stacking) can proceed independently of Phase 4-5 (marker investigation/implementation)
- **Decision point**: Phase 4 outcome determines Phase 5 implementation details
- **Rollback option**: If marker integration proves unreliable, keep current hybrid approach as fallback
