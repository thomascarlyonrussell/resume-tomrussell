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
};

const reducedMotionLabelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

export function SkillLabelInside({
  skill,
  x,
  y,
  radius,
  animationDelay,
  reducedMotion,
}: SkillLabelInsideProps) {
  const categoryColor = getCategoryColor(skill.category);
  const textColor = getContrastingTextColor(categoryColor);
  const fontSize = calculateFontSize(radius);
  const displayText = truncateForCircle(skill.name, radius);

  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={fontSize}
      fill={textColor}
      className="pointer-events-none select-none font-medium"
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
      aria-hidden="true"
    >
      {displayText}
    </motion.text>
  );
}
