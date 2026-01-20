/**
 * ChatButton Component
 *
 * Collapsed state button for the chat widget.
 * Displays a chat icon with text on larger screens.
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';

export interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full bg-[var(--color-engineering)] px-4 py-3 text-white shadow-lg transition-colors hover:bg-[var(--color-engineering)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-engineering)] focus-visible:ring-offset-2"
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      whileTap={reducedMotion ? {} : { scale: 0.95 }}
      aria-label="Open chat with Tom's resume assistant"
      data-testid="chat-button"
    >
      {/* Chat Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
          clipRule="evenodd"
        />
      </svg>
      {/* Text - hidden on mobile */}
      <span className="hidden text-sm font-medium sm:inline">Chat with Tom&apos;s AI</span>
    </motion.button>
  );
}
