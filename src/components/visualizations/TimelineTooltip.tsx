/**
 * TimelineTooltip Component
 *
 * Custom tooltip for the timeline stacked area chart.
 * Shows date, category breakdown, active skills, and nearby milestones.
 */

'use client';

import { motion } from 'framer-motion';
import { getSkillsAtDate, getMilestonesNearDate } from '@/data';
import { categories, categoryMap } from '@/data/categories';
import { useReducedMotion } from './hooks';

interface TimelineTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      year: number;
      [key: string]: unknown;
    };
    value?: number;
    dataKey?: string;
    color?: string;
  }>;
  label?: string;
}

export function TimelineTooltip({ active, payload }: TimelineTooltipProps) {
  const reducedMotion = useReducedMotion();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Get the date from the first payload item
  const dataPoint = payload[0]?.payload;
  const dateStr = dataPoint?.date as string;
  const year = dataPoint?.year as number;

  if (!dateStr) return null;

  // Get skills and milestones for this date
  const activeSkills = getSkillsAtDate(dateStr);
  const nearbyMilestones = getMilestonesNearDate(dateStr, 2);

  // Calculate total
  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.15 }}
      className="max-w-xs rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      data-testid="timeline-tooltip"
    >
      {/* Date Header */}
      <div className="mb-2 border-b border-gray-200 pb-2 dark:border-gray-700">
        <p className="text-sm font-semibold">{year}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{total} active skills</p>
      </div>

      {/* Category Breakdown */}
      <div className="mb-2 space-y-1">
        {categories.map((category) => {
          const count = dataPoint?.[category.id] as number;
          if (!count || count === 0) return null;

          return (
            <div key={category.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
              </div>
              <span className="font-medium">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Skills Preview (show top 5) */}
      {activeSkills.length > 0 && (
        <div className="mb-2 border-t border-gray-200 pt-2 dark:border-gray-700">
          <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Top Skills:</p>
          <div className="flex flex-wrap gap-1">
            {activeSkills.slice(0, 5).map((skill) => (
              <span
                key={skill.skillId}
                className="inline-flex items-center rounded px-1.5 py-0.5 text-xs"
                style={{
                  backgroundColor: `${categoryMap[skill.category].color}20`,
                  color: categoryMap[skill.category].color,
                }}
              >
                {skill.skillName}
              </span>
            ))}
            {activeSkills.length > 5 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{activeSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Nearby Milestones */}
      {nearbyMilestones.length > 0 && (
        <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
          <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">Milestones:</p>
          {nearbyMilestones.map((milestone) => (
            <div key={milestone.id} className="flex items-start gap-1.5 text-xs">
              <span className="mt-1 text-[var(--color-engineering)]">★</span>
              <span className="text-gray-700 dark:text-gray-300">{milestone.title}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
