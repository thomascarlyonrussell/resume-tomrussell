## MODIFIED Requirements

### Requirement: Streaming Responses

The chatbot SHALL stream responses for better UX.

The streaming implementation SHALL:
- Use OpenRouter SDK for response streaming
- Stream text progressively to the client
- Handle SSE (Server-Sent Events) protocol
- Maintain responsive UI during streaming

#### Scenario: Long response
- **GIVEN** a question requiring a detailed answer
- **WHEN** the AI generates the response
- **THEN** text appears progressively (streaming)
- **AND** the user sees content before the full response completes

#### Scenario: Streaming connection error
- **GIVEN** streaming is in progress
- **WHEN** the network connection drops
- **THEN** the partial response is displayed
- **AND** an error message indicates the stream was interrupted
- **AND** the user can retry the message

---

## ADDED Requirements

### Requirement: Custom React Hook Integration

The chatbot SHALL provide chat functionality through a custom React hook.

The hook SHALL:
- Manage message state (user and assistant messages)
- Handle sending messages to the API
- Manage loading/streaming states
- Handle error states
- Provide regenerate functionality
- Use OpenRouter SDK response format

#### Scenario: Hook initialization
- **GIVEN** the ChatWindow component mounts
- **WHEN** the custom useChat hook initializes
- **THEN** it provides empty messages array
- **AND** sendMessage function is available
- **AND** status is "idle"

#### Scenario: Sending message via hook
- **GIVEN** the useChat hook is initialized
- **WHEN** sendMessage is called with user text
- **THEN** the user message is added to messages array
- **AND** status changes to "submitted"
- **AND** API request is sent
- **AND** streaming response updates messages array

---

### Requirement: Serverless Function Architecture

The chat API SHALL be implemented as a Netlify serverless function.

The function SHALL:
- Accept POST requests with messages array
- Protect the OpenRouter API key server-side
- Use OpenRouter SDK to call the AI model
- Stream responses back to the client
- Implement rate limiting
- Handle errors gracefully

The function endpoint SHALL be: `/.netlify/functions/chat`

#### Scenario: API request handling
- **GIVEN** a POST request to `/.netlify/functions/chat`
- **WHEN** the request includes valid messages array
- **THEN** the function calls OpenRouter SDK
- **AND** streams the response back
- **AND** returns appropriate status codes

#### Scenario: Missing API key
- **GIVEN** OPENROUTER_API_KEY is not configured
- **WHEN** a chat request is received
- **THEN** the function returns 503 Service Unavailable
- **AND** user sees "Chat is temporarily unavailable"

#### Scenario: Rate limit exceeded
- **GIVEN** a user has exceeded the rate limit
- **WHEN** they send another message
- **THEN** the function returns 429 Too Many Requests
- **AND** user sees "You've sent too many messages..."
