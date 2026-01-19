/**
 * Legend Component
 *
 * Displays category colors and optional size scale explanation.
 * Collapsible on mobile for space efficiency.
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '@/data/categories';

export interface LegendProps {
  showSizeScale?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  reducedMotion?: boolean;
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
}: LegendProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
              <div className="mt-2 space-y-1.5">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: category.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                      {category.name}
                    </span>
                  </div>
                ))}
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
    </div>
  );
}
