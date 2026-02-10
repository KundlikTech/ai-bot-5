# AI E-Commerce Chatbot

An intelligent chatbot assistant that understands customer requests, extracts order information, confirms purchases, and creates orders automatically using AI.

## Features

- AI-powered order processing with Groq LLM
- Real-time chat interface
- Automatic order creation with order ID and ETA
- Conversation history tracking
- FAQ search functionality
- React-based frontend with Vite

## Tech Stack

Backend: Node.js, TypeScript, Groq AI, Prisma ORM
Frontend: React, Vite, TypeScript
Database: PostgreSQL via Prisma

## Installation

### Prerequisites

- Node.js version 18 or higher
- PostgreSQL database
- Git

### Backend Setup

```bash
cd apps/backend
npm install
cp .env.example .env
```

Update DATABASE_URL in .env file, then run:

```bash
npx prisma migrate dev
npm run dev
```

### Frontend Setup

```bash
cd apps/frontend
npm install
npm run dev
```

## Environment Variables

Create .env file in backend folder:

```
DATABASE_URL=postgresql://user:password@localhost:5432/thirty_five_lpa
GROQ_API_KEY=your_groq_api_key
```

## How to Use

1. Start the backend server with npm run dev, which runs on port 3000
2. Start the frontend with npm run dev, which runs on port 5173
3. Open your browser and go to http://localhost:5173
4. Chat with the bot by typing messages like: I want 2 items for 500 rupees

## Project Structure

The project is organized as follows:

```
thirty_five_lpa/
├── apps/
│   ├── backend/
│   │   ├── src/agents/order.agent.ts
│   │   ├── src/tools/
│   │   └── prisma/
│   └── frontend/
│       └── src/components/Chat.tsx
└── README.md
```

## License

This project is licensed under the MIT License.

## Support

For any issues or questions, please visit the GitHub Issues page at https://github.com/KundlikTech/ai-bot-5/issues
