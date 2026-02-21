/**
 * Custom useChat Hook
 *
 * Replacement for Vercel AI SDK's useChat hook.
 * Provides chat functionality with OpenRouter via Netlify Function.
 */

import { useState, useCallback, useRef } from 'react';

// Match AI SDK's UIMessage interface
export interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: Array<{ type: 'text'; text: string }>;
}

export type ChatStatus = 'idle' | 'submitted' | 'streaming' | 'awaiting_message';

export interface UseChatOptions {
  api?: string;
  onError?: (error: Error) => void;
}

export interface UseChatReturn {
  messages: UIMessage[];
  sendMessage: (params: { text: string }) => Promise<void>;
  status: ChatStatus;
  error: Error | null;
  regenerate: () => Promise<void>;
}

/**
 * Custom hook for chat functionality using OpenRouter SDK via Netlify Function
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { api = '/.netlify/functions/chat', onError } = options;

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  // Keep track of the last user message for regeneration
  const lastUserMessageRef = useRef<string | null>(null);
  // Keep track of abort controller for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Generate a unique ID for messages
   */
  const generateId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Send a message to the chat API
   */
  const sendMessage = useCallback(
    async ({ text }: { text: string }) => {
      if (!text.trim()) return;

      // Store for potential regeneration
      lastUserMessageRef.current = text;

      // Add user message immediately
      const userMessage: UIMessage = {
        id: generateId(),
        role: 'user',
        parts: [{ type: 'text', text }],
      };

      setMessages((prev) => [...prev, userMessage]);
      setStatus('submitted');
      setError(null);

      // Create assistant message placeholder for streaming
      const assistantMessageId = generateId();
      const assistantMessage: UIMessage = {
        id: assistantMessageId,
        role: 'assistant',
        parts: [{ type: 'text', text: '' }],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStatus('streaming');

      try {
        // Cancel any in-flight requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        // Send request to Netlify Function
        const response = await fetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage).map((msg) => ({
              role: msg.role,
              content: msg.parts[0]?.text || '',
            })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Response body is not readable');
        }

        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';

                if (content) {
                  accumulatedText += content;

                  // Update the assistant message with accumulated text
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? {
                            ...msg,
                            parts: [{ type: 'text', text: accumulatedText }],
                          }
                        : msg
                    )
                  );
                }
              } catch (parseError) {
                // Skip malformed JSON chunks
                console.warn('Failed to parse SSE data:', data);
              }
            }
          }
        }

        setStatus('idle');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');

        // Don't treat abort as error
        if (error.name === 'AbortError') {
          setStatus('idle');
          return;
        }

        setError(error);
        setStatus('idle');

        // Remove the incomplete assistant message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));

        if (onError) {
          onError(error);
        }
      } finally {
        abortControllerRef.current = null;
      }
    },
    [api, messages, generateId, onError]
  );

  /**
   * Regenerate the last assistant response
   */
  const regenerate = useCallback(async () => {
    if (!lastUserMessageRef.current) return;

    // Remove the last assistant message
    setMessages((prev) => {
      const lastAssistantIndex = prev.findLastIndex((msg) => msg.role === 'assistant');
      if (lastAssistantIndex !== -1) {
        return prev.slice(0, lastAssistantIndex);
      }
      return prev;
    });

    // Resend the last user message
    await sendMessage({ text: lastUserMessageRef.current });
  }, [sendMessage]);

  return {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
  };
}
