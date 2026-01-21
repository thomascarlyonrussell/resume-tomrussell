# Data Model Specification - Delta

## MODIFIED Requirements

### Requirement: Experience Skill Structure

Each skill reference within an experience SHALL specify the rigor level (intensity of skill usage during that experience).

```typescript
interface ExperienceSkill {
  skillId: string;          // Reference to skill ID
  rigor: RigorLevel;        // 1, 2, 3, 5, or 8
}
```

**Note**: `rigor` represents the intensity/depth of skill usage during the experience, not current proficiency. Current proficiency is computed from rigor values weighted by duration and decay.

#### Scenario: Skill with rigor in experience
- **GIVEN** an experience that used "Neo4j"
- **WHEN** adding "Neo4j" to the experience skills
- **THEN** the entry includes skillId "neo4j" and rigor 5
- **AND** the rigor reflects the intensity of skill usage during that role

#### Scenario: Rigor interpretation
- **GIVEN** a rigor scale of 1, 2, 3, 5, 8 (Fibonacci)
- **WHEN** recording skill usage in an experience
- **THEN** rigor 1 = occasional/light usage
- **AND** rigor 3 = regular usage, core to the role
- **AND** rigor 8 = intensive/expert-level usage, primary focus

---

### Requirement: Computed Skill Properties

The data model SHALL support computed/derived skill properties:

- `startDate` - Earliest startDate of experiences that reference the skill
- `endDate` - Latest endDate of experiences that reference the skill (null if any experience is current)
- `isActive` - Boolean based on any referencing experience having null endDate
- `proficiency` - Time-dynamic proficiency based on rigor-weighted contributions with continuous decay
- `experiences` - List of experiences that used this skill
- `timeline` - Array of rigor changes over time

The proficiency calculation SHALL be:
```
proficiency = sum(experience_contributions)
```

Where each experience contribution is calculated as:
- **During experience**: Linear progression from 0 to target rigor value
- **After experience**: Continuous decay from achieved value toward 0

The rigor acts as a **linear weight**: higher rigor values contribute proportionally more to proficiency (rigor 8 contributes 8× more than rigor 1 for the same duration).

#### Scenario: Skill timeline computation
- **GIVEN** a skill "Python" used in 3 experiences spanning 2015-2025
- **WHEN** computing the skill's timeline
- **THEN** startDate is 2015-01
- **AND** endDate is null (current)
- **AND** isActive is true

#### Scenario: Skill proficiency with rigor weighting
- **GIVEN** a skill "SQL" used in experience A (2014-2018, rigor 3) and experience B (2018-present, rigor 5)
- **WHEN** computing current proficiency
- **THEN** contribution from A is weighted by rigor 3 with decay applied (since 2018)
- **AND** contribution from B is weighted by rigor 5 with no decay (currently active)
- **AND** total proficiency is sum of both contributions

