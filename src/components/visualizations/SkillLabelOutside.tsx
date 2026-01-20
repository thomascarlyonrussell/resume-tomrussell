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
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const reducedMotionLabelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
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
  // Guard against NaN values
  const validX = isNaN(x) ? 0 : x;
  const validY = isNaN(y) ? 0 : y;
  const validRadius = isNaN(radius) || radius <= 0 ? 0 : radius;
  const validCenterX = isNaN(viewportCenter.x) ? 0 : viewportCenter.x;
  const validCenterY = isNaN(viewportCenter.y) ? 0 : viewportCenter.y;

  // Don't render if position is invalid
  if (validRadius === 0) {
    return null;
  }

  const displayText = truncateOutsideLabel(skill.name, 12);

  // Calculate label position
  const labelPos = calculateOutsideLabelPosition(
    validX,
    validY,
    validRadius,
    skillIndex,
    totalSmallSkills,
    { x: validCenterX, y: validCenterY }
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
      exit="exit"
      layout={!reducedMotion}
      layoutId={`label-${skill.id}`}
      aria-hidden="true"
    >
      {/* Connector line from circle edge to label */}
      <line
        x1={isNaN(labelPos.lineEndX) ? 0 : labelPos.lineEndX}
        y1={isNaN(labelPos.lineEndY) ? 0 : labelPos.lineEndY}
        x2={isNaN(labelPos.labelX) ? 0 : labelPos.labelX}
        y2={isNaN(labelPos.labelY) ? 0 : labelPos.labelY}
        stroke="var(--color-foreground)"
        strokeWidth={1.5}
        opacity={0.65}
        strokeDasharray="2,2"
        className="pointer-events-none"
      />

      {/* Label background box */}
      <rect
        x={isNaN(labelPos.labelX) ? 0 : labelPos.labelX - boxWidth / 2}
        y={isNaN(labelPos.labelY) ? 0 : labelPos.labelY - boxHeight / 2}
        width={boxWidth}
        height={boxHeight}
        rx={3}
        fill="var(--color-background)"
        fillOpacity={0.95}
        stroke="var(--color-foreground)"
        strokeWidth={0.75}
        className="pointer-events-none"
      />

      {/* Label text */}
      <text
        x={isNaN(labelPos.labelX) ? 0 : labelPos.labelX}
        y={isNaN(labelPos.labelY) ? 0 : labelPos.labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fill="var(--color-foreground)"
        className="pointer-events-none font-medium select-none"
      >
        {displayText}
      </text>
    </motion.g>
  );
}
