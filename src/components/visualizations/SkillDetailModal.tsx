/**
 * SkillDetailModal Component
 *
 * Displays detailed information about a selected skill in a modal dialog.
 * Shown when user clicks/taps a skill in the Fibonacci spiral.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ComputedSkill } from '@/data/types';
import { categoryMap } from '@/data/categories';
import { experience } from '@/data/experience';
import { milestones } from '@/data/milestones';
import { getProficiencyLabel, formatYearsOfExperience } from '@/lib/calculations';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface SkillDetailModalProps {
  skill: ComputedSkill | null;
  onClose: () => void;
}

export function SkillDetailModal({ skill, onClose }: SkillDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (skill) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [skill, onClose]);

  // Get related experience roles
  const relatedExperience = skill
    ? experience.filter((exp) => exp.skillIds?.includes(skill.id))
    : [];

  // Get related milestones
  const relatedMilestones = skill
    ? milestones.filter((milestone) => milestone.skillIds?.includes(skill.id))
    : [];

  const category = skill ? categoryMap[skill.category] : null;
  const proficiencyLabel = skill && skill.proficiency ? getProficiencyLabel(skill.proficiency) : '';
  const yearsText = skill ? formatYearsOfExperience(skill.yearsOfExperience) : '';

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
      {skill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-detail-title"
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
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex-1 pr-8">
                <h2
                  id="skill-detail-title"
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {skill.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${category?.color}20`,
                      color: category?.color,
                    }}
                  >
                    {category?.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.subcategory}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Proficiency & Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Proficiency Level
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${((skill.proficiency || 0) / 8) * 100}%`,
                          backgroundColor: category?.color,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {proficiencyLabel}
                    </span>
                  </div>
                  {skill.proficiency && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {skill.proficiency} / 8
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Experience
                  </h3>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{yearsText}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {skill.startDate} - {skill.endDate || 'Present'}
                  </p>
                  {!skill.isActive && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      Past skill
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {skill.description && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {skill.description}
                  </p>
                </div>
              )}

              {/* Related Experience */}
              {relatedExperience.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Used in Roles
                  </h3>
                  <div className="space-y-3">
                    {relatedExperience.map((exp) => (
                      <div
                        key={exp.id}
                        className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{exp.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {exp.company} • {exp.startDate} - {exp.endDate || 'Present'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Milestones */}
              {relatedMilestones.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Related Milestones
                  </h3>
                  <div className="space-y-3">
                    {relatedMilestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {milestone.title}
                        </div>
                        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                          {milestone.date}
                        </div>
                        {milestone.description && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
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
