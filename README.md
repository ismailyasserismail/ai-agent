# Smart Chatbot System

An end-to-end AI-powered chatbot platform supporting multilingual conversations (Arabic and English), omnichannel delivery, and an operational dashboard for administrators and agents.

## Features

- **Backend (Node.js + Express + PostgreSQL)**
  - NLP engine with multilingual intent detection.
  - Knowledge base management with intents, training phrases, and responses.
  - Conversation lifecycle with bot ↔ human handover.
  - Realtime agent availability via Socket.IO.
  - Mock integrations for CRM ticketing and order tracking.
  - JWT authentication with role-based access.
  - Swagger-powered API documentation at `/api/docs`.

- **Admin Dashboard (React + Vite + MUI)**
  - Secure login and session management.
  - Dashboard analytics (conversation volume, success, satisfaction).
  - Conversation viewer with manual handover controls.
  - Knowledge base editor for intents and responses.
  - Agent availability management and integration overview.

- **Channels**
  - Web widget (vanilla JS) for drop-in embedding.
  - React Native SDK for iOS and Android apps.
  - Optional WhatsApp Business and Instagram modules (disabled by default).

- **DevOps**
  - Dockerized services with PostgreSQL database.
  - `.env.example` template.
  - Database schema and seed data.

## Project Structure

```
.
├── backend/               # Express API service
├── frontend/              # React admin dashboard
├── widget/                # Web widget assets
├── mobile-sdk/            # React Native SDK package
├── integrations/          # Integration documentation
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development without containers)

### Environment Variables
Copy `.env.example` to `.env` and adjust values as required:

```bash
cp .env.example .env
```

Key variables:
- `PORT`: Backend port (default `4000`)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for signing JWT tokens
- `ENABLE_WHATSAPP`, `ENABLE_INSTAGRAM`: Enable optional channels (`true` / `false`)
- `VITE_API_BASE_URL`: Admin dashboard API endpoint

### Run with Docker Compose

```bash
docker compose up --build
```

Services:
- Backend API: http://localhost:4000/api
- Admin dashboard: http://localhost:5173
- Swagger docs: http://localhost:4000/api/docs

Seeded credentials:
- **Admin** – `admin@chatbot.local` / `Admin@123`
- **Agent** – `agent@chatbot.local` / `Agent@123`

### Local Development (without Docker)

1. **Database** – start PostgreSQL locally and apply schema:
   ```bash
   psql $DATABASE_URL -f backend/db/schema.sql
   psql $DATABASE_URL -f backend/db/seed.sql
   ```

2. **Backend** – install dependencies and run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend** – install dependencies and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment** – ensure `VITE_API_BASE_URL` matches the backend URL.

## API Documentation

Access comprehensive API docs at `/api/docs` once the backend is running. The documentation covers authentication, chatbot interactions, conversations, analytics, knowledge base management, integrations, and agent APIs.

## Web Widget Integration

Include the widget script on any website:

```html
<script src="/path/to/widget.js" defer></script>
<script>
  window.SmartChatbotWidget.init({
    apiBaseUrl: 'https://your-domain.com/api',
    primaryColor: '#4f46e5',
    language: 'en'
  });
</script>
```

## Mobile SDK Integration

Install the React Native package (`mobile-sdk/`):

```bash
npm install ../mobile-sdk
```

Use the component:

```tsx
import { SmartChatbotView } from 'smart-chatbot-react-native';

<SmartChatbotView apiBaseUrl="https://your-domain.com/api" language="en" />
```

## Deployment

1. Build Docker images and push to your registry.
2. Configure environment variables and secrets in your target environment.
3. Run `docker compose` (or translate services to Kubernetes/Swarm).
4. Use a reverse proxy (NGINX/Traefik) with TLS termination.

## Testing the Bot

Use the `/api/chatbot/message` endpoint with payloads such as:

```json
{
  "channel": "web",
  "message": "هلا",
  "language": "ar"
}
```

The response includes the recognized intent, confidence score, and conversation ID for subsequent turns. Arabic interactions ship with Saudi (ar-SA) phrasing across all default replies so the bot sounds natural to customers in the Kingdom.

## Extending the Platform

- Replace the mock CRM and order services with real integrations.
- Connect to OpenAI, Google Dialogflow, or other LLM providers inside `chatbot.service.ts`.
- Implement WhatsApp and Instagram channel adapters leveraging the existing architecture.
- Add analytics warehousing or BI tooling by streaming conversation data.

## License

This project is provided as-is for demonstration and can be adapted to your production needs.
