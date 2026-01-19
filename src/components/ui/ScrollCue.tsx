/**
 * ScrollCue Component
 *
 * Animated indicator encouraging users to scroll down.
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { bounceAnimation } from '@/lib/animations';

export interface ScrollCueProps {
  targetSection?: string;
  label?: string;
  className?: string;
}

export function ScrollCue({
  targetSection = '#about',
  label = 'Scroll to explore',
  className = '',
}: ScrollCueProps) {
  const reducedMotion = useReducedMotion();

  const handleClick = () => {
    const element = document.querySelector(targetSection);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center gap-2 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)] focus-visible:ring-offset-2 ${className}`}
      aria-label={label}
    >
      <span className="text-sm">{label}</span>
      <motion.div animate={reducedMotion ? {} : bounceAnimation} aria-hidden="true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </button>
  );
}
