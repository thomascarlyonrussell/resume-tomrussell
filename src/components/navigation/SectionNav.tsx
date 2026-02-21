/**
 * SectionNav Component
 *
 * Fixed navigation with dot indicators for each section.
 * Shows current section based on scroll position.
 */

'use client';

import { motion } from 'framer-motion';
import { useScrollSpy } from '@/hooks';
import { useReducedMotion } from '@/components/visualizations/hooks';

export interface SectionConfig {
  id: string;
  label: string;
}

export interface SectionNavProps {
  sections: SectionConfig[];
  className?: string;
}

export function SectionNav({ sections, className = '' }: SectionNavProps) {
  const activeSection = useScrollSpy(
    sections.map((s) => s.id),
    150
  );
  const reducedMotion = useReducedMotion();

  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Page sections"
      className={`fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 lg:block ${className}`}
      data-testid="section-nav"
    >
      <ul className="flex flex-col gap-3">
        {sections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className="nav-button relative flex items-center justify-end focus:outline-none"
                aria-label={`Go to ${section.label} section`}
                aria-current={isActive ? 'true' : undefined}
                data-testid="nav-dot"
                data-section={section.id}
                data-active={isActive ? 'true' : undefined}
              >
                {/* Label (shown on hover) */}
                <span className="nav-label pointer-events-none absolute right-6 z-50 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity dark:bg-gray-100 dark:text-gray-900">
                  {section.label}
                </span>

                {/* Dot */}
                <motion.span
                  className={`block rounded-full transition-colors ${
                    isActive
                      ? 'bg-[var(--color-engineering)]'
                      : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                  animate={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.2,
                  }}
                />

                {/* Focus ring */}
                <span className="nav-focus-ring absolute inset-0 -m-1 rounded-full ring-2 ring-transparent" />

                <style>{`
                  .nav-button:hover .nav-label,
                  .nav-button:focus-visible .nav-label {
                    opacity: 1;
                  }
                  .nav-button:focus-visible .nav-focus-ring {
                    --tw-ring-color: var(--color-engineering);
                    border-color: var(--color-engineering);
                    outline: 2px solid var(--color-engineering);
                  }
                `}</style>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
