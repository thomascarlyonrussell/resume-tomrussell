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
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
      delay: delay * 0.03,
    },
  }),
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
  exit: {
    opacity: 0,
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
  const proficiencyText = skill.proficiency ? `${getProficiencyLabel(skill.proficiency)} level, ` : '';
  const ariaLabel = `${skill.name}: ${proficiencyText}${formatYearsOfExperience(skill.yearsOfExperience)} experience, ${skill.isActive ? 'currently active' : 'no longer active'}`;

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

  // Calculate visual effects
  const brightness = isHovered ? 1.15 : 1;
  const opacity = skill.isActive ? 1 : 0.75;
  const strokeWidth = isHovered ? 3 : 2;
  const dropShadow = isHovered ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' : 'none';

  // Calculate static z-index based on size and activity (larger, active skills on top)
  const baseZIndex = Math.round((size / 133.5) * 50) + (skill.isActive ? 10 : 0);
  const zIndex = isHovered ? 100 : baseZIndex;

  // Guard against NaN values
  const validX = isNaN(x) ? 0 : x;
  const validY = isNaN(y) ? 0 : y;
  const validRadius = isNaN(radius) || radius <= 0 ? 0 : radius;

  // Don't render if invalid
  if (validRadius === 0) {
    return null;
  }

  return (
    <motion.circle
      ref={ref}
      cx={validX}
      cy={validY}
      r={validRadius}
      fill={categoryColor}
      stroke="rgba(0, 0, 0, 0.4)"
      strokeWidth={strokeWidth}
      opacity={opacity}
      role="button"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      variants={reducedMotion ? reducedMotionVariants : nodeVariants}
      custom={animationDelay}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout={!reducedMotion}
      layoutId={skill.id}
      style={{
        cursor: 'pointer',
        outline: 'none',
        filter: reducedMotion ? undefined : `brightness(${brightness}) ${dropShadow}`,
        transformOrigin: `${x}px ${y}px`,
        zIndex,
      }}
      whileHover={reducedMotion ? undefined : { scale: 1.15, zIndex: 100 }}
      whileFocus={reducedMotion ? undefined : { scale: 1.15, zIndex: 100 }}
      transition={
        reducedMotion ? undefined : { type: 'spring' as const, stiffness: 400, damping: 25 }
      }
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
  // Guard against NaN values
  const validX = isNaN(x) ? 0 : x;
  const validY = isNaN(y) ? 0 : y;
  const validSize = isNaN(size) || size <= 0 ? 0 : size;

  if (!isVisible || validSize === 0) return null;

  return (
    <circle
      cx={validX}
      cy={validY}
      r={validSize / 2 + 3}
      fill="none"
      stroke="var(--color-foreground)"
      strokeWidth={2}
      strokeDasharray="4 2"
      style={{ pointerEvents: 'none' }}
    />
  );
}
