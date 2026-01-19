/**
 * Legend Component
 *
 * Displays category colors and optional size scale explanation.
 * Collapsible on mobile for space efficiency.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '@/data/categories';
import type { CategoryId } from '@/data/types';

export interface LegendProps {
  showSizeScale?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  reducedMotion?: boolean;
  selectedCategoryFilter?: CategoryId | null;
  onCategoryToggle?: (categoryId: CategoryId) => void;
  skillCounts?: Record<CategoryId, number>;
}

// Position styles mapping
const positionStyles: Record<NonNullable<LegendProps['position']>, string> = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export function Legend({
  showSizeScale = true,
  position = 'bottom-left',
  className = '',
  reducedMotion = false,
  selectedCategoryFilter,
  onCategoryToggle,
  skillCounts,
}: LegendProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Handle category click
  const handleCategoryClick = useCallback(
    (categoryId: CategoryId) => {
      onCategoryToggle?.(categoryId);
    },
    [onCategoryToggle]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const maxIndex = categories.length - 1;
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
          break;

        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;

        case 'End':
          e.preventDefault();
          nextIndex = maxIndex;
          break;

        case 'Escape':
          e.preventDefault();
          if (selectedCategoryFilter) {
            onCategoryToggle?.(selectedCategoryFilter);
          }
          return;

        default:
          return;
      }

      setFocusedIndex(nextIndex);
      const nextCategory = categories[nextIndex];
      buttonRefs.current.get(nextCategory.id)?.focus();
    },
    [selectedCategoryFilter, onCategoryToggle]
  );

  // Announce filter changes to screen readers
  useEffect(() => {
    if (!liveRegionRef.current) return;

    if (selectedCategoryFilter) {
      const category = categories.find((c) => c.id === selectedCategoryFilter);
      const count = skillCounts?.[selectedCategoryFilter] || 0;
      liveRegionRef.current.textContent = `Filtered to ${category?.name}, showing ${count} skills`;
    } else {
      liveRegionRef.current.textContent = 'Showing all skills';
    }
  }, [selectedCategoryFilter, skillCounts]);

  return (
    <div
      className={`absolute ${positionStyles[position]} z-40 ${className}`}
      role="region"
      aria-label="Visualization legend"
    >
      <div className="max-w-[200px] rounded-lg border border-gray-200 bg-white/95 p-3 shadow-md backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
        {/* Header with collapse toggle */}
        <button
          className="flex w-full items-center justify-between text-left md:cursor-default"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          aria-controls="legend-content"
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Legend</span>
          <span className="text-xs text-gray-400 md:hidden">
            {isCollapsed ? '\u25BC' : '\u25B2'}
          </span>
        </button>

        {/* Collapsible content */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              id="legend-content"
              initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className="overflow-hidden"
            >
              {/* Category colors */}
              <div
                className="mt-2 space-y-1.5"
                role="radiogroup"
                aria-label="Category filters"
              >
                {categories.map((category, index) => {
                  const isSelected = selectedCategoryFilter === category.id;
                  const isOtherSelected =
                    selectedCategoryFilter && selectedCategoryFilter !== category.id;
                  const count = skillCounts?.[category.id] || 0;

                  return (
                    <button
                      key={category.id}
                      ref={(el) => {
                        if (el) {
                          buttonRefs.current.set(category.id, el);
                        } else {
                          buttonRefs.current.delete(category.id);
                        }
                      }}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Filter by ${category.name}, ${count} skills`}
                      className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-all ${
                        isSelected
                          ? 'bg-gray-100 font-semibold dark:bg-gray-800'
                          : isOtherSelected
                            ? 'opacity-50 grayscale'
                            : ''
                      } ${
                        reducedMotion
                          ? ''
                          : 'hover:scale-105 hover:brightness-110 active:scale-95'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400`}
                      onClick={() => handleCategoryClick(category.id)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      tabIndex={index === 0 || isSelected ? 0 : -1}
                    >
                      <div
                        className="h-3 w-3 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: category.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                        {category.name} ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Size scale explanation */}
              {showSizeScale && (
                <>
                  <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Size Scale
                    </span>
                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      Circle size = Proficiency &times; Experience &times; Recency
                    </p>
                    <div className="mt-1.5 flex items-end gap-1" aria-hidden="true">
                      {[8, 16, 24, 32].map((size, i) => (
                        <div
                          key={size}
                          className="rounded-full bg-gray-300 dark:bg-gray-600"
                          style={{ width: size, height: size }}
                          title={`Size ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen reader live region for filter announcements */}
      <div
        ref={liveRegionRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}
