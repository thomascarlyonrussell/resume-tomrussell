/**
 * useFibonacciLayout Hook
 *
 * Calculates positions for skills along a golden spiral pattern.
 * Skills are sorted by size (largest at center) and positioned to avoid overlap.
 */

'use client';

import { useMemo } from 'react';
import type { ComputedSkill } from '@/data/types';

export interface SpiralPosition {
  x: number;
  y: number;
  radius: number;
  angle: number;
}

export interface FibonacciLayoutOptions {
  skills: ComputedSkill[];
  width: number;
  height: number;
  padding?: number;
  sizeMultiplier?: number;
}

export interface FibonacciLayoutResult {
  positions: Map<string, SpiralPosition>;
  sortedSkills: ComputedSkill[];
  center: { x: number; y: number };
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

// Golden ratio constant
const PHI = (1 + Math.sqrt(5)) / 2;
// Spiral growth factor based on golden ratio
const SPIRAL_B = Math.log(PHI) / (Math.PI / 2);
// Minimum angle between skills (radians)
const MIN_ANGLE = Math.PI / 12;
// Padding between adjacent skills
const SKILL_PADDING = 4;

/**
 * Calculate position on a logarithmic spiral
 */
function calculateSpiralPoint(
  angle: number,
  initialRadius: number,
  centerX: number,
  centerY: number
): { x: number; y: number; radius: number } {
  const radius = initialRadius * Math.exp(SPIRAL_B * angle);
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
    radius,
  };
}

/**
 * Calculate angle increment to prevent skill overlap
 */
function calculateAngleIncrement(
  currentSize: number,
  nextSize: number,
  currentRadius: number,
  sizeMultiplier: number
): number {
  // Arc length needed = sum of radii plus padding
  const currentPixelRadius = (currentSize * sizeMultiplier) / 2;
  const nextPixelRadius = (nextSize * sizeMultiplier) / 2;
  const minArc = currentPixelRadius + nextPixelRadius + SKILL_PADDING;

  // angle = arc / radius (for the arc length formula)
  // Use a minimum to ensure we don't get stuck
  const calculatedAngle = minArc / Math.max(currentRadius, 1);
  return Math.max(MIN_ANGLE, calculatedAngle);
}

/**
 * Calculate bounds of all positions
 */
function calculateBounds(
  positions: Map<string, SpiralPosition>,
  skills: ComputedSkill[],
  sizeMultiplier: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const skill of skills) {
    const pos = positions.get(skill.id);
    if (!pos) continue;

    const pixelRadius = (skill.fibonacciSize * sizeMultiplier) / 2;
    minX = Math.min(minX, pos.x - pixelRadius);
    maxX = Math.max(maxX, pos.x + pixelRadius);
    minY = Math.min(minY, pos.y - pixelRadius);
    maxY = Math.max(maxY, pos.y + pixelRadius);
  }

  return { minX, maxX, minY, maxY };
}

export function useFibonacciLayout(options: FibonacciLayoutOptions): FibonacciLayoutResult {
  const { skills, width, height, padding = 40, sizeMultiplier = 3 } = options;

  return useMemo(() => {
    if (skills.length === 0 || width <= 0 || height <= 0) {
      return {
        positions: new Map(),
        sortedSkills: [],
        center: { x: width / 2, y: height / 2 },
        bounds: { minX: 0, maxX: width, minY: 0, maxY: height },
      };
    }

    // Sort skills by fibonacciSize descending (largest at center)
    const sortedSkills = [...skills].sort((a, b) => b.fibonacciSize - a.fibonacciSize);

    // Initial calculation with a base center
    const centerX = 0;
    const centerY = 0;

    // Calculate positions along the spiral
    const positions = new Map<string, SpiralPosition>();
    let currentAngle = 0;

    // Initial radius - start small so largest skill is near center
    const initialRadius = sortedSkills[0].fibonacciSize * sizeMultiplier * 0.5;

    for (let i = 0; i < sortedSkills.length; i++) {
      const skill = sortedSkills[i];
      const point = calculateSpiralPoint(currentAngle, initialRadius, centerX, centerY);

      positions.set(skill.id, {
        x: point.x,
        y: point.y,
        radius: point.radius,
        angle: currentAngle,
      });

      // Calculate angle for next skill
      if (i < sortedSkills.length - 1) {
        const nextSkill = sortedSkills[i + 1];
        currentAngle += calculateAngleIncrement(
          skill.fibonacciSize,
          nextSkill.fibonacciSize,
          point.radius,
          sizeMultiplier
        );
      }
    }

    // Calculate bounds of the raw positions
    const rawBounds = calculateBounds(positions, sortedSkills, sizeMultiplier);
    const rawWidth = rawBounds.maxX - rawBounds.minX;
    const rawHeight = rawBounds.maxY - rawBounds.minY;

    // Calculate scale to fit within viewport
    const availableWidth = width - 2 * padding;
    const availableHeight = height - 2 * padding;
    const scale = Math.min(
      availableWidth / Math.max(rawWidth, 1),
      availableHeight / Math.max(rawHeight, 1),
      1 // Don't scale up if already fits
    );

    // Calculate offset to center the visualization
    const scaledWidth = rawWidth * scale;
    const scaledHeight = rawHeight * scale;
    const offsetX = (width - scaledWidth) / 2 - rawBounds.minX * scale;
    const offsetY = (height - scaledHeight) / 2 - rawBounds.minY * scale;

    // Apply scale and offset to all positions
    for (const [id, pos] of positions) {
      positions.set(id, {
        ...pos,
        x: pos.x * scale + offsetX,
        y: pos.y * scale + offsetY,
        radius: pos.radius * scale,
      });
    }

    // Calculate final bounds
    const finalBounds = calculateBounds(positions, sortedSkills, sizeMultiplier * scale);

    return {
      positions,
      sortedSkills,
      center: { x: width / 2, y: height / 2 },
      bounds: finalBounds,
    };
  }, [skills, width, height, padding, sizeMultiplier]);
}
