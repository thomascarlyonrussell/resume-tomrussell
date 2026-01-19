/**
 * SkillNode Component
 *
 * Renders an individual skill as a colored circle in the Fibonacci spiral.
 * Handles hover, focus, and click interactions with Framer Motion animations.
 */

'use client';

import { forwardRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ComputedSkill } from '@/data/types';
import { getCategoryColor } from '@/data/categories';
import { getProficiencyLabel, formatYearsOfExperience } from '@/lib/calculations';

export interface SkillNodeProps {
  skill: ComputedSkill;
  x: number;
  y: number;
  size: number;
  isHovered: boolean;
  animationDelay: number;
  reducedMotion: boolean;
  tabIndex: number;
  onHover: (hovering: boolean) => void;
  onFocus: (focused: boolean) => void;
  onClick: () => void;
}

// Animation variants
const nodeVariants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: (delay: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: delay * 0.03,
    },
  }),
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};

export const SkillNode = forwardRef<SVGCircleElement, SkillNodeProps>(function SkillNode(
  {
    skill,
    x,
    y,
    size,
    isHovered,
    animationDelay,
    reducedMotion,
    tabIndex,
    onHover,
    onFocus,
    onClick,
  },
  ref
) {
  const categoryColor = getCategoryColor(skill.category);
  const radius = size / 2;

  // Generate accessible label
  const ariaLabel = `${skill.name}: ${getProficiencyLabel(skill.proficiency)} level, ${formatYearsOfExperience(skill.yearsOfExperience)} experience, ${skill.isActive ? 'currently active' : 'no longer active'}`;

  const handleMouseEnter = useCallback(() => onHover(true), [onHover]);
  const handleMouseLeave = useCallback(() => onHover(false), [onHover]);
  const handleFocus = useCallback(() => onFocus(true), [onFocus]);
  const handleBlur = useCallback(() => onFocus(false), [onFocus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  // Calculate brightness for hover effect
  const brightness = isHovered ? 1.15 : 1;

  return (
    <motion.circle
      ref={ref}
      cx={x}
      cy={y}
      r={radius}
      fill={categoryColor}
      role="button"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      variants={reducedMotion ? reducedMotionVariants : nodeVariants}
      custom={animationDelay}
      initial="hidden"
      animate="visible"
      style={{
        cursor: 'pointer',
        outline: 'none',
        filter: reducedMotion ? undefined : `brightness(${brightness})`,
        transformOrigin: `${x}px ${y}px`,
      }}
      whileHover={reducedMotion ? undefined : { scale: 1.1 }}
      whileFocus={reducedMotion ? undefined : { scale: 1.1 }}
      transition={reducedMotion ? undefined : { type: 'spring', stiffness: 400, damping: 25 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    />
  );
});

// Focused ring component for accessibility
export function SkillNodeFocusRing({
  x,
  y,
  size,
  isVisible,
}: {
  x: number;
  y: number;
  size: number;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  return (
    <circle
      cx={x}
      cy={y}
      r={size / 2 + 3}
      fill="none"
      stroke="var(--color-foreground)"
      strokeWidth={2}
      strokeDasharray="4 2"
      style={{ pointerEvents: 'none' }}
    />
  );
}
