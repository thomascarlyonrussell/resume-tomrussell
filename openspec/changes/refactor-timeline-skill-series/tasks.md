# Implementation Tasks

Ordered list of implementation steps for the timeline refactoring.

---

## Phase 1: Configuration & Utilities (Foundation)

### ✅ Task 1.1: Create timeline configuration file
- **File**: Create `src/lib/timeline-config.ts`
- **Action**: Define configuration constants
  ```typescript
  export const TIMELINE_CONFIG = {
    DECAY_DURATION_MONTHS: 24,
    USE_LOGARITHMIC_PROGRESSION: false,
    USE_EXPONENTIAL_DECAY: false,
  } as const
  ```
- **Validation**: Import successfully in other files
- **Time**: 5 minutes

### ✅ Task 1.2: Add date utility functions
- **File**: Create or update `src/lib/date-utils.ts`
- **Action**: Add helper functions:
  - `monthsSince(startDate: string, endDate: string): number`
  - `experienceDurationMonths(experience: Experience): number`
- **Validation**: Unit tests pass
- **Time**: 15 minutes

### ✅ Task 1.3: Create skill proficiency calculation helper
- **File**: Update `src/lib/skill-computation.ts`
- **Action**: Add `calculateSkillProficiencyAtDate(skill, date): number`
  - Implements progression/decay logic for single skill
  - Returns cumulative proficiency from all experiences
- **Validation**: Unit tests with scenarios from spec
- **Time**: 30 minutes

---

## Phase 2: Data Layer (Core Logic)

### ✅ Task 2.1: Refactor generateTimelineData function
- **File**: Update `src/data/index.ts`
- **Action**: Replace skill counting logic with proficiency accumulation
  - Iterate through all skills
  - For each skill, call `calculateSkillProficiencyAtDate`
  - Aggregate proficiency by category
  - Return TimelineDataPoint[] with proficiency values
- **Validation**: Existing interface still works, values are now proficiency
- **Time**: 45 minutes

### ✅ Task 2.2: Add unit tests for generateTimelineData
- **File**: Update `src/data/index.test.ts`
- **Action**: Add test cases:
  - Single experience linear progression
  - Single experience linear decay
  - Multiple overlapping experiences aggregation
  - Sequential experiences (same skill)
  - Complete decay after 24 months
  - Category aggregation
- **Validation**: All tests pass
- **Time**: 45 minutes

### ✅ Task 2.3: Update getSkillsAtDate for proficiency
- **File**: Update `src/data/index.ts`
- **Action**: Modify `getSkillsAtDate()` to include proficiency values
  - Use `calculateSkillProficiencyAtDate` for each skill
  - Return skills with current proficiency at that date
- **Validation**: Returns proficiency values, not just skill presence
- **Time**: 15 minutes

---

## Phase 3: Visualization Layer (UI Updates)

### ✅ Task 3.1: Update TimelineArea Y-axis label
- **File**: Update `src/components/visualizations/TimelineArea.tsx`
- **Action**: Change Y-axis label from "Active Skills" to "Cumulative Proficiency"
- **Validation**: Visual inspection - label displays correctly
- **Time**: 5 minutes

### ✅ Task 3.2: Add legend explanation for proficiency
- **File**: Update `src/components/visualizations/TimelineArea.tsx`
- **Action**: Add explanatory text above or below chart:
  - "Proficiency increases during experiences and decreases after"
  - "Higher values indicate deeper expertise"
- **Validation**: Text is readable and positioned well
- **Time**: 15 minutes

### ✅ Task 3.3: Update category legend with proficiency totals
- **File**: Update `src/components/visualizations/TimelineArea.tsx`
- **Action**: Display current proficiency totals in category legend
  - Calculate current total proficiency per category
  - Show: "Category Name: X.X"
- **Validation**: Shows correct proficiency sums
- **Time**: 20 minutes

### ✅ Task 3.4: Update TimelineTooltip to show proficiency
- **File**: Update `src/components/visualizations/TimelineTooltip.tsx`
- **Action**: Modify tooltip to display:
  - Category proficiency totals
  - Individual skill proficiency values (not just names)
- **Validation**: Tooltip shows proficiency values correctly
- **Time**: 30 minutes

