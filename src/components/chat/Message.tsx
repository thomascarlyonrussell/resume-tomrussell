/**
 * Message Component
 *
 * Displays a single chat message with role-based styling.
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import type { UIMessage } from '@ai-sdk/react';

// Extract the parts type from UIMessage
type UIMessagePart = UIMessage['parts'][number];

export interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  parts: UIMessagePart[];
}

export function Message({ role, parts }: MessageProps) {
  const reducedMotion = useReducedMotion();
  const isUser = role === 'user';

  // Render text content from parts
  const renderContent = () => {
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return (
          <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
            {part.text}
          </p>
        );
      }
      // Handle other part types if needed in the future
      return null;
    });
  };

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
        {renderContent()}
      </div>
    </motion.div>
  );
}
