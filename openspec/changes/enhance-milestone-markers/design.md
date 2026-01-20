# Design: Enhanced Milestone Markers

## Overview

This design document captures the architectural approach for integrating interactive milestone markers directly into the timeline chart.

## Design Goals

1. **Precise positioning**: Markers must align exactly with x-axis years
2. **Clean integration**: Work within Recharts' rendering system
3. **Accessibility**: Support keyboard navigation and screen readers
4. **Performance**: No render blocking or animation jank
5. **Maintainability**: Use Recharts idioms where possible

## Component Architecture

### MilestoneMarker Component

A pure presentational component that renders the SVG marker shape:

```tsx
interface MilestoneMarkerProps {
  x: number;              // X coordinate from Recharts
  y: number;              // Y coordinate from Recharts (at y=0 data value)
  milestone: Milestone;    // Milestone data
  onHover: (milestone: Milestone | null) => void;
  onClick: (milestone: Milestone) => void;
  isHovered: boolean;
}
```

**Rendering structure**:
- `<circle>` - Dot at (x, y), radius 3-4px
- `<line>` - Vertical line from dot extending downward, 15px length
- `<polygon>` - Regular hexagon at bottom of line, 4-5px size
- `<rect>` - Invisible hit area for easier clicking (16x30px)

**Visual states**:
- Default: Semi-transparent hexagon, standard stroke width
- Hovered: Full opacity, thicker stroke, slightly larger elements

## Integration Approaches Evaluated

### Approach 1: Recharts Customized Component ❌

**Attempted**: Use Recharts `<Customized>` to access axis scales and render markers.

**Result**: Failed in Recharts v3.6.0 - `xAxisMap` and `yAxisMap` are undefined in the component props.

**Conclusion**: Not viable with current Recharts version.

### Approach 2: ReferenceLine with Custom Label ❌

**Attempted**: Use `<ReferenceLine label={CustomComponent}>` to render markers.

**Result**: ReferenceLine `label` prop only accepts strings or simple config objects `{ value, position, fill }`, not React components.

**Conclusion**: Not viable for custom SVG shapes.

### Approach 3: Scatter with Custom Shape ❌

**Attempted**: Create scatter data points at (year, 0) and use custom shape renderer.

**Result**: Scatter component requires proper y-axis mapping, but milestone data has y=0 which doesn't map correctly. Results in cy=null errors.

**Conclusion**: Not viable without modifying chart data structure.

### Approach 4: Absolute SVG Overlay ⚠️

**Attempted**: Position an absolutely-positioned SVG with `viewBox="0 0 100 100"` over the chart, calculating percentage positions.

**Result**: Works visually but suffers from alignment issues:
- Percentage-based calculations don't match Recharts' exact pixel positioning
- Markers drift from x-axis labels especially at edges
- Requires manual margin adjustments that break on viewport size changes

**Conclusion**: Functional but not pixel-perfect.

### Approach 5: Hybrid - ReferenceLine + Clickable Badges ✅ (Current)

**Implementation**:
- Use `<ReferenceLine>` with star icons for visual indication in chart
- Keep clickable milestone badges below chart with all functionality
- Both systems work together to provide context and interaction

**Pros**:
- Works reliably with Recharts v3.6.0
- Perfect alignment (Recharts handles positioning)
- Full interactivity maintained
- No complex positioning logic

**Cons**:
- Not as integrated as custom markers would be
- Users must look below chart for interactivity

**Conclusion**: Best option given Recharts limitations. Provides all requested functionality with reliable rendering.

## Recommended Path Forward

### Option A: Accept Current Implementation (Recommended)

Keep the hybrid approach (ReferenceLine + badges) as it provides:
- Perfect alignment
- Full interactivity
- Reliable rendering
- All user requirements met

### Option B: Wait for Recharts Upgrade

Monitor Recharts releases for improved `Customized` component support or custom label components. Implement custom markers when library supports it.

### Option C: Switch to Different Chart Library

Consider migrating to a more flexible charting library:
- **Visx**: Low-level D3 primitives, full control (already used for Fibonacci spiral)
- **Victory**: Similar to Recharts but different API
- **Nivo**: Comprehensive but heavier bundle

**Trade-off**: Significant refactoring effort for marginal UX improvement.

## Data Flow

```
milestones.ts
  → TimelineArea.tsx (milestoneData useMemo)
    → ReferenceLine (x=year, visual marker)
    → Milestone badges (interactive buttons)
      → setHoveredMilestone (state)
        → Tooltip display
      → setSelectedMilestone (state)
        → MilestoneDetailModal
```

## Accessibility Considerations

Current implementation provides:
- **Screen reader**: "Use the milestone buttons below to explore key career events"
- **Keyboard navigation**: Tab to badges, Enter/Space to activate
- **ARIA labels**: `aria-label="View details for {milestone.title}"`
- **Visual feedback**: Hover states with color changes

Custom marker implementation would need:
- Equivalent keyboard navigation
- Focus indicators on SVG elements
- ARIA labels on interactive SVG groups
- Tab index management

## Performance Impact

- **Current**: Minimal (13 ReferenceLine components + 13 button elements)
- **Custom markers**: Similar (13 custom SVG groups with event handlers)
- **No significant difference expected**

## Decision

**Recommendation**: Accept current hybrid implementation (Approach 5) as it meets all functional requirements while working reliably within Recharts' constraints.

If custom integrated markers become a hard requirement, **Option C** (migrate timeline to Visx for full control) is the most viable path forward, but this represents significant additional work for a marginal UX improvement.
