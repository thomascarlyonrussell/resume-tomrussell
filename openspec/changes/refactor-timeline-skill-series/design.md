# Design: Continuous Skill-Based Timeline Series

## Overview

Refactor timeline data generation from discrete experience-based skill counting to continuous skill-based proficiency accumulation with linear progression and decay.

## Current Architecture

### Data Flow
```
getAllComputedSkills()
    ↓
generateTimelineData()
    ↓ For each month:
    └─ Count skills where startDate ≤ month ≤ endDate
    ↓
TimelineChartData[] (skill counts per category)
```

### Current Algorithm (generateTimelineData)
```typescript
for each month in timeline:
  for each category:
    count = skills.filter(skill => 
      skill.category === category &&
      skill.startDate <= month &&
      skill.endDate >= month
    ).length
    
    dataPoint[category] = count
```

**Issue**: Skills are binary (active/inactive) at experience boundaries, creating visual discontinuities.

## Proposed Architecture

### Data Flow
```
getAllComputedSkills()
    ↓
For each skill:
    ↓
    getExperiencesForSkill()
        ↓
        For each experience:
            ↓
            Calculate monthly proficiency contribution
            (linear ramp-up during experience,
             linear decay after experience)
    ↓
Aggregate contributions from all experiences
    ↓
TimelineChartData[] (cumulative proficiency per skill per category)
```

### Proposed Algorithm (generateTimelineData)

```typescript
// For each month in timeline
for (let month of allMonths) {
  // Initialize category totals
  let categoryTotals = {}
  
  // For each skill
  for (let skill of allSkills) {
    let monthlyProficiency = 0
    
    // For each experience that used this skill
    for (let experience of skill.experiences) {
      let expSkill = experience.skills.find(s => s.skillId === skill.id)
      let targetProficiency = expSkill.proficiency
      
      // If during experience: linear progression
      if (month >= experience.startDate && 
          (!experience.endDate || month <= experience.endDate)) {
        let monthsIntoExp = monthsSince(experience.startDate, month)
        let totalMonths = experienceDurationMonths(experience)
        let progressRatio = monthsIntoExp / totalMonths
        
        // Linear ramp from 0 to targetProficiency
        monthlyProficiency += targetProficiency * progressRatio
      }
      
      // If after experience: linear decay
      else if (experience.endDate && month > experience.endDate) {
        let monthsSinceEnd = monthsSince(experience.endDate, month)
        let decayDuration = 24 // 2 years to decay to zero
        let decayRatio = 1 - (monthsSinceEnd / decayDuration)
        
        if (decayRatio > 0) {
          // Linear decay from targetProficiency to 0
          monthlyProficiency += targetProficiency * decayRatio
        }
      }
    }
    
    // Add this skill's proficiency to its category total
    categoryTotals[skill.category] += monthlyProficiency
  }
  
  // Create data point with category totals
  dataPoint = { month, ...categoryTotals }
}
```

## Key Design Decisions

### 1. Linear Progression During Experience

**Decision**: Proficiency increases linearly from 0 to target proficiency over the experience duration.

**Rationale**: 
- Simple, predictable behavior
- Represents gradual skill acquisition
- Mathematically straightforward
- No "instant proficiency" at experience start

**Alternative Considered**: Logarithmic curve (rapid early growth, plateau later)
- **Rejected**: Added complexity, less intuitive for viewers

### 2. Linear Decay After Experience

**Decision**: Proficiency decreases linearly from target to 0 over 24 months (2 years).

**Rationale**:
- Mirrors the existing degradation factor concept (1.0 → 0.5 → 0.25 → 0)
- 2-year decay period aligns with industry understanding of skill staleness
- Creates smooth visual transitions
- Prevents abrupt skill disappearance

**Parameters**:
- Decay duration: **24 months** (configurable constant)
- Decay curve: **Linear** (straight line from max to zero)

**Alternative Considered**: Exponential decay
- **Rejected**: More complex, less visually predictable

### 3. Aggregation of Multiple Experiences

**Decision**: Sum all contributions from different experiences for the same skill.

**Rationale**:
- A skill used in multiple roles should show higher cumulative proficiency
- Represents total capability across career
- Creates realistic "peaks" when skill is heavily used

**Example**: Python used in 3 experiences
- Experience A (2015-2018): proficiency 3
- Experience B (2019-2021): proficiency 5
- Experience C (2022-current): proficiency 8

At any given month, the timeline shows the sum of:
- A's contribution (progressing, then decaying)
- B's contribution (progressing, then decaying)
- C's contribution (progressing)

