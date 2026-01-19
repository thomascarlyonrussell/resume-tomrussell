/**
 * StarterPrompts Component
 *
 * Displays suggested prompts to help users start a conversation.
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';

export interface StarterPromptsProps {
  onSelect: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  'What projects has Tom worked on?',
  "What's Tom's technical background?",
  "What are Tom's key strengths?",
  'How does Tom approach problem-solving?',
];

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-2 p-3">
      <p className="text-center text-xs text-gray-500 dark:text-gray-400">
        Try one of these questions:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {STARTER_PROMPTS.map((prompt, index) => (
          <motion.button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 transition-colors hover:border-[var(--color-engineering)] hover:text-[var(--color-engineering)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-engineering)] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-[var(--color-engineering)] dark:hover:text-[var(--color-engineering)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.3,
              delay: reducedMotion ? 0 : index * 0.05,
            }}
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
