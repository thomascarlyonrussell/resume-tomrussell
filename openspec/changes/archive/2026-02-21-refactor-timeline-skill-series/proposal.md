# Change: Refactor Timeline Chart to Continuous Skill-Based Series

## Why

**Problem**: The current timeline chart creates discrete skill series based on experiences, resulting in visual "breaks" when roles change. Skills appear and disappear abruptly at experience boundaries, even though real-world skill proficiency evolves continuously.

**Impact**: This makes it difficult to:
- Track long-term skill growth across multiple roles
- Visualize continuous skill development
- Understand how skills decay when no longer actively used
- See smooth skill progression over a career

**Example**: If "Python" was used at proficiency 3 in Experience A (2015-2018) and proficiency 5 in Experience B (2019-2022), the current chart shows a gap or step change rather than continuous evolution.

## What Changes

Transform timeline data generation from **experience-based discrete series** to **skill-based continuous series** with linear progression/decay:

### Current Behavior
- Each data point counts "active skills" per category at that moment
- Skills appear/disappear at experience start/end boundaries
- No representation of skill growth within an experience
- No representation of skill decay after an experience ends

### Proposed Behavior
- Each data point calculates **cumulative proficiency** per skill across all experiences
- While an experience is active: **linear progression** adds proficiency each month
- After an experience ends: **linear decay** reduces proficiency from that experience
- Skills have continuous series that smoothly grow and decline

### Affected Areas
1. **Data Model** - New timeline calculation method
2. **Visualizations** - Timeline chart displays cumulative proficiency instead of skill counts
3. **Data Generation** - `generateTimelineData()` function completely refactored

## Impact Assessment

### Breaking Changes
- **Timeline Y-axis meaning changes** from "Active Skills Count" to "Cumulative Proficiency"
- **Data structure changes** - chart data represents proficiency values instead of counts
- **Visual appearance changes** - smoother curves, continuous transitions

### Migration Requirements
- Update tests that validate timeline data
- Update chart Y-axis label and tooltip content
- May need to adjust visual scaling (proficiency values vs. counts)

### Related Specs
- `data-model` - Timeline data calculation
- `visualizations` - Timeline chart display

## Success Criteria

1. ✅ Timeline shows continuous skill series (no experience-based breaks)
2. ✅ Active experiences contribute linear proficiency growth each month
3. ✅ Ended experiences contribute linear proficiency decay each month
4. ✅ Multiple experiences for same skill aggregate correctly
5. ✅ Chart smoothly visualizes skill evolution over entire career
6. ✅ All existing tests updated and passing
7. ✅ Validation passes: `openspec validate refactor-timeline-skill-series --strict --no-interactive`

## Open Questions

None at this time. The requirements are clear from the user request.

## Related Changes

None - this is a standalone refactoring.
