# Implementation Tasks

## Phase 1: Type Definitions & Data Model

- [x] Add `RigorLevel` type alias in `src/data/types.ts` (same values as ProficiencyLevel: 1, 2, 3, 5, 8)
- [x] Update `ExperienceSkill` interface: rename `proficiency` to `rigor` with type `RigorLevel`
- [x] Update `SkillTimelinePoint` interface: rename `proficiency` to `rigor`
- [x] Update `TimelineSkillInfo` interface: keep `proficiency` (computed output)
- [x] Add JSDoc comments clarifying rigor vs proficiency semantics
- [x] Keep `ProficiencyLevel` type for backwards compatibility (may deprecate later)

## Phase 2: Data Migration

- [x] Update all experience entries in `src/data/experience.ts`: `proficiency` → `rigor`
- [x] Verify no data loss - values should remain unchanged (1, 2, 3, 5, 8)
- [x] Run existing tests to verify data structure integrity

## Phase 3: Calculation Logic Updates

- [x] Update `src/lib/skill-computation.ts`:
  - [x] Rename parameter references from `proficiency` to `rigor` where referring to input
  - [x] Update `getSkillProficiency` function JSDoc to clarify rigor input vs proficiency output
  - [x] Update `calculateSkillProficiencyAtDate` to use `targetRigor` instead of `targetProficiency` internally
  - [x] Implement continuous decay during gaps (proficiency decays when skill not in use)
- [x] Update `src/lib/calculations.ts`:
  - [x] Add `getRigorLabel` function (or update existing to support both)
  - [x] Update comments to reflect rigor terminology
- [x] Update `src/lib/timeline-config.ts` if decay constants need adjustment

## Phase 4: Skill Computation Tests

- [x] Update `src/lib/skill-computation.test.ts`:
  - [x] Rename test data: `proficiency` → `rigor`
  - [x] Add tests for continuous decay during gaps
  - [x] Add tests for rigor-weighted proficiency calculation
- [x] Update `src/lib/calculations.test.ts`:
  - [x] Update test data to use `rigor` terminology
  - [x] Verify Fibonacci sizing still works correctly

## Phase 5: Timeline Visualization Updates

- [x] Update `src/components/visualizations/TimelineArea.tsx`:
  - [x] Change Y-axis to show cumulative proficiency (sum of skill proficiencies)
  - [x] Update data transformation to calculate proficiency sums
- [x] Update `src/components/visualizations/TimelineTooltip.tsx`:
  - [x] Show proficiency values in tooltip
  - [x] Update labels to reflect computed proficiency
- [x] Add drill-down capability:
  - [x] Category view: sum of skill proficiencies in category
  - [x] Skill view: individual skill proficiency over time

## Phase 6: Fibonacci Visualization Updates

- [x] Update `src/components/visualizations/FibonacciSpiral.tsx`:
  - [x] Verify proficiency binning to Fibonacci scale works correctly
  - [x] Update any labels/tooltips using "proficiency" terminology appropriately
- [x] Update `src/components/visualizations/SkillTooltip.tsx`:
  - [x] Display computed proficiency (not rigor)
  - [x] Clarify what the number represents
- [x] Update `src/components/visualizations/SkillDetailModal.tsx`:
  - [x] Show both rigor (from experiences) and computed proficiency
- [x] Update `src/components/visualizations/SkillNode.tsx`:
  - [x] Verify sizing uses computed proficiency correctly

## Phase 7: Component Updates

- [x] Update `src/components/sections/SkillsSection.tsx`:
  - [x] Verify skill data flows correctly with new terminology
- [x] Update `src/data/index.ts`:
  - [x] Verify exports work correctly
  - [x] Update any helper functions
- [x] Update `src/data/chatbot-knowledge.ts`:
  - [x] Clarify rigor vs proficiency in chatbot context

## Phase 8: Testing & Validation

- [x] Run all existing tests: `npm test`
- [x] Update `src/data/index.test.ts` for new terminology
- [x] Update `src/components/visualizations/FibonacciSpiral.test.tsx`
- [x] Manual testing:
  - [x] Verify timeline shows cumulative proficiency
  - [x] Verify Fibonacci spiral sizing is correct
  - [x] Verify tooltips display correct information
  - [x] Verify drill-down works in timeline

## Phase 9: Documentation & Cleanup

- [x] Update `openspec/specs/data-model/spec.md` with approved changes
- [x] Update `openspec/specs/visualizations/spec.md` with approved changes
- [x] Archive this change: `openspec archive rename-proficiency-to-rigor --yes`

## Dependencies

- Phase 2 depends on Phase 1 (types must be updated first)
- Phase 3 depends on Phase 2 (data must be migrated first)
- Phase 5-6 depend on Phase 3 (calculations must work first)
- Phase 8 can run partially in parallel with Phase 5-7

## Parallelizable Work

- Phase 1 tasks can run in parallel
- Phase 5 and Phase 6 can run in parallel (different visualization components)
- Tests can be written alongside implementation
