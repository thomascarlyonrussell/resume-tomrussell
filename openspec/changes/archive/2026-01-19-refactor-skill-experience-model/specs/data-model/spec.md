# Data Model Spec Delta

## MODIFIED Requirements

### Requirement: Skill Item Structure

Each skill item SHALL contain only static reference properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (kebab-case) |
| `name` | string | Yes | Display name |
| `category` | string | Yes | Primary category |
| `subcategory` | string | Yes | Secondary grouping |
| `description` | string | No | General description (not experience-specific) |

**REMOVED**: `proficiency`, `startDate`, `endDate`, `milestones` properties

Skills now serve as reference data only. Timeline and proficiency information is derived from experiences that reference them.

#### Scenario: Complete skill entry
- **GIVEN** a skill "Python"
- **WHEN** it is added to the data
- **THEN** it includes only id, name, category, subcategory, and optional description
- **AND** it does NOT include proficiency, startDate, or endDate

#### Scenario: Skill timeline derivation
- **GIVEN** a skill "Python" referenced by multiple experiences
- **WHEN** computing the skill's timeline
- **THEN** the timeline is derived from the date ranges of all experiences that reference it

#### Scenario: Skill proficiency derivation
- **GIVEN** a skill "Python" referenced by multiple experiences with different proficiencies
- **WHEN** determining the skill's current proficiency
- **THEN** the proficiency is a weighted average across all experiences, weighted by duration
- **AND** a degradation factor is applied based on time since last use

---

### Requirement: Experience Role Structure

Work experience SHALL define which skills were used and at what proficiency level.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `company` | string | Yes | Company/organization name |
| `title` | string | Yes | Job title |
| `startDate` | string | Yes | Start date (YYYY-MM format) |
| `endDate` | string | No | End date (null if current) |
| `description` | string | Yes | Role description |
| `highlights` | string[] | No | Key achievements |
| `skills` | ExperienceSkill[] | Yes | Skills used in this role with proficiency levels |

**MODIFIED**: Changed from `skillIds: string[]` to `skills: ExperienceSkill[]`

#### Scenario: Experience with skill proficiencies
- **GIVEN** an experience "Product Manager, VP at Integral Analytics"
- **WHEN** defining skills used in this role
- **THEN** each skill includes both the skill ID and the proficiency level achieved
- **AND** the proficiency reflects the level attained during that specific role

#### Scenario: Overlapping skill proficiencies
- **GIVEN** two experiences that both used "Python"
- **WHEN** the first experience had proficiency 3 and the second had proficiency 5
- **THEN** the timeline shows skill growth from proficiency 3 to 5
- **AND** the current proficiency is 5 (most recent)

#### Scenario: Current role with active skills
- **GIVEN** Tom's current position with endDate null
- **WHEN** computing active skills
- **THEN** all skills in that experience are considered active
- **AND** their timelines extend to the present

---

## ADDED Requirements

### Requirement: Experience Skill Structure

Each skill reference within an experience SHALL specify the proficiency level.

```typescript
interface ExperienceSkill {
  skillId: string;          // Reference to skill ID
  proficiency: ProficiencyLevel; // 1, 2, 3, 5, or 8
}
```

#### Scenario: Skill with proficiency in experience
- **GIVEN** an experience that used "Neo4j"
- **WHEN** adding "Neo4j" to the experience skills
- **THEN** the entry includes skillId "neo4j" and proficiency 5
- **AND** the proficiency reflects the level achieved during that role

---

### Requirement: Computed Skill Properties

The data model SHALL support computed/derived skill properties:

- `startDate` - Earliest startDate of experiences that reference the skill
- `endDate` - Latest endDate of experiences that reference the skill (null if any experience is current)
- `isActive` - Boolean based on any referencing experience having null endDate
- `proficiency` - Weighted average proficiency based on experience duration, with degradation for inactive skills
- `experiences` - List of experiences that used this skill
- `timeline` - Array of proficiency changes over time

The proficiency calculation SHALL be:
```
proficiency = (sum(experience_proficiency × experience_duration) / total_duration) × degradation_factor
```

Where:
- `experience_proficiency` = Proficiency level for that skill in each experience
- `experience_duration` = Duration in months for each experience
- `total_duration` = Sum of all experience durations (in months)
- `degradation_factor` = 1.0 if currently active OR <2 years since last use, 0.5 if 2-5 years since last use, 0.25 if >5 years since last use

#### Scenario: Skill timeline computation
- **GIVEN** a skill "Python" used in 3 experiences spanning 2015-2025
- **WHEN** computing the skill's timeline
- **THEN** startDate is 2015-01
- **AND** endDate is null (current)
- **AND** isActive is true

#### Scenario: Skill proficiency computation with weighted average
- **GIVEN** a skill "SQL" used in experience A (2014-2018, 48 months, proficiency 3) and experience B (2018-present, 84 months, proficiency 5)
- **WHEN** computing current proficiency
- **THEN** proficiency = ((3 × 48) + (5 × 84)) / (48 + 84) × 1.0 = (144 + 420) / 132 × 1.0 = 4.27
- **AND** degradation_factor is 1.0 (currently active)

