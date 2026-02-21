# Change: Rename Proficiency to Rigor with Time-Dynamic Proficiency Calculation

## Why

The current terminology conflates two distinct concepts:
1. **Input**: How intensely/rigorously a skill was used during an experience (static, recorded at data entry)
2. **Output**: Current proficiency level (dynamic, computed from time-weighted rigor and decay)

Renaming the input field from `proficiency` to `rigor` clarifies that:
- **Rigor** is a data entry field reflecting the intensity of skill usage during an experience
- **Proficiency** is a computed metric reflecting current capability, affected by time, rigor weighting, and decay

This change also introduces **continuous decay** during gaps between experiences, making proficiency a more accurate representation of skill retention over time.

## What Changes

### Data Model
- **BREAKING**: Rename `ExperienceSkill.proficiency` to `ExperienceSkill.rigor`
- **BREAKING**: Rename `ProficiencyLevel` type to `RigorLevel` (values remain: 1, 2, 3, 5, 8)
- Update `ComputedSkill.proficiency` to remain as the computed output (no rename needed)
- Add `RigorLevel` type alias for clarity

### Calculation Methodology
- **Rigor as weight**: Higher rigor = more contribution to proficiency (linear: rigor × duration)
- **Continuous decay**: Proficiency decays during gaps when skill not in use, rebuilds when used again
- **Timeline shows cumulative proficiency**: Sum of skill proficiencies at each point in time

### Timeline Visualization
- **MODIFIED**: Y-axis shows cumulative proficiency (sum of skill proficiencies)
- **NEW**: Drill-down from category to individual skills
- Category view shows sum of skill proficiencies within category
- Skill view shows individual skill proficiency

### Fibonacci Visualization
- Proficiency values binned to nearest Fibonacci number for display sizing
- No change to spiral layout logic

## Impact

### Affected Specs
- `data-model` - ExperienceSkill, ComputedSkill, type definitions
- `visualizations` - Timeline Y-axis, drill-down behavior

### Affected Code
- `src/data/types.ts` - Type definitions
- `src/data/experience.ts` - Experience skill entries (21+ occurrences)
- `src/lib/skill-computation.ts` - Calculation logic
- `src/lib/calculations.ts` - Fibonacci sizing
- `src/components/visualizations/TimelineArea.tsx` - Y-axis rendering
- `src/components/visualizations/TimelineTooltip.tsx` - Tooltip content
- ~21 files reference "proficiency" and may need updates

### Migration
- All experience entries need `proficiency` → `rigor` field rename
- No value changes required (scale remains 1, 2, 3, 5, 8)
