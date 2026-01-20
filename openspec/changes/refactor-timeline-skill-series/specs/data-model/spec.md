# Data Model Specification - Timeline Refactoring Deltas

This document contains specification changes for the timeline refactoring.

---

## MODIFIED Requirements

### Requirement: Timeline Data Generation

The system SHALL generate timeline data points representing **cumulative skill proficiency** over time, not just active skill counts.

For each monthly data point, the system SHALL:
1. Iterate through all skills
2. For each skill, calculate proficiency contributions from all experiences:
   - **During experience** (month >= startDate AND month <= endDate): Linear progression from 0 to target proficiency
   - **After experience** (month > endDate): Linear decay from target proficiency to 0 over 24 months
3. Sum proficiency contributions across all experiences for that skill
4. Aggregate proficiency sums by category

**Progression Formula**:
```
progressRatio = monthsIntoExperience / totalExperienceMonths
monthlyProficiency = targetProficiency × progressRatio
```

**Decay Formula**:
```
monthsSinceEnd = currentMonth - experienceEndMonth
decayRatio = 1 - (monthsSinceEnd / 24)
monthlyProficiency = targetProficiency × max(0, decayRatio)
```

#### Scenario: Single experience with linear progression
- **GIVEN** Python skill used in Experience A (2020-01 to 2020-12) with proficiency 6
- **WHEN** generating timeline data for 2020-06 (6 months into 12-month experience)
- **THEN** progressRatio = 6/12 = 0.5
- **AND** monthlyProficiency = 6 × 0.5 = 3.0

#### Scenario: Single experience with linear decay
- **GIVEN** Python skill used in Experience A (2020-01 to 2020-12) with proficiency 6
- **AND** Experience A ended 2020-12
- **WHEN** generating timeline data for 2021-12 (12 months after end)
- **THEN** decayRatio = 1 - (12/24) = 0.5
- **AND** monthlyProficiency = 6 × 0.5 = 3.0

#### Scenario: Multiple overlapping experiences
- **GIVEN** Python skill used in:
  - Experience A (2019-01 to 2020-12) with proficiency 3
  - Experience B (2021-01 to 2022-12) with proficiency 5
- **WHEN** generating timeline data for 2020-12 (end of A, before B)
- **THEN** A contributes: 3 × 1.0 = 3.0 (fully progressed)
- **AND** B contributes: 0 (hasn't started)
- **AND** total Python proficiency = 3.0
- **WHEN** generating timeline data for 2022-06 (mid-B, A decaying)
- **THEN** A contributes: 3 × (1 - 18/24) = 0.75 (decaying for 18 months)
- **AND** B contributes: 5 × 0.5 = 2.5 (6 months into 12-month experience)
- **AND** total Python proficiency = 3.25

#### Scenario: Complete decay after 24 months
- **GIVEN** Python skill used in Experience A (2020-01 to 2020-12) with proficiency 6
- **WHEN** generating timeline data for 2023-01 (24 months after end)
- **THEN** decayRatio = 1 - (24/24) = 0
- **AND** monthlyProficiency = 0

#### Scenario: Category aggregation
- **GIVEN** two skills in "software-development" category:
  - Python with proficiency 5.0 at current month
  - JavaScript with proficiency 3.5 at current month
- **WHEN** generating timeline data point for current month
- **THEN** software-development category value = 5.0 + 3.5 = 8.5

---

## ADDED Requirements

### Requirement: Timeline Configuration Constants

The system SHALL define configurable constants for timeline behavior:

| Constant | Value | Purpose |
|----------|-------|---------|
| `DECAY_DURATION_MONTHS` | 24 | Months for proficiency to decay from max to zero |
| `USE_LOGARITHMIC_PROGRESSION` | false | Whether to use logarithmic vs. linear progression |
| `USE_EXPONENTIAL_DECAY` | false | Whether to use exponential vs. linear decay |

These constants SHALL be centralized in a configuration file (e.g., `src/lib/timeline-config.ts`).

#### Scenario: Configurable decay duration
- **GIVEN** DECAY_DURATION_MONTHS is set to 12
- **WHEN** generating timeline data for a skill 6 months after experience end
- **THEN** decayRatio = 1 - (6/12) = 0.5
- **AND** skill decays to zero in 12 months instead of 24

---

### Requirement: Timeline Data Semantic Change

The `TimelineDataPoint` interface SHALL maintain its structure but change the **semantic meaning** of category values:

**Before**: Category values represent **count of active skills**
**After**: Category values represent **sum of skill proficiency values**

The Y-axis interpretation SHALL change from:
- "Number of Active Skills" → "Cumulative Proficiency"

#### Scenario: Semantic interpretation
- **GIVEN** a timeline data point with `software-development: 15.5`
- **WHEN** interpreted in the old model
- **THEN** it means "15 or 16 skills active" (rounded count)
- **WHEN** interpreted in the new model
- **THEN** it means "15.5 cumulative proficiency units from all software-development skills"

---

### Requirement: Skill Proficiency Contribution Calculation

The system SHALL provide a helper function to calculate a single skill's proficiency at a specific date:

```typescript
function calculateSkillProficiencyAtDate(
  skill: ComputedSkill,
  date: string
): number
```

This function SHALL:
1. Parse the date into year/month
2. Iterate through all experiences that used this skill
3. For each experience, calculate proficiency contribution (progression or decay)
4. Sum all contributions
5. Return total proficiency value

#### Scenario: Helper function usage
- **GIVEN** Python skill with 2 experiences
- **WHEN** calling `calculateSkillProficiencyAtDate(pythonSkill, "2022-06")`
- **THEN** returns cumulative proficiency from both experiences at that date
- **AND** can be used in generateTimelineData or tooltip display

---

## REMOVED Requirements

None - existing requirements remain valid, only implementation details change.