#### Scenario: Continuous decay during gap
- **GIVEN** a skill "Python" used in experience A (2015-2018, rigor 5)
- **AND** a gap from 2018-2020 where Python was not used
- **AND** experience B (2020-present, rigor 8)
- **WHEN** computing proficiency at 2019-06 (during the gap)
- **THEN** proficiency from experience A has partially decayed
- **AND** experience B has not yet contributed (hasn't started)

#### Scenario: Proficiency rebuilds after gap
- **GIVEN** a skill with a usage gap
- **WHEN** a new experience starts using the skill
- **THEN** proficiency begins building again from the new experience
- **AND** any remaining contribution from previous experiences (after decay) is added

#### Scenario: Skill with no experiences
- **GIVEN** a skill that is defined but not referenced by any experience
- **WHEN** computing timeline properties
- **THEN** startDate and endDate are undefined
- **AND** isActive is false
- **AND** proficiency is undefined

---

### Requirement: Fibonacci Sizing with Derived Data

For the Fibonacci visualization, skills SHALL be sized based on computed proficiency derived from experiences.

The sizing algorithm SHALL:
1. Calculate current proficiency using rigor-weighted, time-dynamic formula
2. Map the proficiency value to the nearest Fibonacci number: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

Note: The `proficiency` value is a continuous number reflecting cumulative rigor-weighted contributions with decay. It is binned to Fibonacci values only for display sizing.

#### Scenario: Skill sizing with multiple experiences
- **GIVEN** a skill "Python" with:
  - Experience A: 2015-2019, rigor 5
  - Experience B: 2019-present, rigor 8
- **WHEN** computing Fibonacci size
- **THEN** proficiency is calculated from rigor-weighted contributions
- **AND** the continuous proficiency value is mapped to nearest Fibonacci for display

#### Scenario: Skill sizing with gap causing decay
- **GIVEN** a skill "Microsoft Access" with:
  - Experience A: 2012-2015, rigor 3
  - No subsequent usage (10 years gap as of 2025)
- **WHEN** computing Fibonacci size in 2025
- **THEN** proficiency is significantly reduced due to continuous decay
- **AND** maps to a small Fibonacci value (likely 1)

---

### Requirement: Timeline Aggregation with Experience-Based Data

For the Timeline visualization, data SHALL aggregate skill proficiencies over time.

The aggregation SHALL:
- Calculate cumulative proficiency for each skill at each time point
- Support category-level view: sum of skill proficiencies within category
- Support skill-level view: individual skill proficiency over time
- Enable drill-down from category to individual skills

#### Scenario: Category proficiency over time
- **GIVEN** multiple skills in "software-development" category
- **WHEN** viewing category-level timeline
- **THEN** Y-axis shows sum of all skill proficiencies in that category at each time point
- **AND** areas grow as proficiency accumulates through experience

#### Scenario: Drill-down to skill level
- **GIVEN** the timeline is showing category-level view
- **WHEN** user drills down into "software-development" category
- **THEN** timeline shows individual skill proficiencies stacked
- **AND** each skill's proficiency shows its time evolution

#### Scenario: Proficiency decay visible in timeline
- **GIVEN** a skill with a usage gap
- **WHEN** viewing the timeline
- **THEN** the skill's proficiency visibly decreases during the gap
- **AND** increases again when new experiences start using the skill

---

## Type Definitions (TypeScript) - Updated

```typescript
/**
 * Valid rigor levels using Fibonacci sequence
 * Represents intensity of skill usage during an experience
 * 1 = Light/occasional, 2 = Supporting, 3 = Regular, 5 = Core, 8 = Intensive/Expert
 */
export type RigorLevel = 1 | 2 | 3 | 5 | 8;

/**
 * @deprecated Use RigorLevel for experience skill entries
 * Kept for backwards compatibility with computed proficiency binning
 */
export type ProficiencyLevel = 1 | 2 | 3 | 5 | 8;

/**
 * Skill reference in an experience with rigor level
 */
interface ExperienceSkill {
  skillId: string;          // Reference to skill ID
  rigor: RigorLevel;        // Intensity of skill usage (1, 2, 3, 5, or 8)
}

/**
 * Computed skill properties derived from experiences
 */
interface ComputedSkill {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  description?: string;
  startDate?: string;           // Computed from experiences
  endDate?: string;             // Computed from experiences
  isActive: boolean;            // Computed from experiences
  proficiency?: number;         // Time-dynamic, rigor-weighted with decay (continuous value)
  yearsOfExperience: number;    // Computed from experiences
  experiences: Experience[];    // Experiences that used this skill
  fibonacciSize: number;        // proficiency mapped to Fibonacci scale
  degradationFactor: number;    // Current decay factor (for reference)
}

/**
 * Point in time showing skill rigor for proficiency history
 */
interface SkillTimelinePoint {
  date: string;               // YYYY-MM format
  experienceId: string;       // Experience ID where this rigor was recorded
  rigor: RigorLevel;          // Rigor level at this point
}
```
