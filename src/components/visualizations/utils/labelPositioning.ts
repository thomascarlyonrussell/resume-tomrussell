/**
 * Label Positioning Utilities
 *
 * Utilities for calculating label positions, text truncation, and font sizing
 */

// Label size thresholds (diameter in pixels)
export const INSIDE_THRESHOLD = 40; // Labels inside circles >= 40px diameter
export const OUTSIDE_THRESHOLD = 12; // Labels outside circles between 12-40px diameter (lowered for better visibility when filtered)

// Font size range for inside labels
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 16;

// Label positioning constants
export const LABEL_OFFSET = 15; // Pixels from circle edge to label
export const LABEL_BANDS = 3; // Number of radial levels for staggering

/**
 * Determine label type based on circle diameter
 */
export type LabelType = 'inside' | 'outside' | 'none';

export function getLabelType(diameter: number): LabelType {
  if (diameter >= INSIDE_THRESHOLD) {
    return 'inside';
  } else if (diameter >= OUTSIDE_THRESHOLD) {
    return 'outside';
  }
  return 'none';
}

/**
 * Calculate font size for inside labels based on circle radius
 * Scales linearly between MIN_FONT_SIZE and MAX_FONT_SIZE
 */
export function calculateFontSize(radius: number): number {
  const minRadius = OUTSIDE_THRESHOLD / 2; // 10px
  const maxRadius = 50; // 100px diameter

  const scale = (radius - minRadius) / (maxRadius - minRadius);
  const fontSize = MIN_FONT_SIZE + scale * (MAX_FONT_SIZE - MIN_FONT_SIZE);

  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, fontSize));
}

/**
 * Truncate text to fit inside a circle
 * Uses ellipsis (...) for truncated text
 */
export function truncateForCircle(text: string, radius: number): string {
  const fontSize = calculateFontSize(radius);
  const avgCharWidth = fontSize * 0.6; // Approximate character width
  const maxCharsPerLine = Math.floor((radius * 1.6) / avgCharWidth);

  if (text.length <= maxCharsPerLine) {
    return text;
  }

  // Try to split on space for multi-word skills
  if (radius >= 40 && text.includes(' ')) {
    const words = text.split(' ');
    if (words[0].length <= maxCharsPerLine) {
      return words[0]; // Use first word
    }
  }

  // Truncate with ellipsis
  return text.substring(0, maxCharsPerLine - 1) + '…';
}

/**
 * Truncate text for outside labels
 * Max ~12 characters to fit in label box
 */
export function truncateOutsideLabel(text: string, maxChars: number = 12): string {
  if (text.length <= maxChars) {
    return text;
  }
  return text.substring(0, maxChars - 1) + '…';
}

/**
 * Position data for outside labels
 */
export interface OutsideLabelPosition {
  labelX: number;
  labelY: number;
  lineEndX: number;
  lineEndY: number;
}

/**
 * Calculate position for outside label
 * Places label offset from circle edge in direction away from viewport center
 */
export function calculateOutsideLabelPosition(
  circleX: number,
  circleY: number,
  circleRadius: number,
  skillIndex: number,
  totalSmallSkills: number,
  viewportCenter: { x: number; y: number }
): OutsideLabelPosition {
  // Calculate angle from viewport center to circle
  const angleFromCenter = Math.atan2(circleY - viewportCenter.y, circleX - viewportCenter.x);

  // Assign to one of 3 radial bands to stagger labels
  const band = assignLabelBand(skillIndex, totalSmallSkills);
  const bandOffset = band * 8; // 8px offset per band
  const totalOffset = LABEL_OFFSET + bandOffset;

  // Calculate point on circle edge in direction away from center
  const lineEndX = circleX + Math.cos(angleFromCenter) * circleRadius;
  const lineEndY = circleY + Math.sin(angleFromCenter) * circleRadius;

  // Position label offset from edge
  const labelX = lineEndX + Math.cos(angleFromCenter) * totalOffset;
  const labelY = lineEndY + Math.sin(angleFromCenter) * totalOffset;

  return {
    labelX,
    labelY,
    lineEndX,
    lineEndY,
  };
}

/**
 * Assign label to one of 3 radial bands for staggering
 * Helps prevent overlap of outside labels
 */
export function assignLabelBand(index: number, totalSkills: number): number {
  return index % LABEL_BANDS;
}
