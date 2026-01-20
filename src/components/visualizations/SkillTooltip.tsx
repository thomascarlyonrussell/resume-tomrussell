/**
 * SkillTooltip Component
 *
 * Displays detailed information about a skill when hovering or focusing on it.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ComputedSkill } from '@/data/types';
import { getCategory } from '@/data/categories';
import { getProficiencyLabel, formatYearsOfExperience } from '@/lib/calculations';
import type { TooltipPosition } from './hooks/useSkillTooltip';

export interface SkillTooltipProps {
  skill: ComputedSkill | null;
  position: TooltipPosition | null;
  isVisible: boolean;
  reducedMotion?: boolean;
}

// Proficiency stars component
function ProficiencyStars({ level }: { level: number }) {
  // Map Fibonacci proficiency to 5-star scale
  const starMapping: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    5: 4,
    8: 5,
  };
  const stars = starMapping[level] || 1;

  return (
    <div className="flex gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-sm ${i <= stars ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
        >
          {i <= stars ? '\u2605' : '\u2606'}
        </span>
      ))}
    </div>
  );
}

export function SkillTooltip({
  skill,
  position,
  isVisible,
  reducedMotion = false,
}: SkillTooltipProps) {
  if (!skill || !position) return null;

  // Validate position coordinates to prevent NaN CSS values
  const validX = isNaN(position.x) ? 0 : position.x;
  const validY = isNaN(position.y) ? 0 : position.y;

  // Return null if position is invalid (both coordinates are 0 likely means uninitialized)
  if (validX === 0 && validY === 0) return null;

  const category = getCategory(skill.category);
  const proficiencyLabel = skill.proficiency ? getProficiencyLabel(skill.proficiency) : '';
  const experienceText = formatYearsOfExperience(skill.yearsOfExperience);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 4 }}
          transition={
            reducedMotion ? { duration: 0 } : { duration: 0.15, ease: 'easeOut' as const }
          }
          className="pointer-events-none absolute z-50"
          style={{
            left: validX,
            top: validY,
          }}
          role="tooltip"
          aria-live="polite"
        >
          <div className="max-w-[280px] min-w-[220px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            {/* Header: Name and Proficiency */}
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="truncate font-semibold text-gray-900 dark:text-gray-100">
                {skill.name}
              </span>
              {skill.proficiency && <ProficiencyStars level={skill.proficiency} />}
            </div>

            {/* Category breadcrumb */}
            <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              <span style={{ color: category?.color }} className="font-medium">
                {category?.name}
              </span>
              {' > '}
              <span>{skill.subcategory}</span>
            </div>

            {/* Description */}
            {skill.description && (
              <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {skill.description}
              </p>
            )}

            {/* Divider */}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

            {/* Stats bar */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">{experienceText}</span>
              <span className="text-gray-300 dark:text-gray-600">&bull;</span>
              <span>{proficiencyLabel}</span>
              <span className="text-gray-300 dark:text-gray-600">&bull;</span>
              <span
                className={
                  skill.isActive
                    ? 'font-medium text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                }
              >
                {skill.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
