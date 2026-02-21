# Spec Delta: Chatbot

## Overview

This delta updates the chatbot specification to reflect the migration from Next.js to Vite + React. The API endpoint moves to Netlify Functions while maintaining identical functionality.

**Target Spec**: `chatbot`

**Change Type**: Infrastructure Migration

---

## MODIFIED Requirements

### Requirement: Streaming Responses

The chatbot SHALL use streaming to deliver responses for a responsive experience.

The API endpoint SHALL:
- Be deployed as a Netlify Function
- Accept POST requests at `/api/chat`
- Stream responses using Server-Sent Events
- Support the AI SDK streaming protocol

Implementation uses:
- Netlify Functions
- AI SDK for streaming
- OpenRouter as LLM gateway

#### Scenario: Stream initiation
- **GIVEN** user sends a message
- **WHEN** the API receives the request
- **THEN** it begins streaming the response immediately
- **AND** the response is delivered via Netlify Function

#### Scenario: Progressive display
- **GIVEN** a response is being streamed
- **WHEN** tokens arrive from the LLM
- **THEN** they appear progressively in the chat window
- **AND** the streaming works identically whether built with Vite or Next.js

---

## Technical Notes

### Architecture Change

The technical architecture diagram is updated to reflect the new infrastructure:

```
+-----------------------------------------------------+
|                 Frontend (Vite + React)              |
|  +---------------------------------------------+   |
|  |              ChatWidget Component            |   |
|  |  - Collapsed/expanded state                  |   |
|  |  - Message display                           |   |
|  |  - Input handling                            |   |
|  |  - Starter prompts                           |   |
|  +---------------------------------------------+   |
|                          |                          |
|                          | useChat hook (AI SDK) |
|                          v                          |
|  +---------------------------------------------+   |
|  |         Netlify Function: /api/chat         |   |
|  |  - Validates request                         |   |
|  |  - Injects system prompt with knowledge      |   |
|  |  - Calls OpenRouter                          |   |
|  |  - Streams response                          |   |
|  +---------------------------------------------+   |
+-----------------------------------------------------+
                          |
                          v
+-----------------------------------------------------+
|                    OpenRouter API                    |
|  - Routes to selected model (Llama, Mistral, etc.)  |
|  - Streams completion back                           |
+-----------------------------------------------------+
```

### Key Changes

1. **Frontend**: "Next.js" → "Vite + React"
2. **API Route**: "API Route" → "Netlify Functions"
3. **File Location**: `src/app/api/chat/route.ts` → `api/chat/route.ts`

### Unchanged Behavior

All functional requirements remain identical:
- Chat Widget UI appearance and interaction
- Message display and formatting
- Streaming response behavior
- Error handling
- Rate limiting
- Model flexibility via environment variable
