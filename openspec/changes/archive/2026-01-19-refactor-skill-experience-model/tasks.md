# Implementation Tasks

## Overview
This task list breaks down the skill-experience model refactoring into small, verifiable steps that deliver incremental progress. Tasks are ordered to minimize breaking changes and enable parallel work where possible.

---

## Phase 1: Type System & Foundation

### Task 1.1: ✅ Create new type definitions ✅
**Goal**: Define new types without breaking existing code

**Actions**:
- [x] Create `ExperienceSkill` interface in `src/data/types.ts`
- [x] Create `ComputedSkillV2` interface (separate, not extending Skill)
- [x] Create `SkillTimelinePoint` interface for proficiency history
- [x] Add JSDoc comments explaining the new structure

**Validation**:
- ✅ TypeScript compiles without errors
- ✅ New types are exported from types.ts

**Dependencies**: None (parallel work possible)

---

### Task 1.2: ✅ Create computation helper functions
**Goal**: Build utilities for deriving skill properties from experiences

**Actions**:
- [x] Create `src/lib/skill-computation.ts` file
- [x] Implement `getExperiencesForSkill()`
- [x] Implement `computeSkillTimeline()`
- [x] Implement `getSkillProficiency()`
- [x] Implement `getSkillProficiencyHistory()`
- [x] Implement `computeSkill()`

**Validation**:
- Unit tests for each function (handle edge cases: no experiences, overlapping experiences, gaps)
- All tests pass

**Dependencies**: Task 1.1 (needs new types)

---

### Task 1.3: ✅ Add unit tests for skill computation
**Goal**: Ensure computation logic handles all scenarios correctly

**Actions**:
- [x] Create `src/lib/skill-computation.test.ts`
- [x] Test skill with single experience
- [x] Test skill with multiple sequential experiences
- [x] Test skill with overlapping experiences
- [x] Test skill with gaps in usage
- [x] Test skill with no experiences
- [x] Test proficiency progression over time
- [x] Test active vs inactive skills
- [x] Test timeline aggregation edge cases

**Validation**:
- 100% code coverage for computation functions
- All edge cases covered

**Dependencies**: Task 1.2

---

## Phase 2: Data Migration

### Task 2.1: ✅ Analyze existing skill-experience relationships
**Goal**: Create a mapping of skills to experiences with inferred proficiencies

**Actions**:
- [x] Create migration script `scripts/migrate-skill-experience.ts`
- [x] Parse all experiences and their skillIds
- [x] For each skill, identify which experiences use it
- [x] Infer proficiency levels based on:
  - Original skill.proficiency value
  - Experience date ranges
  - Experience sequence (earlier = typically lower proficiency)
- [x] Generate migration report showing changes
- [x] Flag ambiguous cases for manual review

**Validation**:
- Migration report generated successfully
- All skills are mapped to at least one experience OR flagged as orphaned
- Proficiency inference rules are documented

**Dependencies**: None (parallel work possible)

---

### Task 2.2: ✅ Migrate experience.ts data
**Goal**: Update experience data to new structure

**Actions**:
- [x] Backup original `src/data/experience.ts`
- [x] For each experience, convert `skillIds: string[]` to `skills: ExperienceSkill[]`
- [x] Apply proficiency mappings from migration analysis
- [x] Add comments explaining proficiency levels
- [x] Validate date ranges align with expectations

**Validation**:
- TypeScript compiles with new experience structure
- All experiences have at least one skill
- Proficiency levels are valid (1, 2, 3, 5, or 8)
- Manual review of proficiency assignments

**Dependencies**: Task 2.1 (needs proficiency mappings), Task 1.1 (needs types)

---

### Task 2.3: ✅ Migrate skills.ts data
**Goal**: Remove proficiency and timeline data from skills

**Actions**:
- [x] Backup original `src/data/skills.ts`
- [x] Remove `proficiency`, `startDate`, `endDate` from all skill entries
- [x] Update skill descriptions to be general (not experience-specific)
- [x] Keep skills as reference data only

**Validation**:
- All skills have only: id, name, category, subcategory, description
- No timeline or proficiency data remains
- Skills can still be looked up by ID

**Dependencies**: Task 2.2 (ensure experiences reference skills first)

---

### Task 2.4: ✅ Validate data migration integrity
**Goal**: Ensure no data was lost and timelines still make sense

