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

## MVP Loan Data

### Loan Details

- `requestedAmount`
- `requestedDurationMonths`
- `purpose`
- `description`

### Financial Profile

- `monthlyIncome`
- `employmentType`
- `existingMonthlyDebt`

### Collateral

- `type`
- `estimatedValue`
- `description`

### Admin Approval Data

- `approvedAmount`
- `approvedDurationMonths`
- `annualInterestRate`
- `decisionReason`

### System Tracking Data

- `status`
- `currentStep`
- `submittedAt`
- `reviewedAt`

## MVP Business Rules

### Draft Rules

- Customers create loan applications only as `DRAFT`.
- Customers can edit only their own `DRAFT` applications.
- Customers can cancel only their own `DRAFT` or `SUBMITTED` applications.
- Customers cannot cancel after an application is `UNDER_REVIEW`.

### Step Progress Rules

- `currentStep` tracks draft form progress only.
- `currentStep` does not replace the business `status`.
- Customers can move to the next step only when the current step has valid data.

### Submit Rules

- Customers can submit only their own `DRAFT` applications.
- Submission requires complete loan details.
- Submission requires complete financial profile data.
- Submission requires at least one collateral.
- On submit, status changes from `DRAFT` to `SUBMITTED`.
- On submit, `submittedAt` is set.
- After submit, customers cannot edit application fields or collateral fields.

### Admin Review Rules

- Admins can list all applications.
- Admins can start review only for `SUBMITTED` applications.
- Starting review changes status from `SUBMITTED` to `UNDER_REVIEW`.
- Admins can approve only `UNDER_REVIEW` applications.
- Admins can reject only `UNDER_REVIEW` applications.

### Approval Rules

- Approval requires `approvedAmount`.
- Approval requires `approvedDurationMonths`.
- Approval requires `annualInterestRate`.
- `approvedAmount` must be less than or equal to `requestedAmount`.
- `annualInterestRate` must be positive.
- On approval, status changes from `UNDER_REVIEW` to `APPROVED`.
- On approval, `reviewedAt` is set.
- On approval, the system creates installments automatically.

### Rejection Rules

- Rejection requires `decisionReason`.
- On rejection, status changes from `UNDER_REVIEW` to `REJECTED`.
- On rejection, `reviewedAt` is set.
- Rejected applications do not get installments.

### Installment Rules

- Installments are created only for `APPROVED` applications.
- Customers can see installments only for their own approved applications.
- Customers can pay only their own pending or overdue installments.
- Phase 1 supports full installment payment only.
- Paid installments cannot be paid again.

### Audit Log Rules

- The system creates audit logs for important actions.
- Important actions include application creation, update, submission, review start, approval, rejection, installment creation, and installment payment.

## MVP Interest Calculation

Use a simple fixed-interest calculation for Phase 1.

Formula:

```txt
totalInterest = approvedAmount * annualInterestRate * approvedDurationMonths / 12
totalPayable = approvedAmount + totalInterest
monthlyInstallment = totalPayable / approvedDurationMonths
```

Example:

```txt
approvedAmount = 100,000,000
annualInterestRate = 24%
approvedDurationMonths = 12

totalInterest = 24,000,000
totalPayable = 124,000,000
monthlyInstallment = 10,333,333
```

This is intentionally simple for the MVP. More realistic amortized loan calculations can be added later.
