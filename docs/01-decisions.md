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

## 2026-07-16 - MVP Loan Data

Decision:

Use a focused set of loan application fields for the MVP.

Loan details:

- `requestedAmount`
- `requestedDurationMonths`
- `purpose`
- `description`

Financial profile:

- `monthlyIncome`
- `employmentType`
- `existingMonthlyDebt`

Collateral:

- `type`
- `estimatedValue`
- `description`

Admin approval data:

- `approvedAmount`
- `approvedDurationMonths`
- `annualInterestRate`
- `decisionReason`

System tracking data:

- `status`
- `currentStep`
- `submittedAt`
- `reviewedAt`

Reason:

- These fields are enough to represent the core lending story.
- The customer can request an amount and duration.
- The customer can explain the purpose and provide basic repayment information.
- The customer can provide collateral.
- The admin can approve with final terms or reject with a reason.
- The system can track workflow status, draft progress, and review timestamps.

## 2026-07-16 - MVP Business Rules

Decision:

Use explicit backend-enforced business rules for the loan application workflow.

Rules:

- Customers create loan applications only as `DRAFT`.
- Customers can edit only their own `DRAFT` applications.
- Customers can cancel only their own `DRAFT` or `SUBMITTED` applications.
- Customers cannot cancel after an application is `UNDER_REVIEW`.
- Customers can move to the next form step only when the current step has valid data.
- Customers can submit only their own `DRAFT` applications.
- Submission requires loan details, financial profile data, and at least one collateral.
- After submit, customers cannot edit application fields or collateral fields.
- Admins must start review before approving or rejecting.
- Admins can approve or reject only `UNDER_REVIEW` applications.
- Approval requires approved amount, approved duration, and annual interest rate.
- Approved amount must be less than or equal to requested amount.
- Rejection requires a decision reason.
- Approval creates installments automatically.
- Phase 1 supports full installment payment only.
- Paid installments cannot be paid again.
- The system writes audit logs for important workflow actions.

Reason:

- These rules make the app more realistic than simple CRUD.
- The backend must protect workflow correctness even if the frontend has bugs.
- Explicit rules make API design, validation, testing, and later database modeling clearer.

## 2026-07-16 - MVP Interest Calculation

Decision:

Use a simple fixed-interest calculation for Phase 1.

Formula:

```txt
totalInterest = approvedAmount * (annualInterestRate / 100) * approvedDurationMonths / 12
totalPayable = approvedAmount + totalInterest
monthlyInstallment = totalPayable / approvedDurationMonths
```

Reason:

- It is easy to understand.
- It is enough for practicing installment generation.
- It avoids overcomplicating the MVP with amortization formulas.
- More realistic interest calculations can be added later.
- `annualInterestRate` is stored as a percentage number. For example, `24` means `24%`.

## 2026-07-16 - Domain Model Entities

Decision:

Use these main entities for the MVP:

- `User`
- `LoanApplication`
- `Collateral`
- `Installment`
- `Payment`
- `AuditLog`

Reason:

- They represent the core lending workflow without adding unnecessary complexity.
- They map cleanly to the customer/admin flows.
- They are enough to support application review, collateral, installments, mock payments, and audit history.

## 2026-07-16 - No Separate Loan Entity For MVP

Decision:

Do not create a separate `Loan` entity in Phase 1. Use `LoanApplication` as the main record before and after approval.

Reason:

- Before approval, the record is a request.
- After approval, the same record stores approved terms and has installments.
- A separate `Loan` table can be added later if the system becomes more complex.
- Keeping one main record makes the MVP easier to understand and implement.

## 2026-07-16 - Money And Rate Fields Use Decimal

Decision:

Use `Decimal` for money and rate fields.

Examples:

- `requestedAmount`
- `monthlyIncome`
- `existingMonthlyDebt`
- `approvedAmount`
- `annualInterestRate`
- `estimatedValue`
- `principalAmount`
- `interestAmount`
- `totalAmount`
- `paidAmount`
- `Payment.amount`

Reason:

- Money should be stored precisely.
- Floating-point numbers can create rounding issues.
- Prisma and PostgreSQL support decimal values well.

## 2026-07-16 - Keep Paid Amount On Installment

Decision:

Store `paidAmount` on `Installment` even though Phase 1 only supports full installment payment.

Reason:

- In Phase 1, `paidAmount` will be either zero or equal to `totalAmount`.
- The field makes payment state easy to display.
- It prepares the model for partial payments in a later phase.

## 2026-07-16 - Store Reviewer On Loan Application

Decision:

Store `reviewedById` on `LoanApplication`.

Reason:

- It records which admin reviewed the application.
- It supports auditability and admin accountability.
- It is useful for dashboard/reporting later.

## 2026-07-16 - Audit Metadata

Decision:

Store extra audit log details in a JSON `metadata` field.

Reason:

- Different audit actions need different details.
- JSON lets us store action-specific context without creating many nullable columns.
- It is useful for recording old/new statuses, rejection reasons, generated installment counts, and payment references.

## 2026-07-16 - API Contract Groups

Decision:

Group the API contract by product capability:

- Auth APIs
- Customer Loan APIs
- Collateral APIs
- Admin Review APIs
- Installment and Payment APIs
- Dashboard APIs
- Admin Audit Log APIs

Reason:

- Grouping endpoints by capability makes the backend easier to navigate.
- It maps cleanly to NestJS modules and Swagger tags.
- It helps frontend work because each UI area has a clear API surface.

## 2026-07-16 - Stepper Save Endpoints

Decision:

Use separate endpoints for saving customer loan application steps.

Examples:

- `PATCH /loans/:id/loan-details`
- `PATCH /loans/:id/financial-profile`
- `PATCH /loans/:id/current-step`

Reason:

- The frontend uses a stepper form.
- Separate endpoints make validation and business rules easier to understand.
- Each endpoint maps to a clear user action.

## 2026-07-16 - Pagination Standard

Decision:

Use page-based pagination for list endpoints.

Query params:

- `page`
- `limit`

Defaults:

- `page = 1`
- `limit = 10`

Maximum:

- `limit = 50`

Response shape:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 57,
    "totalPages": 6
  }
}
```

Paginated endpoints:

- `GET /loans/my`
- `GET /admin/loans`
- `GET /admin/audit-logs`

Reason:

- Pagination prevents APIs from returning too much data at once.
- The response shape is predictable for the frontend.
- The same pagination style can be reused across the backend.

## 2026-07-16 - Swagger API Documentation

Decision:

Use Swagger/OpenAPI for backend API documentation and expose it at `/api/docs`.

Reason:

- Swagger makes the API visible and testable during development.
- It helps the frontend understand endpoint shapes and auth requirements.
- It is useful for learning NestJS DTOs, decorators, and API contracts.
- It can reduce the need for Postman during early development.

## 2026-07-16 - Reusable Project Flow Documentation

Decision:

Create `docs/03-project-flow.md` to document the reusable flow from idea to implementation.

Reason:

- The user wants to learn the correct direction for future projects.
- A diagram makes the full process easier to remember.
- The flow connects product thinking to backend, database, API, and frontend implementation.

## 2026-07-16 - Prisma Schema Design Document

Decision:

Create `docs/04-prisma-schema-design.md` before implementing the actual Prisma schema.

Reason:

- It lets us review models, fields, relations, indexes, and constraints before coding.
- It keeps the actual implementation grounded in the domain model and business rules.
- It gives the user a clear explanation of how domain concepts become database models.
