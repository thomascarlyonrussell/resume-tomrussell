# Proposal: Refactor Skill-Experience Model

## Change ID
`refactor-skill-experience-model`

## Summary
Refactor the data model so that skill timelines and proficiency levels are derived from experiences rather than being properties of skills themselves. Skills become static reference data, while experiences define when and at what proficiency level each skill was used.

## Why

The current data model tightly couples skills with timeline and proficiency data, making it impossible to represent skill growth across different experiences. Skills can only have one proficiency level, but in reality, proficiency evolves through different roles. By deriving skill properties from experiences, we gain flexibility to track skill progression, maintain cleaner separation of concerns, and more accurately represent career development.

## What Changes

**Data Model:**
- Skill interface: Make `proficiency`, `startDate`, `endDate` optional (deprecated)
- Experience interface: Add `skills: ExperienceSkill[]` with proficiency levels
- New interfaces: `ExperienceSkill`, `ComputedSkillV2`, `SkillTimelinePoint`

**Computation:**
- New `skill-computation.ts` with 6 helper functions
- Weighted average proficiency: `(sum(prof × duration) / total_duration) × degradation`
- Derive timelines from experience date ranges

**Implementation:**
- Update all visualizations to use `ComputedSkillV2`
- Update chatbot knowledge to use computed skills
- Migrate 35 skills and 9 experiences with zero data loss

## Problem Statement

Currently, the data model has several architectural issues:

1. **Skills have their own timelines** - `startDate` and `endDate` are properties of skills, making it difficult to represent the same skill at different proficiency levels across different experiences.

2. **Single proficiency per skill** - A skill can only have one proficiency level, but in reality, proficiency grows and varies across different roles/experiences.

3. **Timeline ambiguity** - When a skill is used across multiple overlapping experiences, it's unclear which experience contributed to the skill timeline.

4. **Data redundancy** - Skill descriptions often reference specific experiences (e.g., "LoadSEER product development"), tightly coupling what should be separate concerns.

## Proposed Solution

Restructure the data model with clear separation of concerns:

### 1. Skills become reference data
Remove `proficiency`, `startDate`, and `endDate` from the `Skill` interface. Skills contain only:
- `id` - Unique identifier
- `name` - Display name
- `category` - Category classification
- `subcategory` - Subcategory grouping
- `description` - General description (not experience-specific)

### 2. Experiences define skill usage
Add a new `skills` property to `Experience` that maps skill IDs to proficiency levels:

```typescript
interface ExperienceSkill {
  skillId: string;
  proficiency: ProficiencyLevel; // 1, 2, 3, 5, 8
}

interface Experience {
  // ... existing properties
  skills: ExperienceSkill[]; // Replaces skillIds
}
```

### 3. Computed skill timelines and proficiency
Skill timelines are derived by:
1. Finding all experiences that reference a skill
2. Aggregating the experience date ranges
3. Computing the overall proficiency using a weighted average based on experience duration
4. Applying degradation factor for inactive skills (same as current model: 1.0 if current or <2 years inactive, 0.5 if 2-5 years, 0.25 if >5 years)

### 4. Benefits
- **Flexibility** - Same skill can have different proficiency across experiences
- **Clarity** - Experience dates drive skill timelines, making causality clear
- **Maintainability** - Skills are simple reference data, easier to manage
- **Accuracy** - Proficiency evolution is tracked through experiences
- **Visualization** - Can show skill growth over time across different roles

## Affected Capabilities

This change affects the following capability:
- **data-model** - Core data structures for skills and experience

## Implementation Approach

### Phase 1: Type System Changes
1. Update `Skill` interface to remove timeline/proficiency properties
2. Update `Experience` interface to add structured skill mapping
3. Add computed types for timeline aggregation

### Phase 2: Data Migration
1. Migrate `skills.ts` to remove timeline/proficiency data
2. Migrate `experience.ts` to add skill proficiency mappings
3. Validate data integrity

### Phase 3: Calculation Logic
1. Create utility functions to compute skill timelines from experiences
2. Update Fibonacci sizing calculations to use experience-derived data
3. Update timeline aggregation logic

