# Tasks: Reorganize Sections

## Implementation Tasks

### 1. Update Section Order in Main Page
- [x] Reorder section components in [src/app/page.tsx](src/app/page.tsx)
- [x] Update sections configuration array with new order
- [x] Verify visual order matches expected flow

### 2. Fix Section Navigation Hover
- [x] Investigate why hover tooltips aren't displaying in [SectionNav.tsx](src/components/navigation/SectionNav.tsx)
- [x] Fix CSS/z-index issues preventing tooltip visibility
- [x] Test hover behavior on desktop
- [x] Verify keyboard focus still shows labels correctly
- [x] Test in both light and dark modes

### 3. Update Specifications
- [x] Update site-structure spec with new section order
- [x] Update requirement scenario for "Complete page scroll"
- [x] Update visual hierarchy diagram if needed

### 4. Update Tests
- [x] Update section order BDD test in [tests/features/site-structure/section-order.feature](tests/features/site-structure/section-order.feature)
- [x] Update step definitions if needed
- [x] Run all BDD tests to ensure no regressions

### 5. Validation
- [x] Manual testing: verify section order on deployed page
- [x] Manual testing: verify hover tooltips appear correctly
- [x] Accessibility check: keyboard navigation works
- [x] Accessibility check: screen reader announces sections correctly
- [x] Visual regression check: no layout shifts or styling issues
- [x] Run full test suite

## Validation Commands

```bash
# Run BDD tests
npm run test:bdd

# Run all tests
npm test

# Validate OpenSpec
openspec validate reorganize-sections --strict --no-interactive
```

## Dependencies

None - tasks can be executed in order as listed.

## Estimated Complexity

**Low**: Straightforward DOM reordering and CSS debugging.
