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
// Minimum angle between skills (radians) - increased for better spacing
const MIN_ANGLE = Math.PI / 6;
// Padding between adjacent skills - increased for visual breathing room
const SKILL_PADDING = 16;

function roundCoordinate(value: number, precision = 3): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

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
 * Calculate angle increment to prevent skill overlap with lookback collision detection
 */
function calculateAngleIncrement(
  currentIndex: number,
  currentSize: number,
  nextSize: number,
  currentRadius: number,
  currentAngle: number,
  positions: Map<string, SpiralPosition>,
  sortedSkills: ComputedSkill[],
  sizeMultiplier: number
): number {
  // Arc length needed = sum of radii plus padding
  const currentPixelRadius = (currentSize * sizeMultiplier) / 2;
  const nextPixelRadius = (nextSize * sizeMultiplier) / 2;
  const baseMinArc = currentPixelRadius + nextPixelRadius + SKILL_PADDING;

  // Base angle from adjacent skill
  let requiredAngle = Math.max(MIN_ANGLE, baseMinArc / Math.max(currentRadius, 1));

  // Look back at recent skills within collision range
  const LOOKBACK_COUNT = Math.min(8, currentIndex); // Check last 8 skills
  const COLLISION_BUFFER = 1.3; // 30% safety buffer

  for (let i = currentIndex - 1; i >= currentIndex - LOOKBACK_COUNT; i--) {
    const prevSkill = sortedSkills[i];
    const prevPos = positions.get(prevSkill.id);
    if (!prevPos) continue;

    // Only check if radii are close (within 50% difference)
    const radiusRatio =
      Math.abs(prevPos.radius - currentRadius) / Math.max(prevPos.radius, currentRadius);
    if (radiusRatio > 0.5) continue;

    // Calculate distance needed to avoid collision
    const prevPixelRadius = (prevSkill.fibonacciSize * sizeMultiplier) / 2;
    const minDistance = (currentPixelRadius + prevPixelRadius) * COLLISION_BUFFER + SKILL_PADDING;

    // Calculate angular distance needed at current radius
    const neededAngle = minDistance / currentRadius;
    const angleDiff = currentAngle + requiredAngle - prevPos.angle;

    // If collision detected, increase angle
    if (angleDiff < neededAngle) {
      const angleAdjustment = neededAngle - angleDiff;
      requiredAngle = Math.max(requiredAngle, requiredAngle + angleAdjustment);
    }
  }

  return requiredAngle;
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

    // Sort skills by fibonacciSize ascending (smallest at center, largest on outskirts)
    // This ensures visual size matches spatial positioning in the spiral
    const sortedSkills = [...skills].sort((a, b) => {
      return a.fibonacciSize - b.fibonacciSize;
    });

    // Initial calculation with a base center
    const centerX = 0;
    const centerY = 0;

    // Calculate positions along the spiral
    const positions = new Map<string, SpiralPosition>();
    let currentAngle = 0;

    // Initial radius - start small so largest skill is near center
    // Use Math.max to ensure we never have a 0 radius (which would keep everything at origin)
    const baseInitialRadius = sortedSkills[0].fibonacciSize * sizeMultiplier * 0.5;
    const initialRadius = Math.max(baseInitialRadius, sizeMultiplier * 2); // Minimum of 2x the size multiplier

    for (let i = 0; i < sortedSkills.length; i++) {
      const skill = sortedSkills[i];
      const point = calculateSpiralPoint(currentAngle, initialRadius, centerX, centerY);

      positions.set(skill.id, {
        x: roundCoordinate(point.x),
        y: roundCoordinate(point.y),
        radius: roundCoordinate(point.radius),
        angle: roundCoordinate(currentAngle, 6),
      });

      // Calculate angle for next skill
      if (i < sortedSkills.length - 1) {
        const nextSkill = sortedSkills[i + 1];
        currentAngle += calculateAngleIncrement(
          i, // current index
          skill.fibonacciSize,
          nextSkill.fibonacciSize,
          point.radius,
          currentAngle, // current angle
          positions, // positions map
          sortedSkills, // sorted skills array
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
    const fitScale = Math.min(
      availableWidth / Math.max(rawWidth, 1),
      availableHeight / Math.max(rawHeight, 1)
    );
    const MAX_UPSCALE = 1.75;
    const scale = Math.min(fitScale, MAX_UPSCALE);

    // Calculate offset to center the visualization
    const scaledWidth = rawWidth * scale;
    const scaledHeight = rawHeight * scale;
    const offsetX = (width - scaledWidth) / 2 - rawBounds.minX * scale;
    const offsetY = (height - scaledHeight) / 2 - rawBounds.minY * scale;

    // Apply scale and offset to all positions
    for (const [id, pos] of positions) {
      positions.set(id, {
        ...pos,
        x: roundCoordinate(pos.x * scale + offsetX),
        y: roundCoordinate(pos.y * scale + offsetY),
        radius: roundCoordinate(pos.radius * scale),
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
