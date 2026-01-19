/**
 * Text Contrast Utilities
 *
 * WCAG-compliant color contrast calculations for accessible text rendering
 */

/**
 * Calculate relative luminance of an RGB color
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function calculateRelativeLuminance(r: number, g: number, b: number): number {
  // Normalize RGB values to 0-1 range
  const [rNorm, gNorm, bNorm] = [r / 255, g / 255, b / 255];

  // Apply gamma correction
  const rLin = rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gLin = gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bLin = bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  // Calculate relative luminance using WCAG formula
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Parse hex color to RGB components
 */
function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Support both 3-digit and 6-digit hex
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return { r, g, b };
  }

  return null;
}

/**
 * Get contrasting text color (white or black) for a given background color
 * Returns white for dark backgrounds, black for light backgrounds
 * Follows WCAG guidelines for readable contrast
 *
 * @param backgroundColor - Hex color string (e.g., "#3B82F6" or "#fff")
 * @returns "#FFFFFF" for dark backgrounds, "#000000" for light backgrounds
 */
export function getContrastingTextColor(backgroundColor: string): string {
  const rgb = parseHexColor(backgroundColor);

  if (!rgb) {
    // Fallback to white if color parsing fails
    return '#FFFFFF';
  }

  // Calculate relative luminance
  const luminance = calculateRelativeLuminance(rgb.r, rgb.g, rgb.b);

  // Use 0.5 as threshold (midpoint between 0 and 1)
  // Luminance > 0.5 means light background, use black text
  // Luminance <= 0.5 means dark background, use white text
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Calculate contrast ratio between two colors
 * Used for WCAG compliance checking (AA requires 4.5:1 for normal text, 3:1 for large text)
 *
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @returns Contrast ratio (1-21)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseHexColor(color1);
  const rgb2 = parseHexColor(color2);

  if (!rgb1 || !rgb2) {
    return 1; // Minimum contrast
  }

  const lum1 = calculateRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = calculateRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  // Contrast ratio formula: (lighter + 0.05) / (darker + 0.05)
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}
