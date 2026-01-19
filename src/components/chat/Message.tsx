/**
 * Message Component
 *
 * Displays a single chat message with role-based styling.
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';

export interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function Message({ role, content }: MessageProps) {
  const reducedMotion = useReducedMotion();
  const isUser = role === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-[var(--color-engineering)] text-white'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}
