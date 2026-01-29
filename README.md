# Eliche Radiche MVP

A luxury yacht maintenance company's digital front desk - a professional, human-first communication system for yacht owners.

## Project Structure

```
eliche-radiche/
├── frontend/          # Next.js 14 frontend application
├── backend/           # Express.js backend API
├── shared/            # Shared TypeScript types
└── docs/              # Project documentation
```

## Prerequisites

- Node.js 18+ and npm
- Git

## Setup Instructions

### 1. Clone and Navigate

```bash
cd "eliche radiche v2"
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 3. Backend Setup

```bash
cd ../backend
npm install
```

Create `.env` file:
```bash
PORT=3001
DATABASE_URL=./db/database.sqlite
OPENAI_API_KEY=sk-your-key-here
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Shared Types Setup

```bash
cd ../shared
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Express.js with Socket.io for real-time communication
- **Database**: SQLite for development
- **Shared Types**: TypeScript types shared between frontend and backend

## Development Standards

See `.cursorrules` for comprehensive development standards including:
- Code style guidelines
- Architecture principles
- Naming conventions
- Testing guidelines
- Security checklist

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - SQLite database path
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SOCKET_URL` - Socket.io server URL

## Next Steps

1. Set up database schema in `backend/db/schema.sql`
2. Implement database connection in `backend/db/connection.js`
3. Create API routes in `backend/routes/`
4. Implement services (prioritizer, AI assistant)
5. Build frontend components and pages

## License

ISC

