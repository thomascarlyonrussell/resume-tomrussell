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
      <div
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                   rounded-lg shadow-md p-3 max-w-[200px]"
      >
        {/* Header with collapse toggle */}
        <button
          className="flex items-center justify-between w-full text-left md:cursor-default"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          aria-controls="legend-content"
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Legend</span>
          <span className="md:hidden text-gray-400 text-xs">
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
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                      aria-hidden="true"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Size scale explanation */}
              {showSizeScale && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Size Scale
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Circle size = Proficiency &times; Experience &times; Recency
                    </p>
                    <div className="flex items-end gap-1 mt-1.5" aria-hidden="true">
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
