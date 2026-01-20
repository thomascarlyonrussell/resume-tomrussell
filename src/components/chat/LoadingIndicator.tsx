/**
 * LoadingIndicator Component
 *
 * Animated typing indicator shown while AI is generating a response.
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';

export function LoadingIndicator() {
  const reducedMotion = useReducedMotion();

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -4 },
  };

  const dotTransition = (delay: number) => ({
    duration: reducedMotion ? 0.01 : 0.4,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    delay: reducedMotion ? 0 : delay,
  });

  return (
    <div className="flex items-center gap-1 px-3 py-2" aria-label="AI is typing" role="status" data-testid="loading-indicator">
      <motion.span
        className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={dotTransition(0)}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={dotTransition(0.15)}
      />
      <motion.span
        className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={dotTransition(0.3)}
      />
    </div>
  );
}