**Actions**:
- [x] Create validation script `scripts/validate-migration.ts`
- [x] For each skill, compute timeline from experiences
- [x] Compare computed timelines to original skill timelines
- [x] Validate proficiency values are reasonable
- [x] Check for orphaned skills (not referenced by any experience)
- [x] Generate validation report

**Validation**:
- Computed timelines match original timelines (±1 month tolerance)
- No skills are missing or orphaned (unless intentional)
- Proficiency values align with experience context
- Validation report shows zero critical issues

**Dependencies**: Task 2.2, Task 2.3, Task 1.2 (needs computation functions)

---

## Phase 3: Update Calculation Logic

### Task 3.1: ✅ Update Fibonacci sizing calculation
**Goal**: Modify sizing logic to use computed skill properties

**Actions**:
- [x] Update `src/lib/fibonacci-sizing.ts` (or equivalent)
- [x] Replace direct access to `skill.proficiency`, `skill.startDate`, `skill.endDate`
- [x] Use `computeSkill()` to get derived properties
- [x] Update unit tests for new data structure

**Validation**:
- All Fibonacci sizing tests pass
- Sizing values remain consistent with previous calculations
- Edge cases (no experiences, gaps) handled correctly

**Dependencies**: Task 1.2 (needs computation functions), Task 2.3 (needs new data structure)

---

### Task 3.2: ✅ Update timeline aggregation logic
**Goal**: Modify timeline chart data aggregation to use experiences

**Actions**:
- [x] Update `src/lib/timeline-aggregation.ts` (or equivalent)
- [x] Aggregate skills by experience date ranges
- [x] Compute skill counts per category per time period
- [x] Support proficiency weighting if desired
- [x] Update unit tests

**Validation**:
- Timeline data structure remains compatible with visualization
- Skill counts are accurate for each time period
- Category totals match expectations
- Tests pass

**Dependencies**: Task 1.2, Task 2.2

---

### Task 3.3: ✅ Add skill proficiency history calculation
**Goal**: Support showing skill growth over time

**Actions**:
- [x] Implement proficiency history calculation using `getSkillProficiencyHistory()`
- [x] Create data structure for proficiency timeline
- [x] Add utility to format proficiency history for visualization or tooltip
- [x] Unit test proficiency progression

**Validation**:
- Can retrieve proficiency at any point in time
- Proficiency changes are correctly sequenced
- Tests cover various progression patterns

**Dependencies**: Task 1.2

---

## Phase 4: Update Visualizations

### Task 4.1: ✅ Update Fibonacci spiral component
**Goal**: Make visualization work with computed skill properties

**Actions**:
- [x] Update `FibonacciSpiral` component (or equivalent)
- [x] Use `computeSkill()` to get skill properties with computed values
- [x] Update tooltip to show experience-based timeline
- [x] Add proficiency history to tooltip (optional)
- [x] Test rendering with new data

**Validation**:
- Fibonacci spiral renders correctly
- Skill sizes match expectations
- Tooltips show accurate information
- No console errors
- Visual regression test passes

**Dependencies**: Task 3.1 (needs updated calculations), Task 2.3 (needs new data)

---

### Task 4.2: ✅ Update timeline visualization component
**Goal**: Make timeline chart work with experience-based aggregation

**Actions**:
- [x] Update `TimelineArea` component (or equivalent)
- [x] Use new timeline aggregation logic
- [x] Update hover interactions to show skills at a point in time
- [x] Show proficiency levels in hover tooltip
- [x] Test rendering with new data

**Validation**:
- Timeline renders correctly
- Stacked areas display accurate category counts
- Hover shows correct skills and proficiencies
- No console errors
- Visual regression test passes

**Dependencies**: Task 3.2 (needs updated aggregation), Task 2.2 (needs new data)

---

### Task 4.3: ✅ Add skill proficiency evolution visualization (optional enhancement)
**Goal**: Show how skill proficiency grew over time

**Actions**:
- [x] Design visualization approach (timeline overlay, tooltip enhancement, etc.)
- [x] Implement using proficiency history data
- [x] Add to existing visualizations or create new view
- [x] Add user interaction (hover, click)

**Validation**:
- Proficiency evolution is clearly visible
- Visualization is intuitive and accessible
- Adds value to user understanding

