/**
 * VisualizationToggle Component
 *
 * Toggle button group for switching between Fibonacci spiral and Timeline views.
 * Accessible with keyboard navigation and ARIA attributes.
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from './hooks';

export type VisualizationView = 'fibonacci' | 'timeline';

export interface VisualizationToggleProps {
  activeView: VisualizationView;
  onChange: (view: VisualizationView) => void;
  /** Disable toggle during transitions */
  disabled?: boolean;
  className?: string;
}

const VIEWS: { id: VisualizationView; label: string; description: string }[] = [
  {
    id: 'fibonacci',
    label: 'Skills',
    description: 'View skills in spiral layout by proficiency',
  },
  {
    id: 'timeline',
    label: 'Career',
    description: 'View career progression over time',
  },
];

export function VisualizationToggle({
  activeView,
  onChange,
  disabled = false,
  className = '',
}: VisualizationToggleProps) {
  const reducedMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (disabled) return;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? VIEWS.length - 1 : currentIndex - 1;
      onChange(VIEWS[prevIndex].id);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex === VIEWS.length - 1 ? 0 : currentIndex + 1;
      onChange(VIEWS[nextIndex].id);
    }
  };

  const handleClick = (viewId: VisualizationView) => {
    if (!disabled) {
      onChange(viewId);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Visualization view"
      className={`inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800 ${className}`}
    >
      {VIEWS.map((view, index) => {
        const isActive = activeView === view.id;

        return (
          <button
            key={view.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${view.id}-panel`}
            aria-disabled={disabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleClick(view.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-engineering)] focus-visible:ring-offset-2 ${
              isActive
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
            title={view.description}
          >
            {/* Active Background */}
            {isActive && (
              <motion.span
                layoutId="activeTab"
                className="absolute inset-0 rounded-md bg-[var(--color-engineering)]"
                transition={{
                  type: 'spring',
                  bounce: 0.15,
                  duration: reducedMotion ? 0.01 : 0.3,
                }}
              />
            )}
            {/* Label */}
            <span className="relative z-10">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}
