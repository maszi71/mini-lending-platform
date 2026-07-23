# Implementation Status

This file tracks what has been implemented and what is still pending.

## Implemented

### Documentation Foundation

- Product overview
- Decision log
- Learning notes
- Reusable project flow
- Prisma schema design

### Repository Foundation

- Git repository initialized
- GitHub remote connected
- README created
- `.gitignore` created

### Backend Scaffold

- NestJS backend created in `backend/`
- npm used as the package manager
- Default Nest build/test/lint setup is available

### Database Infrastructure

- Docker Compose PostgreSQL service added
- PostgreSQL container runs as `mini_lending_postgres`
- Local host port is `5433`
- Database name is `mini_lending`
- `.env.example` files added

### Prisma Foundation

- Prisma 7 installed
- Prisma PostgreSQL adapter installed
- `backend/prisma.config.ts` added
- `backend/prisma/schema.prisma` added
- Initial migration created and applied
- Generated Prisma Client is ignored and regenerated with npm scripts

### Backend Configuration

- `@nestjs/config` installed
- `ConfigModule` configured globally
- Environment validation added
- Required environment values:
  - `PORT`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`

### Prisma Access Layer

- `PrismaModule` added
- `PrismaService` added
- Prisma connects on module init
- Prisma disconnects on module destroy

### Swagger Foundation

- `@nestjs/swagger` installed
- Swagger UI configured at `/api/docs`
- Bearer auth support added to Swagger
- Global validation pipe enabled

### Auth Foundation

- `AuthModule` added
- `AuthController` added
- `AuthService` added
- `JwtStrategy` added
- `JwtAuthGuard` added
- `CurrentUser` decorator added
- `Roles` decorator added
- `RolesGuard` added

Implemented auth endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Auth behavior:

- Public registration creates only `CUSTOMER` users
- Login accepts `identifier` and `password`
- `identifier` can be email or phone number
- Passwords are hashed with bcrypt
- Login returns JWT access token and user profile
- `/auth/me` requires bearer token

### Admin Seed

- `backend/prisma/seed.ts` added
- `npm run prisma:seed` command added
- Seed reads admin values from environment variables
- Seed hashes the admin password with bcrypt
- Seed creates an `ADMIN` user
- Seed is idempotent and skips creation when the admin already exists

Seed environment variables:

- `SEED_ADMIN_FIRST_NAME`
- `SEED_ADMIN_LAST_NAME`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PHONE_NUMBER`
- `SEED_ADMIN_BIRTH_DATE`
- `SEED_ADMIN_PASSWORD`

## Pending

### Backend

- Seed admin user
- Add role-protected admin routes
- Add loan application module
- Add collateral module
- Add admin review workflow
- Add installment generation
- Add mock payment
- Add dashboards
- Add audit log writes
- Add pagination helper/query DTOs
- Add e2e tests for auth and loan workflows

### Frontend

- Scaffold React + Vite frontend
- Add routing
- Add auth pages
- Add customer panel
- Add admin panel
- Connect to backend API

## Latest Verified Commands

These commands should pass after the current backend foundation work:

```bash
cd backend
npm run prisma:validate
npm run lint
npm run build
npm test -- --runInBand
npm audit --audit-level=moderate
```

Current verification result:

- Prisma schema validation passes
- ESLint passes
- Nest build passes
- Default unit test passes
- Last successful npm audit after dependency fixes reported zero vulnerabilities
- Root endpoint returns `200 OK`
- Swagger UI responds at `/api/docs`
- Swagger JSON responds at `/api/docs-json`
- Register validation returns `400 Bad Request` for invalid input
- `POST /auth/register` creates a `CUSTOMER`
- duplicate register returns `409 Conflict`
- `POST /auth/login` works with email and phone number
- invalid login returns `401 Unauthorized`
- `GET /auth/me` returns the current user with a valid bearer token
- `GET /auth/me` without a token returns `401 Unauthorized`
- `npm run start:dev` starts successfully in watch mode
- `npm run prisma:seed` creates the admin user on first run
- running `npm run prisma:seed` again skips the existing admin
- seeded admin can log in with email
- seeded admin can log in with phone number
- seeded admin `/auth/me` returns role `ADMIN`

Runtime testing requires Docker Desktop/PostgreSQL to be running locally.

Note: the latest `npm audit --audit-level=moderate` retry failed because the npm audit registry endpoint returned an error. It did not report a dependency vulnerability.