### ✅ Task 3.5: Verify curve smoothness
- **File**: Review `src/components/visualizations/TimelineArea.tsx`
- **Action**: Ensure Recharts `Area` component uses `type="monotone"`
  - Check that curves are smooth (already implemented)
  - Visually verify no sharp corners
- **Validation**: Curves are smooth in browser
- **Time**: 5 minutes

### ✅ Task 3.6: Add accessibility improvements
- **File**: Update `src/components/visualizations/TimelineArea.tsx`
- **Action**: Update screen-reader text:
  - Explain proficiency metric in sr-only div
  - Add ARIA labels with proficiency context
- **Validation**: Screen reader reads proficiency information
- **Time**: 15 minutes

---

## Phase 4: Testing & Quality Assurance

### ✅ Task 4.1: Update existing timeline tests
- **Files**: `tests/features/timeline*.feature` and step definitions
- **Action**: Update test assertions:
  - Expect proficiency values instead of counts
  - Update expected Y-axis labels
  - Verify smooth curves
- **Validation**: All Playwright tests pass
- **Time**: 30 minutes

### ✅ Task 4.2: Add integration tests for timeline component
- **File**: Create or update `src/components/visualizations/TimelineArea.test.tsx`
- **Action**: Add tests:
  - Renders with proficiency data
  - Tooltip shows proficiency values
  - Category filtering updates proficiency
  - Legend displays proficiency totals
- **Validation**: Vitest tests pass
- **Time**: 30 minutes

### ✅ Task 4.3: Visual regression testing
- **Action**: Take before/after screenshots
  - Compare curve smoothness
  - Verify no discrete steps at experience boundaries
  - Check Y-axis scaling is appropriate
- **Validation**: Manual review of screenshots
- **Time**: 15 minutes

### ✅ Task 4.4: Performance profiling
- **Action**: Profile `generateTimelineData` with production data
  - Measure execution time
  - Ensure <10ms for typical data size
- **Validation**: No performance degradation
- **Time**: 10 minutes

---

## Phase 5: Documentation & Validation

### ✅ Task 5.1: Update README or docs
- **File**: Update `README.md` or create `docs/timeline.md`
- **Action**: Document new timeline behavior:
  - Proficiency-based calculation
  - Linear progression/decay
  - Configuration options
- **Validation**: Documentation is clear and accurate
- **Time**: 20 minutes

### ✅ Task 5.2: Run OpenSpec validation
- **Command**: `npx openspec validate refactor-timeline-skill-series --strict --no-interactive`
- **Action**: Fix any validation errors
- **Validation**: Validation passes with no errors
- **Time**: 10 minutes

### ✅ Task 5.3: Final manual QA
- **Action**: Test in development environment:
  - Load timeline view
  - Verify smooth curves
  - Hover tooltips work
  - Category filtering works
  - Mobile responsiveness
  - Dark mode
- **Validation**: All functionality works as expected
- **Time**: 15 minutes

---

## Dependencies & Parallelization

### Can be done in parallel:
- **Phase 1** (Tasks 1.1-1.3): All independent
- **Phase 3** (Tasks 3.1-3.6): After Phase 2 complete, all can be parallel
- **Phase 4** (Tasks 4.1-4.3): After Phase 3, can be parallel

### Must be sequential:
- Phase 1 → Phase 2 (need utilities)
- Phase 2 → Phase 3 (need data layer)
- Phase 3 → Phase 4 (need UI for testing)
- Phase 4 → Phase 5 (need implementation complete)

---

## Estimated Total Time

- Phase 1: 50 minutes
- Phase 2: 1 hour 45 minutes
- Phase 3: 1 hour 30 minutes
- Phase 4: 1 hour 25 minutes
- Phase 5: 45 minutes

**Total: ~6 hours** (single developer, sequential)
**Parallelized: ~4 hours** (with proper task distribution)

---

## Rollback Plan

If issues arise after implementation:

1. **Data layer issue**: Revert `src/data/index.ts` and `src/lib/skill-computation.ts`
2. **UI issue**: Revert `TimelineArea.tsx` and `TimelineTooltip.tsx`
3. **Complete rollback**: Revert entire branch using git

**Rollback validation**: Run test suite after revert to ensure stability.
