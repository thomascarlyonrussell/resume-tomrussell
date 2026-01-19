/**
 * ExperienceCard Component
 *
 * Displays a single work experience entry in the timeline.
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Experience } from '@/data/types';
import { useReducedMotion } from '@/components/visualizations/hooks';

export interface ExperienceCardProps {
  experience: Experience;
  animationDelay?: number;
}

function formatDateRange(startDate: string, endDate?: string | null): string {
  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} - ${end}`;
}

function calculateDuration(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate + '-01');
  const end = endDate ? new Date(endDate + '-01') : new Date();

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} mo`;
  } else if (remainingMonths === 0) {
    return `${years} yr${years > 1 ? 's' : ''}`;
  } else {
    return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo`;
  }
}

export function ExperienceCard({ experience, animationDelay = 0 }: ExperienceCardProps) {
  const [showHighlights, setShowHighlights] = useState(false);
  const reducedMotion = useReducedMotion();
  const hasHighlights = experience.highlights && experience.highlights.length > 0;
  const isCurrent = !experience.endDate;

  return (
    <motion.article
      className="relative pl-8 pb-8 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: reducedMotion ? 0.01 : 0.5,
        delay: reducedMotion ? 0 : animationDelay * 0.1,
      }}
    >
      {/* Timeline line */}
      <div
        className="absolute left-[5px] top-3 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
        aria-hidden="true"
      />

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-2 h-3 w-3 rounded-full border-2 ${
          isCurrent
            ? 'border-[var(--color-engineering)] bg-[var(--color-engineering)]'
            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900'
        }`}
        aria-hidden="true"
      >
        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--color-engineering)]"
            animate={reducedMotion ? {} : { scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">{experience.title}</h3>
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              {experience.company}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-[var(--color-muted)]">
              {formatDateRange(experience.startDate, experience.endDate)}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {calculateDuration(experience.startDate, experience.endDate)}
            </span>
          </div>
        </div>

        {/* Location */}
        {experience.location && (
          <p className="mb-2 text-sm text-[var(--color-muted)]">{experience.location}</p>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          {experience.description}
        </p>

        {/* Highlights Toggle */}
        {hasHighlights && (
          <div className="mt-3">
            <button
              onClick={() => setShowHighlights(!showHighlights)}
              className="text-sm font-medium text-[var(--color-engineering)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-engineering)] focus-visible:ring-offset-2 rounded"
              aria-expanded={showHighlights}
            >
              {showHighlights ? 'Hide highlights' : `Show ${experience.highlights!.length} highlights`}
            </button>

            <AnimatePresence>
              {showHighlights && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
                  className="mt-2 space-y-1 overflow-hidden"
                >
                  {experience.highlights!.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-ai-automation)]" aria-hidden="true" />
                      {highlight}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.article>
  );
}
