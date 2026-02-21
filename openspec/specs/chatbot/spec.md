# Chatbot Specification

## Purpose

Define the AI-powered chatbot that allows visitors to learn about Tom Russell through natural conversation. The chatbot serves as an interactive way to explore Tom's background, skills, and experience.

## Overview

The chatbot:
- Answers questions about Tom's professional background
- Has access to structured knowledge about skills, experience, and projects
- Maintains appropriate boundaries on topics it will discuss
- Provides starter prompts to guide conversation

---

## Requirements

### Requirement: Chat Widget UI

The chatbot SHALL be accessible via a fixed widget at the center-bottom of the viewport.

The widget SHALL:
- Be visible on all sections of the page
- Have a collapsed state (button/indicator)
- Have an expanded state (full chat interface)
- Not obstruct critical page content when collapsed

#### Scenario: Initial page load
- **GIVEN** a visitor loads the page
- **WHEN** the page finishes loading
- **THEN** the chat widget appears in collapsed state at center-bottom

#### Scenario: Opening the chat
- **GIVEN** the widget is collapsed
- **WHEN** the visitor clicks/taps it
- **THEN** the chat interface expands
- **AND** the visitor sees a welcome message and starter prompts

#### Scenario: Closing the chat
- **GIVEN** the chat is expanded
- **WHEN** the visitor clicks a close button or clicks outside
- **THEN** the chat collapses
- **AND** conversation history is preserved for the session

---

### Requirement: Chat Interface

The expanded chat interface SHALL include:

- Header with title (e.g., "Chat with Tom's Resume Assistant")
- Close/minimize button
- Message display area (scrollable)
- Text input field
- Send button
- Starter prompt buttons (on first open)

#### Scenario: Sending a message
- **GIVEN** the chat is open
- **WHEN** the visitor types a message and presses Enter or Send
- **THEN** the message appears in the chat
- **AND** a loading indicator appears
- **AND** the AI response streams in

#### Scenario: Message history
- **GIVEN** an ongoing conversation
- **WHEN** the visitor scrolls up in the message area
- **THEN** they can see previous messages in the conversation

---

### Requirement: Starter Prompts

The chatbot SHALL display starter prompts to guide new conversations.

Starter prompts SHALL include:
- "What projects has Tom worked on?"
- "What's Tom's technical background?"

Additional starter prompts MAY include:
- "How does Tom approach problem-solving?"
- "What are Tom's key strengths?"

#### Scenario: Using a starter prompt
- **GIVEN** the chat just opened with no messages
- **WHEN** the visitor clicks a starter prompt button
- **THEN** that prompt is sent as their message
- **AND** the AI responds accordingly

---

### Requirement: Knowledge Base

The chatbot SHALL have access to structured knowledge about Tom.

The knowledge base SHALL include:
- Career history and roles
- Skills and proficiency levels
- Key projects and achievements
- Work philosophy and approach
- Professional interests and focus areas

The knowledge base SHALL be formatted as a system prompt injected at conversation start.

#### Scenario: Skills question
- **GIVEN** the visitor asks "What programming languages does Tom know?"
- **WHEN** the AI processes the question
- **THEN** it retrieves relevant skills from the knowledge base
- **AND** provides an accurate, detailed response

#### Scenario: Project question
- **GIVEN** the visitor asks about LoadSEER
- **WHEN** the AI processes the question
- **THEN** it provides accurate information about Tom's work on LoadSEER

---

### Requirement: Response Behavior

The chatbot SHALL respond in a helpful, professional manner.

Responses SHALL:
- Be conversational but professional
- Be accurate to the knowledge base (no hallucination)
- Be concise but informative
- Reference specific skills, projects, or experiences when relevant