### 4. Y-Axis Meaning Change

**Decision**: Change Y-axis from "Active Skills" (count) to "Cumulative Proficiency" (sum).

**Rationale**:
- More meaningful metric (capability vs. just presence)
- Better represents skill depth and expertise
- Still allows category comparison

**Trade-offs**:
- Loses the simple "number of skills" interpretation
- Values are now abstract proficiency units
- May need tooltip/legend to explain

**Mitigation**: Update Y-axis label, add explanatory text/legend

## Data Structure Changes

### Before
```typescript
interface TimelineDataPoint {
  date: string
  year: number
  month: number
  engineering: number        // COUNT of skills
  'software-development': number  // COUNT of skills
  // ... other categories
}
```

### After
```typescript
interface TimelineDataPoint {
  date: string
  year: number
  month: number
  engineering: number        // SUM of proficiency values
  'software-development': number  // SUM of proficiency values
  // ... other categories
}
```

**No breaking change to interface** - only semantic change in what the numbers represent.

## Visual Impact

### Before
- Step functions at experience boundaries
- Discrete skill appearance/disappearance
- Y-axis: integer counts (e.g., 5, 10, 15 skills)

### After
- Smooth curves with gradual transitions
- Continuous skill evolution
- Y-axis: proficiency sums (e.g., 25, 50, 75 proficiency units)

### Chart Adjustments Needed
1. Y-axis label: "Active Skills" → "Cumulative Proficiency"
2. Tooltip: Show proficiency breakdown instead of skill count
3. Legend: Explain proficiency scaling

## Performance Considerations

### Complexity Analysis

**Current**: O(months × skills) - simple filtering
**Proposed**: O(months × skills × experiences_per_skill) - nested iteration

**Impact**: 
- Typical values: 200 months × 50 skills × 2 exp/skill = ~20,000 operations
- Still negligible for client-side computation (<10ms)
- No performance optimization needed

### Caching Strategy
- Continue using `useMemo` in `useTimelineData` hook
- Data recomputes only when skills/experiences change
- No additional caching required

## Testing Strategy

### Unit Tests (generateTimelineData)
1. ✅ Single experience: verify linear progression during
2. ✅ Single experience: verify linear decay after
3. ✅ Multiple overlapping experiences: verify aggregation
4. ✅ Sequential experiences (same skill): verify transitions
5. ✅ Zero state: no experiences → all zeros

### Integration Tests (TimelineArea)
1. ✅ Visual regression: compare chart snapshots
2. ✅ Tooltip content: verify proficiency values displayed
3. ✅ Category filtering: verify proficiency sums correctly
4. ✅ Date range: verify proficiency at specific months

### Visual QA
- Compare before/after screenshots
- Verify smooth curves (no steps)
- Confirm realistic career progression

## Migration Path

### Phase 1: Data Layer
1. Implement new `generateTimelineData` algorithm
2. Add unit tests
3. Validate output format matches existing interface

### Phase 2: Visualization Layer
1. Update Y-axis label
2. Update tooltip to show proficiency
3. Add legend/explanation text

### Phase 3: Testing & Validation
1. Run full test suite
2. Visual regression testing
3. Manual QA of timeline chart

### Phase 4: Documentation
1. Update README with new timeline behavior
2. Update data model spec
3. Update visualization spec

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Values too high/low | Poor visual scaling | Tune decay duration, test with real data |
| Confusing to users | UX issue | Add clear legend/tooltip |
| Breaking tests | Development slowdown | Update tests incrementally |
| Performance impact | Slow rendering | Profile and optimize if needed |

## Configuration Constants

Define these in a central location (e.g., `src/lib/timeline-config.ts`):

```typescript
export const TIMELINE_CONFIG = {
  /** Duration in months for skill proficiency to decay to zero */
  DECAY_DURATION_MONTHS: 24,
  
  /** Whether to use linear (false) or logarithmic (true) progression */
  USE_LOGARITHMIC_PROGRESSION: false,
  
  /** Whether to use linear (false) or exponential (true) decay */
  USE_EXPONENTIAL_DECAY: false,
} as const
```

This allows future experimentation without code changes.

## Open Questions

**Q: Should decay duration vary by skill type?**
- **A**: No, keep it simple with a single decay duration for now. Can be enhanced later if needed.

**Q: Should progression be instant at experience start (like proficiency is "achieved" on day 1)?**
- **A**: No, linear ramp-up is more realistic and creates better visual continuity.

**Q: What happens if experience duration is very short (e.g., 1 month)?**
- **A**: Progression completes in that month, then decay begins. This is correct behavior.
