/**
 * Netlify Function: Chat API
 *
 * Serverless function that handles chat requests via OpenRouter SDK.
 * Replaces the Next.js API route with a Netlify-compatible implementation.
 */

import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import { OpenRouter } from '@openrouter/sdk';

// Import knowledge base for system prompt
// Note: This will need to be compiled/bundled by Netlify's build process
import { generateSystemPrompt } from '../../src/data/chatbot-knowledge';

// Simple in-memory rate limiting (MVP)
// Note: Resets on cold starts, but good enough for MVP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

/**
 * Check if IP has exceeded rate limit
 */
function checkRateLimit(ip: string):
  | { allowed: true; remaining: number }
  | { allowed: false; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

/**
 * Clean up old rate limit entries
 */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

// Run cleanup periodically (every 5 minutes)
setInterval(cleanupRateLimits, 5 * 60 * 1000);

/**
 * Main handler for chat API
 */
export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get client IP for rate limiting
    const ip =
      event.headers['x-forwarded-for']?.split(',')[0] || event.headers['client-ip'] || 'unknown';

    // Check rate limit
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return {
        statusCode: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0',
        },
        body: JSON.stringify({
          error: 'Rate limit exceeded',
          message: "You've sent too many messages. Please wait a moment and try again.",
        }),
      };
    }

    // Validate API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Configuration error',
          message: 'Chat is temporarily unavailable. Please try again later.',
        }),
      };
    }

    // Parse and validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Invalid request',
          message: 'Request body is required.',
        }),
      };
    }

    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Invalid request',
          message: 'Messages array is required.',
        }),
      };
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid message format',
            message: 'Each message must have role and content.',
          }),
        };
      }
    }

    // Initialize OpenRouter SDK
    const openrouter = new OpenRouter({
      apiKey,
    });

    // Get model from env or use default free model
    const modelId = process.env.CHAT_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

    // Prepare messages with system prompt
    const systemPrompt = generateSystemPrompt();
    const fullMessages = [{ role: 'system' as const, content: systemPrompt }, ...messages];

    // Create streaming completion
    const stream = await openrouter.chat.send({
      chatGenerationParams: {
        model: modelId,
        messages: fullMessages,
        stream: true,
      },
    });

    // Create SSE formatted response body
    const encoder = new TextEncoder();
    const chunks: string[] = [];

    try {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';

        if (content) {
          const data = JSON.stringify(chunk);
          chunks.push(`data: ${data}\n\n`);
        }
      }

      // Add done message
      chunks.push('data: [DONE]\n\n');

      // Return streaming response with SSE headers
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': rateCheck.remaining.toString(),
        },
        body: chunks.join(''),
      };
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Streaming error',
          message: streamError instanceof Error ? streamError.message : 'Unknown error',
        }),
      };
    }
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific error types
    let statusCode = 500;
    let errorMessage = 'Something went wrong. Please try again.';
    let errorType = 'Server error';

    if (error instanceof Error) {
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        statusCode = 429;
        errorType = 'Rate limit exceeded';
        errorMessage = 'The AI service is busy. Please try again in a moment.';
      } else if (error.message.includes('timeout')) {
        statusCode = 504;
        errorType = 'Timeout';
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Invalid API key')) {
        statusCode = 503;
        errorType = 'Configuration error';
        errorMessage = 'Chat is temporarily unavailable. Please try again later.';
      }
    }

    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: errorType,
        message: errorMessage,
      }),
    };
  }
};
