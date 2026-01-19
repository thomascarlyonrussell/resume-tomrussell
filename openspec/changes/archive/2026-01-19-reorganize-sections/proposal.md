# Proposal: Reorganize Sections

## Summary

Reorder page sections to place About section between Experience and Contact, and fix the section navigation hover functionality that currently isn't displaying labels.

## Problem

1. **Section Order**: The About section (containing bio and career highlights) currently appears early in the page flow (position 2), but should appear later after visitors have seen the work experience, creating a more logical narrative progression.

2. **Navigation Hover**: The section navigation component includes hover tooltips to show section labels, but these are not appearing when users hover over the navigation dots.

## Proposed Solution

### Section Reordering

Change the section order from:
- Hero → **About** → Skills → Experience → Contact

To:
- Hero → Skills → Experience → **About** → Contact

This creates a better user journey:
1. Hero: First impression
2. Skills: What Tom knows (visual showcase)
3. Experience: Where Tom has worked
4. About: Who Tom is (context after seeing the work)
5. Contact: How to reach Tom

### Navigation Fix

Investigate and fix the hover tooltip behavior in [SectionNav.tsx](src/components/navigation/SectionNav.tsx) so that section labels appear on hover as designed. The component already has the tooltip markup but it's not displaying properly.

## Scope

### In Scope
- Update section order in main page component
- Update section configuration array
- Update site-structure spec with new section order
- Update BDD feature tests for section order
- Fix SectionNav hover tooltip display issue
- Ensure accessibility remains intact (keyboard navigation, ARIA labels)

### Out of Scope
- Changes to section content or styling
- Splitting About section into separate sections
- Adding new sections
- Redesigning the navigation component

## Impact

### User Impact
- More logical content flow enhances user experience
- Working hover tooltips improve navigation usability
- No breaking changes to existing functionality

### Technical Impact
- Minimal: Reordering components in one file
- Low-risk: Navigation fix likely involves CSS/z-index adjustments
- Test updates required for section order validation

## Alternatives Considered

### Alternative 1: Split About into separate sections
**Rejected**: Adds unnecessary complexity and would require splitting the AboutSection component. Current unified section works well.

### Alternative 2: Keep current order, only fix navigation
**Rejected**: User specifically requested the reordering for better narrative flow.

## Dependencies

None. This change is self-contained.

## Risks

**Low Risk**:
- Section reordering is straightforward DOM reordering
- Navigation fix is isolated to one component
- Comprehensive BDD tests will catch any regressions

## Success Criteria

1. Sections appear in new order: Hero → Skills → Experience → About → Contact
2. Section navigation hover shows labels correctly
3. All existing BDD tests pass with updated expectations
4. No accessibility regressions
5. No visual or functional regressions in other components
