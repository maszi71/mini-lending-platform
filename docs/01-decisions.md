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

## 2026-07-16 - User Profile Fields

Decision:

Store the user's name as separate `firstName` and `lastName` fields. Also store `email`, `phoneNumber`, and `birthDate`.

Reason:

- Separate first and last names are easier to display, search, and reuse in formal documents later.
- Phone number is useful for fintech workflows and future OTP support.
- Birth date is useful for identity and eligibility checks.
- Email and phone number should both be unique.

## 2026-07-16 - Login Identifier

Decision:

Use one login field called `identifier`, plus `password`. The identifier can be either email or phone number.

Reason:

- This gives users a simpler login experience.
- The backend can find the user with `email = identifier OR phoneNumber = identifier`.
- Unique email and phone number constraints prevent ambiguous login matches.

## 2026-07-16 - Stepper-Based Loan Application Form

Decision:

Use a multi-step form for customer loan applications instead of one large form.

Initial steps:

- `LOAN_DETAILS`
- `FINANCIAL_PROFILE`
- `COLLATERAL`
- `REVIEW`

Reason:

- Loan applications can feel heavy if all fields are shown at once.
- A stepper gives clearer progress and better UX.
- It makes draft saving easier to understand.
- Each step maps naturally to backend validation and saved draft data.

## 2026-07-16 - Store Current Application Step

Decision:

Store draft progress with a `currentStep` enum on the loan application.

Initial enum values:

- `LOAN_DETAILS`
- `FINANCIAL_PROFILE`
- `COLLATERAL`
- `REVIEW`

Reason:

- If the user refreshes, logs out, or comes back later, the app can restore the draft at the correct step.
- Enum values are more readable than numeric step values.
- `currentStep` represents form progress, not the business review status.

## 2026-07-16 - Separate Business Status From Form Progress

Decision:

Keep loan business status separate from loan application form progress.

Examples:

- `status = DRAFT`
- `currentStep = COLLATERAL`

Reason:

- `status` describes the business workflow, such as `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, or `REJECTED`.
- `currentStep` describes where the customer is inside the draft form.
- Separating them prevents UI progress from being confused with real business state.
