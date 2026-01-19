/**
 * MilestoneMarker Component
 *
 * Renders milestone markers on the timeline chart.
 * Used as a custom reference element in Recharts.
 */

'use client';

import { motion } from 'framer-motion';
import type { Milestone } from '@/data/types';
import { useReducedMotion } from './hooks';

export interface MilestoneMarkerProps {
  milestone: Milestone;
  x: number;
  y: number;
  index: number;
  onHover?: (milestone: Milestone | null) => void;
}

export function MilestoneMarker({
  milestone,
  x,
  y,
  index,
  onHover,
}: MilestoneMarkerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.3,
        delay: reducedMotion ? 0 : index * 0.05 + 0.5, // Delay after chart animation
      }}
      onMouseEnter={() => onHover?.(milestone)}
      onMouseLeave={() => onHover?.(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* Diamond marker */}
      <motion.polygon
        points={`${x},${y - 6} ${x + 6},${y} ${x},${y + 6} ${x - 6},${y}`}
        fill="var(--color-engineering)"
        stroke="white"
        strokeWidth={2}
        whileHover={reducedMotion ? {} : { scale: 1.3 }}
      />
      {/* Vertical line to bottom */}
      <line
        x1={x}
        y1={y + 6}
        x2={x}
        y2={y + 30}
        stroke="var(--color-engineering)"
        strokeWidth={1}
        strokeDasharray="2,2"
        opacity={0.5}
      />
    </motion.g>
  );
}

/**
 * MilestoneLabel Component
 *
 * Shows milestone name on hover.
 */
export interface MilestoneLabelProps {
  milestone: Milestone;
  x: number;
  y: number;
}

export function MilestoneLabel({ milestone, x, y }: MilestoneLabelProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.g
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.15 }}
    >
      {/* Background */}
      <rect
        x={x - 60}
        y={y - 35}
        width={120}
        height={24}
        rx={4}
        fill="var(--color-background)"
        stroke="var(--color-engineering)"
        strokeWidth={1}
      />
      {/* Text */}
      <text
        x={x}
        y={y - 20}
        textAnchor="middle"
        fontSize={10}
        fill="var(--color-foreground)"
        className="font-medium"
      >
        {milestone.title.length > 20
          ? milestone.title.substring(0, 18) + '...'
          : milestone.title}
      </text>
    </motion.g>
  );
}
