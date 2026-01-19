/**
 * ChatWindow Component
 *
 * Expanded chat interface with header, messages, and input.
 * Uses Vercel AI SDK's useChat hook for message handling.
 */

'use client';

import { useEffect, useCallback, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
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
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const hasMessages = messages.length > 0;

  // Handle starter prompt selection
  const handleStarterPrompt = useCallback(
    (prompt: string) => {
      setInput(prompt);
      // Send the message immediately
      setTimeout(() => {
        sendMessage({ text: prompt });
        setInput('');
      }, 0);
    },
    [sendMessage]
  );

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
      sendMessage({ text: input });
      setInput('');
    }
  }, [input, sendMessage]);

  return (
    <motion.div
      className="flex h-[500px] w-[90vw] max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
      role="dialog"
      aria-label="Chat with Tom's Resume Assistant"
      aria-modal="true"
    >
      <ChatHeader onClose={onClose} />

      {/* Error display */}
      {error && (
        <ErrorMessage
          message={error.message || 'Something went wrong. Please try again.'}
          onRetry={regenerate}
        />
      )}

      <ChatMessages messages={messages} isLoading={isLoading} />

      {/* Starter prompts - only show when no messages */}
      {!hasMessages && !isLoading && <StarterPrompts onSelect={handleStarterPrompt} />}

      <ChatInput value={input} onChange={setInput} onSubmit={onSubmit} disabled={isLoading} />
    </motion.div>
  );
}
