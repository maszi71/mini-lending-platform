# Mini Lending Platform

A full-stack learning project for practicing backend development with NestJS, PostgreSQL, Prisma, authentication, role-based access, and fintech-style business workflows.

## Idea

Mini Lending Platform is a small fintech-inspired app with two user experiences:

- Customer panel
- Admin panel

Customers can create loan applications, add collateral information, submit applications for review, track their status, view generated installments after approval, and make mock installment payments.

Admins can review submitted applications, inspect collateral, approve or reject requests, and track important actions through audit logs.

## Learning Goal

The main goal is not only to build a working app, but to understand the real-world flow of creating a full-stack product:

1. Define product idea
2. Define MVP scope
3. Define user roles
4. Define user flows
5. Convert flows into features
6. Define business rules
7. Design domain model
8. Design API contract
9. Design database schema
10. Implement backend first
11. Connect frontend

## Tech Stack

### Backend

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT authentication
- Role-based authorization

### Frontend

- React
- Vite
- TypeScript

### Infrastructure

- Docker for local PostgreSQL

## Phase 1: MVP

- Auth with JWT
- Role-based access with `CUSTOMER` and `ADMIN`
- PostgreSQL with Docker
- Prisma schema and migrations
- Customer loan application flow
- Collateral creation
- Submit application workflow
- Admin review queue
- Admin approve/reject workflow
- Installment schedule generation
- Mock installment payment
- Basic dashboard
- Audit logs

## Phase 2: Optional Improvements

- File upload for collateral documents
- OTP login
- KYC profile
- Credit score simulation
- Risk scoring
- Background job to mark overdue installments
- PDF loan contract
- Email/SMS notification mock
- Dockerized frontend/backend production setup
- Tests

## Planned Structure

```txt
mini-lending-platform/
├── backend/
│   └── NestJS + Prisma + PostgreSQL
├── frontend/
│   └── React + Vite + TypeScript
├── docs/
│   ├── 00-project-overview.md
│   ├── 01-decisions.md
│   ├── 02-learning-notes.md
│   ├── 03-project-flow.md
│   ├── 04-prisma-schema-design.md
│   └── project-notes.md
└── docker-compose.yml
```

## Documentation

- [Project overview](./docs/00-project-overview.md)
- [Decision log](./docs/01-decisions.md)
- [Learning notes](./docs/02-learning-notes.md)
- [Documentation index](./docs/project-notes.md)
- [Project flow](./docs/03-project-flow.md)
- [Prisma schema design](./docs/04-prisma-schema-design.md)

## Local Development

Start PostgreSQL:

```bash
docker compose up -d postgres
```

PostgreSQL is exposed locally on port `5433` to avoid conflicts with any existing local PostgreSQL server on `5432`.

Backend setup:

```bash
cd backend
npm install
npm run prisma:migrate -- --name init
npm run start:dev
```

Useful backend commands:

```bash
npm run prisma:validate
npm run prisma:generate
npm run build
npm test -- --runInBand
```

## Current Product Decisions

- Phase 1 has two roles: `CUSTOMER` and `ADMIN`.
- Loan applications start as `DRAFT`.
- Customers can edit draft applications.
- Customers submit drafts when ready for review.
- Submitted applications are reviewed by admins.
- Approval creates an installment schedule.

## Status

Backend scaffold, Docker PostgreSQL setup, and initial Prisma schema are in progress.
