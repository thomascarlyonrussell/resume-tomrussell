/**
 * ChatWindow Component
 *
 * Expanded chat interface with header, messages, and input.
 * Uses Vercel AI SDK's useChat hook for message handling.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/visualizations/hooks';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { StarterPrompts } from './StarterPrompts';
import { ErrorMessage } from './ErrorMessage';

export interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const reducedMotion = useReducedMotion();

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    reload,
  } = useChat({
    api: '/api/chat',
  });

  const hasMessages = messages.length > 0;

  // Handle starter prompt selection
  const handleStarterPrompt = useCallback((prompt: string) => {
    setInput(prompt);
    // Submit after setting input
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 0);
  }, [setInput]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Custom submit handler
  const onSubmit = useCallback(() => {
    if (input.trim()) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  }, [input, handleSubmit]);

  return (
    <motion.div
      className="flex h-[500px] w-80 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-96 dark:border-gray-700 dark:bg-gray-900"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
      role="dialog"
      aria-label="Chat with Tom's AI assistant"
      aria-modal="true"
    >
      <ChatHeader onClose={onClose} />

      {/* Error display */}
      {error && (
        <ErrorMessage
          message={error.message || 'Something went wrong. Please try again.'}
          onRetry={reload}
        />
      )}

      <ChatMessages messages={messages} isLoading={isLoading} />

      {/* Starter prompts - only show when no messages */}
      {!hasMessages && !isLoading && (
        <StarterPrompts onSelect={handleStarterPrompt} />
      )}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={onSubmit}
        disabled={isLoading}
      />
    </motion.div>
  );
}
