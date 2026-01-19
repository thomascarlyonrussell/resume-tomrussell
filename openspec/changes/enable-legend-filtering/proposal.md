# Proposal: Enable Legend Filtering

## Change ID
`enable-legend-filtering`

## Overview

Add interactive category filtering to the Fibonacci spiral visualization through clickable legend items. Users can click a category in the legend to filter the spiral to show only skills in that category, providing focused exploration of specific skill domains.

## Problem Statement

The current Fibonacci spiral visualization displays all skills simultaneously, which can be overwhelming when users want to focus on a specific category (e.g., "Software Development" or "AI & Automation"). The legend currently serves only as a passive reference for understanding category colors, missing an opportunity for interactive exploration.

## Proposed Solution

Transform the legend into an interactive filter control that allows users to:
1. Click a category to filter the spiral to show only that category's skills
2. Click the same category again to clear the filter and show all skills
3. See clear visual feedback indicating which category is selected

### User Experience Flow

**Default State**: All skills visible, no filter applied

**Filtering Flow**:
1. User clicks "Software Development" in legend
2. Spiral animates to show only Software Development skills
3. Legend highlights "Software Development" and dims other categories
4. User clicks "Software Development" again to clear filter
5. Spiral animates to show all skills again

### Design Decisions

#### 1. Single-Select (Exclusive) Filtering
- **Decision**: Only one category can be filtered at a time
- **Rationale**:
  - Simpler interaction model for users
  - Clearer visual feedback (one category highlighted)
  - Reduces complexity in first iteration
  - Aligns with "focus on one domain" use case
- **Alternative Considered**: Multi-select (toggle multiple categories)
  - Rejected for v1 due to increased complexity
  - Can be added in future enhancement if user feedback requests it

#### 2. State Management in Parent Component
- **Decision**: Filter state lives in `SkillsSection` component
- **Rationale**:
  - Consistent with existing pattern (`selectedSkill` for modal)
  - Enables future cross-view filtering (Timeline + Fibonacci)
  - Single source of truth for visualization state
- **Implementation**: `selectedCategoryFilter: CategoryId | null`

#### 3. Data-Layer Filtering
- **Decision**: Filter skills before layout calculation
- **Rationale**:
  - Better performance (fewer nodes to position)
  - Cleaner separation of concerns
  - Accurate skill counts for accessibility announcements
- **Implementation**: `useMemo` to filter skills, then pass to layout hook

#### 4. Animation Strategy
- **Decision**: Fade out + scale down for exiting skills, spring animation for layout
- **Rationale**:
  - Smooth transition maintains visual continuity
  - Users can track which skills are being removed
  - Framer Motion's `AnimatePresence` handles this elegantly
- **Accessibility**: Respects `prefers-reduced-motion` (instant opacity change)

#### 5. Keyboard Interaction Model
- **Decision**: Arrow keys to navigate, Space/Enter to toggle, Escape to clear
- **Rationale**:
  - Standard keyboard navigation pattern
  - Consistent with WCAG 2.1 guidelines
  - Mirrors existing SkillNode keyboard support
- **ARIA Pattern**: `role="radiogroup"` with `role="radio"` buttons

## Impact Analysis

### Files Modified
1. `src/components/sections/SkillsSection.tsx` - Add state management
2. `src/components/visualizations/FibonacciSpiral.tsx` - Add filtering logic
3. `src/components/visualizations/Legend.tsx` - Make interactive
4. `src/data/index.ts` - Add helper function for counts

### New Requirements
- Legend items SHALL be interactive (clickable/tappable)
- Legend SHALL provide visual feedback for selected category
- Spiral SHALL filter skills based on selected category
- Filtering SHALL animate smoothly with exit/enter transitions
- Keyboard navigation SHALL support arrow keys and Escape
- Screen reader SHALL announce filter state changes

### Modified Requirements
- **Fibonacci Legend** requirement expands from passive to interactive
- **Fibonacci Interactivity** requirement adds filtering behavior

### Performance Impact
- **Positive**: Fewer nodes to render when filtered (improved performance)
- **Negligible**: Filter computation is O(n) with memoization
- **Animation**: 200ms exit animation, spring physics for layout

### Accessibility Impact
- **Enhanced**: Keyboard navigation adds new interaction pathway
- **Enhanced**: Screen reader announcements for filter changes
- **Maintained**: All existing accessibility features preserved
- **Risk**: None - respects `prefers-reduced-motion` and ARIA best practices

### User Impact
- **Positive**: Focused exploration of skill categories
- **Positive**: Reduces visual clutter for specific domains
- **Risk**: Minimal - filtering is optional, default shows all
- **Migration**: None - purely additive feature

## Technical Approach

### State Flow
```
SkillsSection (state owner)
  ↓ selectedCategoryFilter: CategoryId | null
  ↓ onCategoryToggle: (CategoryId) => void
FibonacciSpiral (filter implementer)
  ↓ filters skills using useMemo
  ↓ passes filtered skills to layout
  ↓ passes props to Legend
Legend (UI trigger)
  ↓ renders interactive category buttons
  ↓ calls onCategoryToggle on click
```

### Key Implementation Details

**Filtering Logic**:
```typescript
const filteredSkills = useMemo(() =>
  selectedCategoryFilter
    ? skills.filter(skill => skill.category === selectedCategoryFilter)
    : skills,
  [skills, selectedCategoryFilter]
);
```

**Animation**:
- Wrap skill nodes in `AnimatePresence` with `mode="popLayout"`
- Add `layoutId` to enable layout animations
- Exit variant: `{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }`

**Accessibility**:
- `role="radiogroup"` for legend filter group
- `role="radio"` and `aria-checked` for category buttons
- Live region announces: "Filtered to Engineering, showing 8 skills"
- Keyboard: Arrow keys (navigate), Space/Enter (toggle), Escape (clear)

## Success Criteria

### Functional Requirements
- [ ] Clicking a category filters spiral to that category only
- [ ] Clicking same category again clears filter
- [ ] Smooth animation between filter states
- [ ] Skill counts displayed in legend

### Accessibility Requirements
- [ ] Keyboard navigation works (Tab, Arrow keys, Space, Enter, Escape)
- [ ] Screen reader announces filter changes
- [ ] Focus indicators visible
- [ ] Respects `prefers-reduced-motion`

### Visual Requirements
- [ ] Selected category clearly highlighted
- [ ] Inactive categories visually dimmed
- [ ] Hover states provide feedback
- [ ] Dark mode styling correct

### Performance Requirements
- [ ] Filtering completes in <50ms
- [ ] Animations run at 60fps
- [ ] No layout thrashing during transitions

## Future Enhancements (Out of Scope)

1. **Multi-select filtering**: Toggle multiple categories simultaneously
2. **URL state persistence**: Filter state in query params for sharing
3. **Search + filter combination**: Text search combined with category filter
4. **Subcategory drilling**: Click category → see subcategories → filter further
5. **Timeline sync**: Apply same filter to Timeline visualization
6. **Filter presets**: "Show only active skills", "Engineering focus", etc.

## Open Questions

None - all design decisions finalized based on user preference for single-select exclusive filtering.

## References

- Existing Spec: `openspec/specs/visualizations/spec.md`
- Modified Requirement: "Fibonacci Legend" (line 115)
- Related Requirements: "Fibonacci Interactivity" (line 67), "Visualization Accessibility" (line 240)
- Implementation Plan: `C:\Users\TomRussell\.claude\plans\transient-singing-moon.md`