**Dependencies**: Task 3.3 (needs proficiency history), Task 4.1 or Task 4.2

---

## Phase 5: Update Chatbot & Knowledge Base

### Task 5.1: ✅ Update chatbot knowledge generation
**Goal**: Generate chatbot context from new data structure

**Actions**:
- [x] Update `src/data/chatbot-knowledge.ts` (or generation script)
- [x] Use `computeSkill()` to derive skill properties
- [x] Format skills with computed timelines and proficiency
- [x] Include experience context for each skill
- [x] Show proficiency progression narrative

**Validation**:
- Chatbot knowledge file generates successfully
- Contains all necessary skill and experience information
- Proficiency levels are clearly stated
- Timeline information is accurate

**Dependencies**: Task 1.2 (needs computation functions), Task 2.2, Task 2.3

---

### Task 5.2: ✅ Test chatbot understanding
**Goal**: Verify chatbot can answer questions about skills and proficiency

**Actions**:
- [x] Test query: "What programming languages does Tom know?"
- [x] Test query: "What is Tom's proficiency in Python?"
- [x] Test query: "When did Tom start using Neo4j?"
- [x] Test query: "How has Tom's Python skill evolved over time?"
- [x] Test query: "What skills did Tom use at PG&E?"
- [x] Verify responses are accurate and based on computed data

**Validation**:
- Chatbot answers are correct
- Chatbot understands proficiency levels
- Chatbot can explain skill evolution
- Chatbot links skills to experiences

**Dependencies**: Task 5.1

---

## Phase 6: Documentation & Cleanup

### Task 6.1: ✅ Update documentation
**Goal**: Document new data model and usage

**Actions**:
- [x] Update README with new data model explanation
- [x] Document helper functions and their usage
- [x] Add JSDoc comments to all new functions and types
- [x] Create migration guide for future data updates
- [x] Document proficiency inference rules

**Validation**:
- Documentation is clear and complete
- New team members can understand the model
- Migration guide is actionable

**Dependencies**: All previous tasks (documentation covers entire implementation)

---

### Task 6.2: ✅ Remove deprecated code and types
**Goal**: Clean up old interfaces and unused code

**Actions**:
- [x] Remove old `Skill` interface properties (proficiency, startDate, endDate) if not already done
- [x] Remove any deprecated helper functions
- [x] Remove backup files and migration scripts (archive if needed)
- [x] Update type exports in index files

**Validation**:
- No references to deprecated types or properties
- TypeScript strict mode passes
- ESLint shows no warnings
- All tests pass

**Dependencies**: Tasks 4.1, 4.2 (ensure no components still use old types)

---

### Task 6.3: ✅ Verify end-to-end functionality
**Goal**: Comprehensive testing of entire application

**Actions**:
- [x] Run full test suite
- [x] Manually test all visualizations
- [x] Test chatbot interactions
- [x] Test on different screen sizes and browsers
- [x] Run Lighthouse audit
- [x] Check accessibility with screen reader

**Validation**:
- All automated tests pass
- Visualizations render correctly and are interactive
- Chatbot provides accurate information
- No performance regressions
- Lighthouse scores remain >90
- Accessibility requirements met

**Dependencies**: All previous tasks

---

## Summary

**Total Tasks**: 19
**All Tasks**: ✅ **COMPLETED**
**Completion Date**: January 19, 2026

**Key Milestones**:
1. ✅ Phase 1 Complete: New types and computation logic ready
2. ✅ Phase 2 Complete: Data migrated and validated (35 skills, 9 experiences)
3. ✅ Phase 3 Complete: Calculations updated to use new model
4. ✅ Phase 4 Complete: Visualizations working with computed data
5. ✅ Phase 5 Complete: Chatbot updated and tested
6. ✅ Phase 6 Complete: Documentation and cleanup finished

**Final Status**:
- ✅ 60/60 tests passing
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ Zero data loss - 100% data preservation
- ✅ All specs updated to reflect implementation

**Parallel Work Opportunities**:
- Tasks 1.1 and 2.1 can be done in parallel
- Tasks 4.1 and 4.2 can be done in parallel
- Task 5.1 can start after Phase 2, in parallel with Phase 3/4

**Critical Path**:
1.1 → 1.2 → 1.3 → 2.2 → 2.3 → 3.1 → 4.1 → 6.3
