/**
 * SkillLabelInside Component
 *
 * Renders skill label text inside large circles with proper contrast and sizing
 */

'use client';

import { motion } from 'framer-motion';
import type { ComputedSkill } from '@/data/types';
import { getCategoryColor } from '@/data/categories';
import { getContrastingTextColor } from './utils/textContrast';
import { calculateFontSize, truncateForCircle } from './utils/labelPositioning';

export interface SkillLabelInsideProps {
  skill: ComputedSkill;
  x: number;
  y: number;
  radius: number;
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

export function SkillLabelInside({
  skill,
  x,
  y,
  radius,
  animationDelay,
  reducedMotion,
}: SkillLabelInsideProps) {
  // Guard against NaN values
  const validX = isNaN(x) ? 0 : x;
  const validY = isNaN(y) ? 0 : y;
  const validRadius = isNaN(radius) || radius <= 0 ? 0 : radius;

  // Don't render if position is invalid
  if (validRadius === 0) {
    return null;
  }

  const categoryColor = getCategoryColor(skill.category);
  const textColor = getContrastingTextColor(categoryColor);
  const fontSize = calculateFontSize(validRadius);
  const displayText = truncateForCircle(skill.name, validRadius);

  return (
    <motion.text
      x={validX}
      y={validY}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={fontSize}
      fill={textColor}
      className="pointer-events-none font-medium select-none"
      style={{
        paintOrder: 'stroke fill',
        stroke: 'rgba(0, 0, 0, 0.3)',
        strokeWidth: 0.5,
        strokeLinejoin: 'round',
      }}
      variants={reducedMotion ? reducedMotionLabelVariants : labelVariants}
      custom={animationDelay}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout={!reducedMotion}
      layoutId={`label-${skill.id}`}
      aria-hidden="true"
    >
      {displayText}
    </motion.text>
  );
}
