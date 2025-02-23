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

```
.
├── backend/            # NestJS API
│   ├── src/            # Source code
│   ├── test/           # Tests
│   └── ...            
├── frontend/           # Next.js application
│   ├── src/            # Source code
│   └── ...            
└── README.md           # This file
```

## Database Configuration

The database should contain the following tables:

- **Users**: Stores user information such as name, email, and role.
- **Projects**: Stores project details like name and description.
- **User-Project Relationship**: A relational table that connects users with projects, allowing a user to be associated with multiple projects and vice versa.

### Relationships

- A user can be an administrator of multiple projects.
- A project can have multiple associated users.
- The ORM configurations in the backend (`src/users/entities/user.entity.ts` and `src/projects/entities/project.entity.ts`) define these relationships using TypeORM.

You can use your own PostgreSQL database to run the project locally. Ensure that the tables and relationships are set up correctly according to the entities defined in the backend.

## Production Deployment

For production server setup, refer to [SERVER_SETUP.md](backend/SERVER_SETUP.md) which includes:

- EC2 configuration
- PM2 deployment
- Nginx setup
- SSL certificate with Let's Encrypt

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)