#### Scenario: Skill proficiency with inactive degradation
- **GIVEN** a skill "Cymdist" used in experience A (2014-2020, 72 months, proficiency 5)
- **AND** not used since 2020 (>5 years ago as of 2025)
- **WHEN** computing current proficiency
- **THEN** base_proficiency = 5
- **AND** degradation_factor is 0.25 (>5 years inactive)
- **AND** effective_proficiency = 5 × 0.25 = 1.25

#### Scenario: Skill proficiency growth over three experiences
- **GIVEN** a skill "Python" used in:
  - Experience A: 2015-2017, 24 months, proficiency 3
  - Experience B: 2017-2020, 36 months, proficiency 5
  - Experience C: 2020-present, 60 months, proficiency 8
- **WHEN** computing current proficiency
- **THEN** weighted_proficiency = ((3 × 24) + (5 × 36) + (8 × 60)) / (24 + 36 + 60)
- **AND** weighted_proficiency = (72 + 180 + 480) / 120 = 732 / 120 = 6.1
- **AND** degradation_factor is 1.0 (currently active)
- **AND** effective_proficiency = 6.1 × 1.0 = 6.1
- **AND** this reflects skill growth from beginner (3) to expert (8) over 10 years

#### Scenario: Skill with no experiences
- **GIVEN** a skill that is defined but not referenced by any experience
- **WHEN** computing timeline properties
- **THEN** startDate and endDate are undefined
- **AND** isActive is false
- **AND** proficiency is undefined

---

### Requirement: Fibonacci Sizing with Derived Data

For the Fibonacci visualization, skills SHALL be sized based on computed properties derived from experiences.

The sizing algorithm SHALL calculate display size as:
```
size = proficiency × weighted_years
```

Where:
- `proficiency` = Weighted average proficiency from experiences (already includes degradation_factor)
- `weighted_years` = `(years_of_experience) × (proficiency / 8)`
- `years_of_experience` = Time from earliest experience startDate to latest experience endDate (or present)

Note: The `proficiency` value already incorporates the degradation factor as defined in the "Computed Skill Properties" requirement, so no additional degradation is applied at this stage.

#### Scenario: Skill sizing with multiple experiences
- **GIVEN** a skill "Python" with:
  - Experience A: 2015-2019, 48 months, proficiency 5
  - Experience B: 2019-present, 72 months, proficiency 8
- **WHEN** computing Fibonacci size
- **THEN** base_proficiency = ((5 × 48) + (8 × 72)) / (48 + 72) = (240 + 576) / 120 = 6.8
- **AND** degradation_factor is 1.0 (currently active)
- **AND** proficiency = 6.8 × 1.0 = 6.8
- **AND** years_of_experience is ~10 (2015 to present)
- **AND** weighted_years = 10 × (6.8 / 8) = 8.5
- **AND** calculated size = 6.8 × 8.5 = 57.8, mapped to Fibonacci 55

#### Scenario: Skill sizing with gap in usage
- **GIVEN** a skill "Microsoft Access" with:
  - Experience A: 2012-2015, 36 months, proficiency 3
  - No subsequent usage, ended 2015 (10 years ago as of 2025)
- **WHEN** computing Fibonacci size in 2025
- **THEN** base_proficiency = 3
- **AND** degradation_factor is 0.25 (>5 years inactive)
- **AND** proficiency = 3 × 0.25 = 0.75
- **AND** years_of_experience is ~3
- **AND** weighted_years = 3 × (0.75 / 8) = 0.28
- **AND** calculated size = 0.75 × 0.28 = 0.21, mapped to Fibonacci 1
- **AND** calculated size is significantly reduced

---

### Requirement: Timeline Aggregation with Experience-Based Data

For the Timeline visualization, data SHALL aggregate skills by category over time using experience date ranges.

The aggregation SHALL:
- For each time point, count skills active in experiences during that period
- Weight by proficiency level if desired
- Group by category for stacked display
- Support hover to show specific skills and their experiences at a point in time

#### Scenario: Category growth over time
- **GIVEN** multiple experiences adding "software-development" skills over time
- **WHEN** viewed on timeline from 2015-2025
- **THEN** the area shows growth as new skills were added through new experiences
- **AND** skills remain active as long as any experience is active

#### Scenario: Skill proficiency evolution
- **GIVEN** a skill "Python" growing from proficiency 3 to 8 across experiences
- **WHEN** hovering over timeline at different points
- **THEN** the tooltip shows the proficiency level at that time based on the active experience

---

## Type Definitions (TypeScript)

