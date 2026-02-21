# Tom Russell Portfolio

Personal portfolio and resume website showcasing career history, skills, and projects through innovative interactive visualizations and an AI-powered chatbot.

## Tech Stack

- **Framework**: Vite + React (SPA)
- **Language**: TypeScript (strict mode)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 with dark mode
- **Visualizations**: Visx (Fibonacci spiral) + Recharts (Timeline)
- **AI Chatbot**: OpenRouter SDK
- **API**: Netlify Functions (serverless)
- **Hosting**: Netlify
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ (for native Fetch API support)
- OpenRouter API key from https://openrouter.ai/keys

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY

# 3. Verify setup (optional but recommended)
./verify-setup.ps1

# 4. Start development server with Netlify Dev
npm run dev

# The terminal will show:
# - Vite server port (e.g., localhost:3000)
# - Netlify Dev proxy URL (e.g., localhost:63571) ← USE THIS ONE!
# - Loaded functions list
```

**⚠️ IMPORTANT**: Use the **Netlify Dev proxy URL** (e.g., `http://localhost:63571`), not the Vite URL!  
Only the Netlify proxy can serve the chat function at `/.netlify/functions/chat`.

See [NETLIFY_DEV_SETUP.md](./NETLIFY_DEV_SETUP.md) for detailed local development guide.

### Other Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format

# Run all tests
npm run test:all
```

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── visualizations/ # Visualization components
│   ├── chat/         # Chatbot components
│   ├── sections/     # Page sections
│   └── navigation/   # Navigation components
├── data/             # TypeScript data files
├── lib/              # Utility functions
├── hooks/            # Custom React hooks
├── App.tsx           # Root application component
├── main.tsx          # Application entry point
└── globals.css       # Global styles
netlify/
└── functions/        # Netlify serverless functions
    └── chat.ts       # Chat API endpoint
```

## Environment Variables

### Local Development

Create a `.env` file in the project root (copy from `.env.example`):

```bash
OPENROUTER_API_KEY=sk-or-v1-... # Get from https://openrouter.ai/keys
CHAT_MODEL=meta-llama/llama-3.3-70b-instruct:free  # Optional: override model
```

Netlify Dev automatically loads variables from `.env` during local development.

### Production (Netlify UI)

Configure in Netlify UI (Site settings > Build & deploy > Environment):

**Required:**
```
OPENROUTER_API_KEY=<your-api-key>
```

**Optional:**
```
CHAT_MODEL=meta-llama/llama-3.3-70b-instruct:free  # Or any OpenRouter model
```

## Deployment

### Netlify

This site is configured for automatic deployment on Netlify:

1. **Connect Repository**: Link your Git repository to Netlify
2. **Configure Build**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. **Set Environment Variables**: Add `OPENROUTER_API_KEY` in Netlify UI
4. **Deploy**: Push to main branch to trigger automatic deployment

The `netlify.toml` file contains all configuration:
- SPA fallback routing (redirects to `index.html`)
- Security headers
- Cache headers for static assets
- Netlify Functions support

### Manual Deployment

```bash
# Build the site
npm run build

# Preview locally
npm run preview

# Deploy with Netlify CLI
netlify deploy --prod
```

## Specifications

See `openspec/` directory for detailed specifications:
- `specs/site-structure/` - Page layout and navigation
- `specs/visualizations/` - Fibonacci spiral and timeline charts
- `specs/data-model/` - Skills, experience, and knowledge structures
- `specs/chatbot/` - AI chatbot behavior and knowledge base

## License

Private - All rights reserved.
