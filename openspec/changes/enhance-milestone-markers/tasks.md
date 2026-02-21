# Tasks: Enhance Milestone Markers

## Implementation Checklist

### Phase 1: Foundation
- [x] Remove milestone year filter (show all years on x-axis)
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Remove `.filter((year) => year % 2 === 1)` from yearTicks
  - **Validation**: X-axis shows every year from 2009-2026

- [x] Add category filtering state management
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add `useState<string | null>(null)` for highlightedCategory
  - **Validation**: State exists and can be updated

### Phase 2: Category Legend Enhancement
- [x] Convert category legend to interactive buttons
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Convert `<div>` to `<button>` with onClick handler
  - **Validation**: Legend items are clickable

- [x] Add visual feedback for selected/unselected categories
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Apply conditional classNames (highlight, dim)
  - **Validation**: Selected category shows background, others dim

- [x] Apply opacity changes to Area components
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add fillOpacity/strokeOpacity based on highlightedCategory
  - **Validation**: Click legend → corresponding area highlights, others dim

### Phase 3: Chronological Category Stacking
- [x] Compute category first-appearance order
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add useMemo to sort categories by first non-zero data point
  - **Validation**: Categories render bottom-to-top by first appearance date

- [x] Update Area rendering to use sorted categories
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Replace `[...categories].reverse()` with `sortedCategories`
  - **Validation**: Earlier skills at bottom, newer skills on top

### Phase 4: Milestone Marker Investigation
- [x] Research Recharts v3.6.0 capabilities for custom markers
  - **Actions**: Check docs, test Customized component, test ReferenceLine custom labels
  - **Outcome**: Document which approaches work/don't work

- [x] Evaluate alternative approaches (SVG overlay, Scatter, etc.)
  - **Actions**: Prototype each approach, measure alignment accuracy
  - **Outcome**: Select most reliable approach (SVG overlay selected)

### Phase 5: Milestone Marker Implementation

**Dependency**: Phase 4 complete with approach selected

- [x] Create MilestoneMarker SVG component
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Component**: Renders diamond shape with hover states
  - **Validation**: Component renders correctly in isolation

- [x] Integrate markers into chart (approach-dependent)
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Implementation**: SVG overlay approach with complex positioning logic
  - **Validation**: Markers appear on chart at milestone years

- [x] Verify marker positioning accuracy
  - **Actions**: Visual inspection, screenshot comparison
  - **Validation**: Markers align with year boundaries

- [x] Connect hover/click event handlers
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
- [x] Add smooth transitions to marker hover states
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Using framer-motion for smooth animations
  - **Validation**: Hover transitions are smooth

- [x] Ensure marker colors match theme
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: MILESTONE_COLOR constant (#06B6D4) used consistently
  - **Validation**: Colors match rest of timeline

- [x] Optimize chart bottom margin for marker visibility
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: CHART_MARGIN configured appropriately
  - **Validation**: Diamonds not cut off by chart bounds

### Phase 8: Accessibility & Testing
- [ ] Add keyboard navigation to markers
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Add tabindex, focus handlers, keyboard event listeners
  - **Validation**: Tab to markers, Enter/Space activates

- [ ] Update screen reader description
  - **File**: `src/components/visualizations/TimelineArea.tsx`
  - **Change**: Update sr-only text to mention integrated markers
  - **Validation**: Screen reader announces marker interactivity

- [x] Add/update tests for milestone interactions
  - **File**: `src/components/visualizations/TimelineArea.test.tsx`
  - **Tests**: 8 comprehensive milestone marker tests added
  - **Validation**: All tests pass

- [x] Run full test suite
  - **Command**: `npm test`
  - **Validation**: All 91 tests pass ✓

- [x] Manual testing across viewports
  - **Actions**: Tested responsive behavior
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