```typescript
// Updated Skill interface - reference data only (with optional deprecated fields for backward compatibility)
interface Skill {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  description?: string;
  // Deprecated fields (kept optional for backward compatibility)
  /** @deprecated Use ExperienceSkill.proficiency in Experience.skills instead */
  proficiency?: ProficiencyLevel;
  /** @deprecated Computed from experiences via computeSkillTimeline() */
  startDate?: string;
  /** @deprecated Computed from experiences via computeSkillTimeline() */
  endDate?: string | null;
}

// New ExperienceSkill interface
interface ExperienceSkill {
  skillId: string;
  proficiency: ProficiencyLevel; // 1, 2, 3, 5, or 8
}

// Updated Experience interface
interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;   // YYYY-MM
  endDate?: string;    // YYYY-MM or undefined if current
  description: string;
  highlights?: string[];
  /** @deprecated Use skills instead */
  skillIds?: string[];
  skills?: ExperienceSkill[]; // New model
}

// New ComputedSkillV2 interface for derived properties
// Does NOT extend Skill - completely separate interface
interface ComputedSkillV2 {
  // Reference data from Skill
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  description?: string;

  // Computed from experiences
  startDate?: string;        // Earliest experience start
  endDate?: string;          // Latest experience end (undefined if active)
  isActive: boolean;         // Any experience has null endDate
  proficiency?: number;      // Weighted average with degradation (continuous value, not discrete)
  yearsOfExperience: number; // Total time from first to last experience
  experiences: Experience[]; // All experiences that used this skill
  fibonacciSize: number;     // Computed for visualization sizing
  degradationFactor: number; // Time-based decay (1.0, 0.5, or 0.25)
}

// Timeline point with skill proficiency history
interface SkillTimelinePoint {
  date: string;            // YYYY-MM
  experienceId: string;
  proficiency: ProficiencyLevel;
}
```

---

## Data Migration Requirements

### Requirement: Data Migration Integrity

When migrating from the old model to the new model, data integrity SHALL be preserved.

The migration SHALL:
1. For each experience with `skillIds`, create corresponding `ExperienceSkill` entries
2. Map proficiency levels from skills to experiences based on context
3. Validate that computed skill timelines match original skill timelines (within acceptable tolerance)
4. Ensure no skill or proficiency data is lost

#### Scenario: Migrating experience with skills
- **GIVEN** an experience with `skillIds: ['python', 'neo4j']`
- **WHEN** migrating to the new model
- **THEN** the experience has `skills: [{skillId: 'python', proficiency: ?}, {skillId: 'neo4j', proficiency: ?}]`
- **AND** proficiency values are inferred from the original skill definitions or context

#### Scenario: Validating timeline consistency
- **GIVEN** a skill "Python" with original timeline 2015-present
- **WHEN** migrating and computing new timeline from experiences
- **THEN** the computed timeline matches 2015-present
- **AND** any discrepancies are flagged for review

---

## Implementation Notes

### Proficiency Inference Rules

When migrating `skillIds` to `skills` with proficiency levels:

1. **If the skill's original proficiency can be directly attributed to the experience** (e.g., experience dates fully cover skill dates), use that proficiency.

2. **If multiple experiences overlap with the skill's dates**, distribute proficiency based on:
   - Experience sequence (earlier experiences = lower proficiency)
   - Experience context from highlights/description

3. **Manual review required** for ambiguous cases where:
   - Skill dates don't align with experience dates
   - Multiple experiences could equally claim the proficiency

### Calculation Helper Functions

```typescript
// Get all experiences that use a skill
function getExperiencesForSkill(skillId: string, experiences: Experience[]): Experience[]

// Compute skill timeline from experiences
function computeSkillTimeline(skillId: string, experiences: Experience[]): {
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

// Calculate weighted average proficiency with degradation for inactive skills
// Formula: proficiency = (sum(exp_proficiency × exp_duration) / total_duration) × degradation_factor
function getSkillProficiency(
  skillId: string,
  experiences: Experience[],
  referenceDate?: Date
): number | undefined

// Get proficiency history for a skill over time (for visualization)
function getSkillProficiencyHistory(skillId: string, experiences: Experience[]): SkillTimelinePoint[]

// Compute degradation factor based on time since last use
// Returns: 1.0 if active or <2 years, 0.5 if 2-5 years, 0.25 if >5 years
function getDegradationFactor(lastUsedDate: Date | null, referenceDate?: Date): number

// Compute ComputedSkillV2 from base Skill and experiences
function computeSkill(
  skill: { id: string; name: string; category: CategoryId; subcategory: string; description?: string },
  experiences: Experience[],
  referenceDate?: Date
): ComputedSkillV2
```

These functions encapsulate the logic for deriving skill properties from experiences, making it easy to use throughout the application.

**Key Implementation Notes:**

1. **Weighted Average**: When computing proficiency, multiply each experience's proficiency by its duration (in months), sum these values, then divide by the total duration.

2. **Degradation Factor**: Applied AFTER computing the weighted average. Check if the skill is currently in use (any experience with null endDate) or when the most recent experience ended.

3. **Duration Calculation**: Use month-level precision for experience durations. Handle null endDates as extending to the reference date (default: current date).

4. **Edge Cases**: Return undefined proficiency for skills with no experiences.

5. **Backward Compatibility**: The Skill interface retains optional `proficiency`, `startDate`, and `endDate` fields marked as deprecated. This allows gradual migration without breaking existing code. New implementations should use `ComputedSkillV2` obtained via `computeSkill()`.

6. **Type Separation**: `ComputedSkillV2` is a separate interface (does NOT extend `Skill`) to clearly distinguish between reference data and computed properties. This prevents confusion about which fields are stored vs. derived.
