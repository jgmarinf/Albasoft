# Project and User Management

This is a full-stack application for project and user management, built with:

- **Frontend**: Next.js (TypeScript)
- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v15+)
- npm (v9+)

## Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-user/your-repo.git
   cd your-repo
   ```

2. **Configure environment variables**:
   - Create `.env.local` in `frontend/`:
     ```env
     NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
     NEXTAUTH_SECRET=your_secret_here
     ```
   - Create `.env` in `backend/`:
     ```env
     DB_URL_PORT=postgres://user:password@localhost:5432/nest_db
     PORT=3001
     JWT_SECRET=your_jwt_secret
     ```

3. **Install dependencies**:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

## Local Development

1. **Start the backend**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001/api

## Project Structure 
