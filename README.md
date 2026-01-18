# Tom Russell Portfolio

Personal portfolio and resume website showcasing career history, skills, and projects through innovative interactive visualizations and an AI-powered chatbot.

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with dark mode
- **Visualizations**: Visx (Fibonacci spiral) + Recharts (Timeline)
- **AI Chatbot**: Vercel AI SDK + OpenRouter
- **Animations**: Framer Motion

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── visualizations/ # Visualization components
│   └── chat/         # Chatbot components
├── data/             # TypeScript data files
├── lib/              # Utility functions
└── styles/           # Global styles
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
OPENROUTER_API_KEY=     # Required for chatbot
CHAT_MODEL=             # Optional: defaults to free tier
```

## Specifications

See `openspec/` directory for detailed specifications:
- `specs/site-structure/` - Page layout and navigation
- `specs/visualizations/` - Fibonacci spiral and timeline charts
- `specs/data-model/` - Skills, experience, and knowledge structures
- `specs/chatbot/` - AI chatbot behavior and knowledge base

## License

Private - All rights reserved.
