# Decision Log

This file records important project decisions and the reason behind each one.

## 2026-07-16 - Use Documentation From The Start

Decision:

Create documentation files and record important project decisions before or during implementation.

Reason:

- This is a learning project.
- The user wants to understand why decisions are made.
- Keeping a written record makes it easier to review architecture and business rules later.

## 2026-07-16 - Frontend Stack

Decision:

Use React + Vite + TypeScript.

Reason:

- The main learning goal is backend, so the frontend should stay familiar and lightweight.
- React + Vite is fast to set up.
- We do not need SSR for this project.

## 2026-07-16 - Frontend Structure

Decision:

Use one React app with separate customer and admin areas.

Reason:

- One app keeps the project simpler for a 2-3 day learning scope.
- We can still practice role-based routing and different layouts.
- The customer and admin panels can share the same API client, auth state, and design system.

## 2026-07-16 - Backend Stack

Decision:

Use NestJS.

Reason:

- NestJS gives us useful company-style backend patterns.
- We can practice modules, controllers, services, DTOs, validation, guards, and dependency injection.
- It is more structured than Express, which is useful for the user's backend learning goal.

## 2026-07-16 - Database

Decision:

Use PostgreSQL.

Reason:

- Good fit for relational fintech data.
- Useful for practicing relations, filtering, aggregation, and transactional thinking.

## 2026-07-16 - ORM

Decision:

Use Prisma.

Reason:

- Productive and type-safe.
- Easier to start with than TypeORM.
- Good migration workflow with PostgreSQL.

## 2026-07-16 - Local Database Infrastructure

Decision:

Use Docker for PostgreSQL.

Reason:

- Keeps local database setup predictable.
- Lets us practice basic Docker without overcomplicating the whole app at the beginning.

## 2026-07-16 - Repository Structure

Decision:

Use a monorepo-style project folder.

Planned structure:

```txt
mini-lending-platform/
├── backend/
│   └── NestJS + Prisma + PostgreSQL
├── frontend/
│   └── React + Vite + TypeScript
├── docs/
│   ├── 00-project-overview.md
│   ├── 01-decisions.md
│   └── 02-learning-notes.md
└── docker-compose.yml
```

Reason:

- Keeps frontend and backend separated.
- Makes the project easy to run locally.
- Lets us document decisions beside the code.

## 2026-07-16 - Working Style

Decision:

Treat the project as a guided learning project, not only a code generation task.

Reason:

- The user wants to understand the correct flow of building a real project.
- Before each major implementation step, we should discuss what we are building and why.
- We should record decisions and learning notes as the project evolves.

## 2026-07-16 - Repository Name

Decision:

Use `mini-lending-platform` as the GitHub repository name.

Reason:

- It is clear and professional.
- It describes the product directly.
- It matches the planned project folder name in the documentation.

## 2026-07-16 - User Roles For Phase 1

Decision:

Use only two user roles in Phase 1:

- `CUSTOMER`
- `ADMIN`

Reason:

- These two roles are enough to support the main lending workflow.
- More roles such as support agent, risk analyst, or super admin can be added later if needed.
- Keeping the first version focused makes the backend easier to understand and finish.

## 2026-07-16 - Draft-Based Loan Application Workflow

Decision:

Loan applications start as `DRAFT`. A customer can edit a draft application and later submit it for review. After submission, the application moves to `SUBMITTED` and should no longer be freely editable by the customer.

Reason:

- `DRAFT` represents a loan request that the customer has started but has not officially sent for review.
- This matches real-world workflows for applications, forms, contracts, invoices, and tickets.
- It lets the backend enforce useful business rules instead of simple CRUD behavior.
- It creates a clear status workflow: `DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED` or `REJECTED`.
