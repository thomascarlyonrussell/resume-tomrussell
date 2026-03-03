/**
 * useFibonacciLayout Hook
 *
 * Calculates positions for skills along a golden spiral pattern.
 * Uses d3-force for mathematically correct collision detection:
 * skills start at their ideal spiral positions then a force simulation
 * resolves any overlaps while preserving the radial structure.
 */

'use client';

import { useMemo } from 'react';
import {
  forceSimulation,
  forceCollide,
  forceRadial,
  type SimulationNodeDatum,
} from 'd3-force';
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
  /** sizeMultiplier × viewport scale — use this for all rendered circle sizes */
  effectiveSizeMultiplier: number;
}

// Golden ratio constants
const PHI = (1 + Math.sqrt(5)) / 2;
const SPIRAL_B = Math.log(PHI) / (Math.PI / 2);
// Gap between circle edges after collision resolution
const SKILL_PADDING = 8;
// d3-force simulation ticks — enough for convergence without blocking the thread
const SIMULATION_TICKS = 300;
// Strength of the radial force keeping nodes near their target spiral radius
const RADIAL_STRENGTH = 0.4;

interface SpiralNode extends SimulationNodeDatum {
  id: string;
  /** Target radius from origin on the spiral */
  targetRadius: number;
  /** Pixel radius of the circle */
  circleRadius: number;
  /** Angle on the spiral (preserved for the return value) */
  spiralAngle: number;
}

function roundCoordinate(value: number, precision = 3): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/** Place a node at angle+radius on a logarithmic spiral centered at (0,0). */
function spiralPoint(
  angle: number,
  initialRadius: number
): { x: number; y: number; radius: number } {
  const radius = initialRadius * Math.exp(SPIRAL_B * angle);
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), radius };
}

/**
 * Calculate spiral angle increment so successive nodes have breathing room.
 * This is a simple arc-length estimate; d3-force resolves any remaining overlap.
 */
function spiralAngleIncrement(
  currentRadius: number,
  currentCircleR: number,
  nextCircleR: number
): number {
  const minArc = currentCircleR + nextCircleR + SKILL_PADDING;
  // At least PI/8 to keep spiral visually open
  return Math.max(Math.PI / 8, minArc / Math.max(currentRadius, 1));
}

function calculateBounds(
  positions: Map<string, SpiralPosition>,
  skills: ComputedSkill[],
  sizeMultiplier: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (const skill of skills) {
    const pos = positions.get(skill.id);
    if (!pos) continue;
    const r = (skill.fibonacciSize * sizeMultiplier) / 2;
    minX = Math.min(minX, pos.x - r);
    maxX = Math.max(maxX, pos.x + r);
    minY = Math.min(minY, pos.y - r);
    maxY = Math.max(maxY, pos.y + r);
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
        effectiveSizeMultiplier: sizeMultiplier,
      };
    }

    // Sort skills ascending by size (smallest at centre of spiral)
    const sortedSkills = [...skills].sort((a, b) => a.fibonacciSize - b.fibonacciSize);

    // ── Step 1: Assign initial spiral positions ──────────────────────────────
    const baseInitialRadius = Math.max(
      sortedSkills[0].fibonacciSize * sizeMultiplier * 0.5,
      sizeMultiplier * 2
    );

    const nodes: SpiralNode[] = [];
    let angle = 0;

    for (let i = 0; i < sortedSkills.length; i++) {
      const skill = sortedSkills[i];
      const circleRadius = (skill.fibonacciSize * sizeMultiplier) / 2;
      const pt = spiralPoint(angle, baseInitialRadius);

      nodes.push({
        id: skill.id,
        x: pt.x,
        y: pt.y,
        targetRadius: pt.radius,
        circleRadius,
        spiralAngle: angle,
      });

      if (i < sortedSkills.length - 1) {
        const nextCircleR = (sortedSkills[i + 1].fibonacciSize * sizeMultiplier) / 2;
        angle += spiralAngleIncrement(pt.radius, circleRadius, nextCircleR);
      }
    }

    // ── Step 2: d3-force simulation ──────────────────────────────────────────
    // forceCollide ensures no two circles overlap (quadtree-based, exact).
    // forceRadial keeps each node near its spiral radius, preserving the
    // outward growth pattern without freezing positions angularly.
    const simulation = forceSimulation<SpiralNode>(nodes)
      .force(
        'collide',
        forceCollide<SpiralNode>((d) => d.circleRadius + SKILL_PADDING / 2).iterations(3)
      )
      .force(
        'radial',
        forceRadial<SpiralNode>((d) => d.targetRadius, 0, 0).strength(RADIAL_STRENGTH)
      )
      .stop();

    // Run synchronously until convergence
    for (let i = 0; i < SIMULATION_TICKS; i++) {
      simulation.tick();
    }

    // ── Step 3: Build positions map from settled nodes ───────────────────────
    const rawPositions = new Map<string, SpiralPosition>();
    for (const node of nodes) {
      const r = Math.sqrt((node.x ?? 0) ** 2 + (node.y ?? 0) ** 2);
      rawPositions.set(node.id, {
        x: roundCoordinate(node.x ?? 0),
        y: roundCoordinate(node.y ?? 0),
        radius: roundCoordinate(r),
        angle: roundCoordinate(node.spiralAngle, 6),
      });
    }

    // ── Step 4: Scale & center to viewport ───────────────────────────────────
    const rawBounds = calculateBounds(rawPositions, sortedSkills, sizeMultiplier);
    const rawW = rawBounds.maxX - rawBounds.minX;
    const rawH = rawBounds.maxY - rawBounds.minY;

    const available = Math.min(width - 2 * padding, height - 2 * padding);
    const fitScale = available / Math.max(rawW, rawH, 1);
    const scale = Math.min(fitScale, 1.75);

    const scaledW = rawW * scale;
    const scaledH = rawH * scale;
    const offsetX = (width - scaledW) / 2 - rawBounds.minX * scale;
    const offsetY = (height - scaledH) / 2 - rawBounds.minY * scale;

    const positions = new Map<string, SpiralPosition>();
    for (const [id, pos] of rawPositions) {
      positions.set(id, {
        ...pos,
        x: roundCoordinate(pos.x * scale + offsetX),
        y: roundCoordinate(pos.y * scale + offsetY),
        radius: roundCoordinate(pos.radius * scale),
      });
    }

    return {
      positions,
      sortedSkills,
      center: { x: width / 2, y: height / 2 },
      bounds: calculateBounds(positions, sortedSkills, sizeMultiplier * scale),
      effectiveSizeMultiplier: sizeMultiplier * scale,
    };
  }, [skills, width, height, padding, sizeMultiplier]);
}