Responses SHALL NOT:
- Make up information not in the knowledge base
- Claim to be Tom himself (it's an AI assistant about Tom)
- Discuss topics outside its knowledge scope

#### Scenario: Accurate response
- **GIVEN** the visitor asks about Tom's experience with a specific technology
- **WHEN** the technology is in the knowledge base
- **THEN** the AI provides accurate details
- **AND** may mention related projects or context

#### Scenario: Unknown information
- **GIVEN** the visitor asks about something not in the knowledge base
- **WHEN** the AI cannot find relevant information
- **THEN** it honestly states it doesn't have that information
- **AND** suggests the visitor contact Tom directly for details

---

### Requirement: Conversation Boundaries

The chatbot SHALL maintain boundaries on discussion topics.

The chatbot SHALL discuss:
- Professional background and experience
- Skills and technologies
- Projects and achievements
- Work philosophy and approach
- General professional interests

The chatbot SHALL NOT discuss:
- Personal life details beyond professional context
- Salary expectations or compensation
- Confidential information about employers
- Political or controversial topics
- Anything not in the knowledge base

When boundaries are reached, the chatbot SHALL:
- Politely decline to discuss the topic
- Redirect to professional topics
- Suggest contacting Tom directly for sensitive inquiries

#### Scenario: Personal question
- **GIVEN** the visitor asks about Tom's personal life
- **WHEN** the question is outside professional scope
- **THEN** the AI politely declines
- **AND** suggests focusing on professional topics

#### Scenario: Salary question
- **GIVEN** the visitor asks about salary expectations
- **WHEN** processing the sensitive request
- **THEN** the AI explains it can't discuss compensation
- **AND** provides contact information for direct inquiry

---

### Requirement: Contact Redirect

For topics requiring direct communication, the chatbot SHALL provide contact information.

Redirect scenarios:
- Detailed job opportunity discussions
- Salary and compensation
- Contract or availability questions
- Anything requiring Tom's direct input

Redirect response format:
"For [topic], I'd recommend reaching out to Tom directly at [email/LinkedIn]."

#### Scenario: Hiring inquiry
- **GIVEN** a recruiter asks about availability
- **WHEN** the AI recognizes a hiring context
- **THEN** it provides helpful general info
- **AND** suggests direct contact for specifics

---

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

---

### Requirement: Error Handling

The chatbot SHALL handle errors gracefully.

#### Scenario: API error
- **GIVEN** a network or API error occurs
- **WHEN** the AI cannot generate a response
- **THEN** an error message displays
- **AND** the visitor can retry their message

#### Scenario: Rate limiting
- **GIVEN** the free tier rate limit is reached
- **WHEN** this occurs
- **THEN** the user sees a friendly message
- **AND** is informed they can try again shortly

---

### Requirement: Model Flexibility

The chatbot SHALL support swapping LLM models.

The implementation SHALL:
- Use OpenRouter as the LLM gateway
- Default to a free-tier model (e.g., Llama 3.3 or Mistral Small)
- Allow configuration to use different models
- Abstract model selection from the UI

#### Scenario: Model configuration
- **GIVEN** an environment variable specifies a model
- **WHEN** the app starts
- **THEN** it uses the configured model
- **AND** falls back to default if not specified

---

## System Prompt Template

The following is a template for the system prompt that provides the chatbot with its knowledge and behavioral guidelines:

```
You are an AI assistant on Tom Russell's portfolio website. Your purpose is to help visitors learn about Tom's professional background, skills, projects, and experience.

## Your Role
- You are NOT Tom Russell - you are an AI assistant that knows about Tom
- Answer questions about Tom's professional background accurately
- Be helpful, professional, and conversational
- Only provide information from the knowledge base below

## Knowledge Base

### Professional Summary
[To be populated with Tom's summary]

### Current Role
[Company, title, key responsibilities]

### Skills by Category

#### Software Development
[List of skills with proficiency indicators]

#### AI & Automation
[List of skills with proficiency indicators]

#### Product Management
[List of skills with proficiency indicators]

#### Data & Analytics
[List of skills with proficiency indicators]

#### Content Creation
[List of skills with proficiency indicators]

### Work Experience
[Chronological list of roles and key achievements]

### Notable Projects
[Key projects with descriptions]

### Work Philosophy
[Tom's approach to work, problem-solving, etc.]

## Behavioral Guidelines

### DO:
- Answer questions about Tom's professional background
- Reference specific skills, projects, or experiences
- Be conversational and approachable
- Admit when you don't have information

### DON'T:
- Make up information not in this knowledge base
- Discuss personal life beyond professional context
- Discuss salary, compensation, or availability specifics
- Engage with political or controversial topics

### Redirects:
For the following topics, suggest contacting Tom directly at [email]:
- Detailed job opportunity discussions
- Salary and compensation questions
- Contract or availability inquiries
- Anything requiring Tom's direct input

Keep responses concise but informative. Use a friendly, professional tone.
```

---

## Technical Architecture

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

---

## Component Structure

```
src/components/chat/
├── ChatWidget.tsx         # Main widget container
├── ChatButton.tsx         # Collapsed state button
├── ChatWindow.tsx         # Expanded chat interface
├── ChatHeader.tsx         # Header with title and close
├── ChatMessages.tsx       # Message list display
├── ChatInput.tsx          # Text input and send
├── StarterPrompts.tsx     # Initial prompt buttons
├── Message.tsx            # Individual message component
└── hooks/
    └── useChat.ts         # AI SDK integration

netlify/functions/
└── chat.ts                # Netlify Function handler

src/data/
└── chatbot-knowledge.ts   # Formatted knowledge for system prompt
```

---

## Environment Configuration

```env
# Required
OPENROUTER_API_KEY=sk-or-...

# Optional - defaults to free model
CHAT_MODEL=meta-llama/llama-3.3-70b-instruct:free

# Optional - for analytics
CHAT_ANALYTICS_ENABLED=false
```