### Phase 4: Visualization Updates
1. Update Fibonacci spiral to use computed skill data
2. Update timeline chart to use experience-based aggregation
3. Ensure tooltips and interactions work with new model

### Phase 5: Chatbot Knowledge
1. Update knowledge base generation to derive skill info from experiences
2. Ensure chatbot can answer questions about skill proficiency over time

## Migration Strategy

To migrate existing data:

1. For each skill, identify which experiences reference it
2. Infer proficiency level from experience context (may require manual review)
3. Create `ExperienceSkill` entries in each experience
4. Remove proficiency/dates from skills
5. Validate that computed timelines match original timelines

## Risks and Considerations

### Breaking Changes
- All code that accesses `skill.proficiency`, `skill.startDate`, or `skill.endDate` will break
- Visualization components heavily depend on these properties
- Calculation utilities assume skill-level timelines

### Data Complexity
- Experience data becomes more complex with structured skill mappings
- Need to handle edge cases (e.g., skill used in no experiences)

### Performance
- Computing timelines requires aggregating across experiences
- May need caching for performance-critical paths

### Mitigation
- Comprehensive type checking will catch all breaking changes
- Create helper functions to abstract timeline computation
- Add validation to ensure data integrity
- Phase implementation to minimize risk

## Success Criteria

1. Skills contain only static reference data
2. Experiences define skill usage with proficiency levels
3. Skill timelines are correctly computed from experiences
4. All visualizations work with the new model
5. Chatbot can answer questions about skill evolution
6. All existing data is migrated without information loss
7. Type system enforces the new structure
8. Unit tests cover all calculation logic

## Decisions

1. **Skills without specific work experience** (e.g., personal projects, self-study)
   - **Decision**: Create "Personal Development" or "Self-Study" experiences for these skills
   - **Rationale**: Maintains clean model architecture, provides proper context for skill acquisition

2. **Computing overall skill proficiency**
   - **Decision**: Use weighted average based on experience duration, with degradation for inactive skills
   - **Formula**: `proficiency = sum(experience_proficiency × experience_duration) / total_duration × degradation_factor`
   - **Degradation**: Same as current model (1.0 if current or <2 years inactive, 0.5 if 2-5 years, 0.25 if >5 years)
   - **Rationale**: Reflects both the depth (proficiency levels) and breadth (time invested) of skill usage, while accounting for skill decay when not in active use

3. **Proficiency evolution within a single experience**
   - **Decision**: One proficiency per skill per experience (simple model)
   - **Rationale**: Simpler to implement and maintain; experiences can be split if significant proficiency growth occurs within a role

## Implementation Status

**Status**: ✅ **COMPLETED**
**Completion Date**: January 19, 2026

### Results
- ✅ All 19 tasks completed across 6 phases
- ✅ 35 skills migrated to reference-only format
- ✅ 9 experiences updated with proficiency mappings
- ✅ 60/60 automated tests passing
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ Zero data loss - 100% data preservation

### Key Achievements
1. **Type System**: Created `ExperienceSkill`, `ComputedSkillV2`, `SkillTimelinePoint` interfaces
2. **Computation Logic**: Implemented 6 helper functions with weighted average proficiency and degradation
3. **Data Migration**: Successfully migrated all data with validation scripts
4. **Visualizations**: Updated Fibonacci spiral and timeline to use computed skills
5. **Chatbot**: Updated knowledge generation to derive from experiences
6. **Documentation**: Created comprehensive migration summary and updated all specs

### Files Created
- `src/lib/skill-computation.ts` - Core computation logic (6 functions)
- `src/lib/skill-computation.test.ts` - Comprehensive tests (21 tests)
- `scripts/validate-migration.ts` - Migration validation
- `MIGRATION_SUMMARY.md` - Complete implementation documentation

### Breaking Changes Mitigated
- Skill interface fields made optional (not removed) for backward compatibility
- Deprecated functions kept functional with appropriate warnings
- Legacy `ComputedSkill` interface retained alongside new `ComputedSkillV2`

See [MIGRATION_SUMMARY.md](../../../MIGRATION_SUMMARY.md) for complete implementation details.
