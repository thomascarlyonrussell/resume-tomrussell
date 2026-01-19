/**
 * SkillLabelOutside Component
 *
 * Renders skill label outside medium circles with connector lines and background box
 */

'use client';

import { motion } from 'framer-motion';
import type { ComputedSkill } from '@/data/types';
import { calculateOutsideLabelPosition, truncateOutsideLabel } from './utils/labelPositioning';

export interface SkillLabelOutsideProps {
  skill: ComputedSkill;
  x: number;
  y: number;
  radius: number;
  skillIndex: number;
  totalSmallSkills: number;
  viewportCenter: { x: number; y: number };
  animationDelay: number;
  reducedMotion: boolean;
}

// Animation variants
const labelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 20,
      delay: delay * 0.03 + 0.1, // Slightly after circle appears
    },
  }),
};

const reducedMotionLabelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

export function SkillLabelOutside({
  skill,
  x,
  y,
  radius,
  skillIndex,
  totalSmallSkills,
  viewportCenter,
  animationDelay,
  reducedMotion,
}: SkillLabelOutsideProps) {
  const displayText = truncateOutsideLabel(skill.name, 12);

  // Calculate label position
  const labelPos = calculateOutsideLabelPosition(
    x,
    y,
    radius,
    skillIndex,
    totalSmallSkills,
    viewportCenter
  );

  // Estimate label box size
  const labelPadding = 4;
  const estimatedTextWidth = displayText.length * 5.5; // Approximate width at 9px font
  const boxWidth = Math.min(estimatedTextWidth + labelPadding * 2, 100);
  const boxHeight = 18;

  return (
    <motion.g
      variants={reducedMotion ? reducedMotionLabelVariants : labelVariants}
      custom={animationDelay}
      initial="hidden"
      animate="visible"
      aria-hidden="true"
    >
      {/* Connector line from circle to label */}
      <line
        x1={x}
        y1={y}
        x2={labelPos.lineEndX}
        y2={labelPos.lineEndY}
        stroke="var(--color-foreground)"
        strokeWidth={1}
        opacity={0.4}
        strokeDasharray="2,2"
        className="pointer-events-none"
      />

      {/* Label background box */}
      <rect
        x={labelPos.labelX - boxWidth / 2}
        y={labelPos.labelY - boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        rx={3}
        fill="var(--color-background)"
        fillOpacity={0.95}
        stroke="var(--color-foreground)"
        strokeWidth={0.5}
        className="pointer-events-none"
      />

      {/* Label text */}
      <text
        x={labelPos.labelX}
        y={labelPos.labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={9}
        fill="var(--color-foreground)"
        className="pointer-events-none font-medium select-none"
      >
        {displayText}
      </text>
    </motion.g>
  );
}
