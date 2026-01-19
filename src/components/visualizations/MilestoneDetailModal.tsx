/**
 * MilestoneDetailModal Component
 *
 * Displays detailed information about a selected milestone in a modal dialog.
 * Shown when user clicks a milestone in the Timeline view.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Milestone } from '@/data/types';
import { skills } from '@/data/skills';
import { categoryMap } from '@/data/categories';
import { XMarkIcon, CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline';

export interface MilestoneDetailModalProps {
  milestone: Milestone | null;
  onClose: () => void;
}

export function MilestoneDetailModal({ milestone, onClose }: MilestoneDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (milestone) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [milestone, onClose]);

  // Get related skills
  const relatedSkills = milestone?.skillIds
    ? skills.filter((skill) => milestone.skillIds?.includes(skill.id))
    : [];

  // Format date
  const formattedDate = milestone
    ? new Date(milestone.date + '-01').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : '';

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="milestone-detail-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-gradient-to-r from-[var(--color-engineering)] to-[var(--color-software-development)] p-6 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-8">
                  <div className="mb-2 flex items-center gap-2">
                    <SparklesIcon className="h-6 w-6 text-white" />
                    <span className="text-sm font-medium text-white/80">Career Milestone</span>
                  </div>
                  <h2 id="milestone-detail-title" className="text-2xl font-bold text-white">
                    {milestone.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-white/90">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Description */}
              {milestone.description && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    About This Milestone
                  </h3>
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {milestone.description}
                  </p>
                </div>
              )}

              {/* Related Skills */}
              {relatedSkills.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Key Skills Involved
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {relatedSkills.map((skill) => {
                      const category = categoryMap[skill.category];
                      return (
                        <div
                          key={skill.id}
                          className="rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {skill.name}
                              </div>
                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {skill.subcategory}
                              </div>
                            </div>
                            <span
                              className="h-3 w-3 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: category.color }}
                              title={category.name}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Impact Section */}
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <p className="text-sm text-gray-600 italic dark:text-gray-400">
                  This milestone represents a significant achievement in Tom&apos;s career,
                  contributing to his expertise in{' '}
                  {relatedSkills.length > 0
                    ? relatedSkills
                        .slice(0, 3)
                        .map((s) => s.name)
                        .join(', ')
                    : 'multiple technical domains'}
                  .
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-gradient-to-r from-[var(--color-engineering)] to-[var(--color-software-development)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
