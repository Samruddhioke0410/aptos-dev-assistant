# aptos-dev-assistant
An AI-powered chatbot for Aptos developers, providing accurate answers from official documentation.

## Features

- RAG-based answers from official Aptos documentation
- Real-time chat interface
- Suggested questions
- Conversation history
- Aptos-branded UI
- Easy integration with existing documentation

## Setup

1. Clone the repository
   git clone https://github.com/Samruddhioke0410/aptos-dev-assistant.git
   cd aptos-dev-assistant
3. Install dependencies:
   npm install
   npm install axios cheerio @pinecone-database/pinecone langchain openai
5. Configure environment variables in `.env.local (present as .env.example)`
6. Run the ingestion script: `npm run ingest`
7. Start the development server: `npm run dev`
8. Open the app in your browser at local host for example http://localhost:3000.

## Technology Stack

- Next.js with TypeScript
- LangChain for RAG implementation
- Pinecone for vector storage
- OpenAI for embeddings and completion
- TailwindCSS for styling

## Integration Guide

To embed this chatbot in aptos.dev:

1. Import the ChatInterface component
2. Add the component to your desired location
3. Configure API endpoints
4. Style according to Aptos brand guidelines

## Development

1. Add new documentation sources in `scripts/ingest.ts`
2. Modify the chat interface in `components/ChatInterface.tsx`
3. Adjust API handling in `pages/api/chat.ts`
