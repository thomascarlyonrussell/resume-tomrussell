/**
 * ChatMessages Component
 *
 * Scrollable message display area with auto-scroll to bottom.
 */

'use client';

import { useRef, useEffect } from 'react';
import type { UIMessage } from '@ai-sdk/react';
import { Message } from './Message';
import { LoadingIndicator } from './LoadingIndicator';

export interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading = false }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-3"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {!hasMessages && !isLoading && (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Hi! I&apos;m an AI assistant that can answer questions about Tom&apos;s professional background.
          </p>
        </div>
      )}

      {hasMessages && (
        <div className="space-y-3">
          {messages.map((message) => (
            <Message
              key={message.id}
              role={message.role as 'user' | 'assistant' | 'system'}
              parts={message.parts}
            />
          ))}
        </div>
      )}

      {isLoading && (
        <div className="mt-3 flex justify-start">
          <div className="rounded-2xl bg-gray-100 dark:bg-gray-800">
            <LoadingIndicator />
          </div>
        </div>
      )}
    </div>
  );
}
