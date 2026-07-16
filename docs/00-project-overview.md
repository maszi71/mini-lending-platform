# Mini Lending Platform Overview

## Goal

Build a full-stack mini lending platform as a learning project.

The main purpose is to practice backend development with NestJS, PostgreSQL, Prisma, authentication, role-based access, business workflows, and frontend integration while keeping the frontend familiar with React.

## Product Idea

We will build a small lending platform with two experiences:

- Customer panel
- Admin panel

A customer can create and submit a loan application. An admin can review the application, approve or reject it, and if approved, the system creates an installment schedule.

The project is inspired by fintech lending workflows, but it is not intended to copy any real company product.

## Phase 1 Scope

Phase 1 is the MVP we want to finish first.

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

## Phase 2 Scope

Phase 2 contains optional features if we have time after the MVP works.

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

## Initial Domain Model Draft

Main entities:

- `User`
- `LoanApplication`
- `Collateral`
- `Installment`
- `Payment`
- `AuditLog`

Initial roles:

- `CUSTOMER`
- `ADMIN`

Initial loan statuses:

- `DRAFT`
- `SUBMITTED`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `CANCELLED`

Initial installment statuses:

- `PENDING`
- `PAID`
- `OVERDUE`

Initial loan application form steps:

- `LOAN_DETAILS`
- `FINANCIAL_PROFILE`
- `COLLATERAL`
- `REVIEW`

## Open Questions

- Which fields should be required on the first version of a loan application?
- Should collateral be required before submitting an application?
- Should admin approval allow changing amount, duration, and interest rate?
- What interest calculation should we use for the MVP?
