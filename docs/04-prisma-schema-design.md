# Prisma Schema Design

This file translates the domain model into a planned Prisma schema.

It is still a design document. The actual schema will be implemented later in:

```txt
backend/prisma/schema.prisma
```

## Design Decisions

- Use PostgreSQL as the database provider.
- Use Prisma Client as the backend database access layer.
- Use `String` IDs with `uuid()` defaults.
- Use `Decimal` for money and rate fields.
- Use `Json` for flexible audit metadata.
- Use explicit relation names where one model relates to another model in more than one way.
- Use indexes on common filter and lookup fields.

## Enums

```prisma
enum UserRole {
  CUSTOMER
  ADMIN
}

enum LoanStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
  CANCELLED
}

enum LoanApplicationStep {
  LOAN_DETAILS
  FINANCIAL_PROFILE
  COLLATERAL
  REVIEW
}

enum LoanPurpose {
  BUSINESS
  HOME_RENOVATION
  EDUCATION
  MEDICAL
  DEBT_CONSOLIDATION
  PERSONAL
  OTHER
}

enum EmploymentType {
  SALARIED
  SELF_EMPLOYED
  BUSINESS_OWNER
  FREELANCER
  UNEMPLOYED
  RETIRED
  OTHER
}

enum CollateralType {
  CHEQUE
  SALARY_CERTIFICATE
  GOLD
  STOCK
  CRYPTO
  PROPERTY_DOCUMENT
  VEHICLE_DOCUMENT
  OTHER
}

enum CollateralStatus {
  PENDING
  ACCEPTED
  REJECTED
}

enum InstallmentStatus {
  PENDING
  PAID
  OVERDUE
}

enum PaymentMethod {
  MOCK
}

enum AuditAction {
  APPLICATION_CREATED
  APPLICATION_UPDATED
  APPLICATION_SUBMITTED
  REVIEW_STARTED
  APPLICATION_APPROVED
  APPLICATION_REJECTED
  INSTALLMENTS_CREATED
  INSTALLMENT_PAID
}
```

## Models

### User

```prisma
model User {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  email        String   @unique
  phoneNumber  String   @unique
  birthDate    DateTime
  passwordHash String
  role         UserRole @default(CUSTOMER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  loanApplications    LoanApplication[] @relation("CustomerLoanApplications")
  reviewedApplications LoanApplication[] @relation("ReviewedLoanApplications")
  auditLogs           AuditLog[]        @relation("ActorAuditLogs")

  @@index([role])
  @@index([createdAt])
}
```

Notes:

- `email` is unique because it is used for registration and login.
- `phoneNumber` is unique because it can also be used for login.
- `role` is indexed because admin/customer filtering may be useful later.

### LoanApplication

```prisma
model LoanApplication {
  id                      String              @id @default(uuid())
  customerId              String
  requestedAmount          Decimal?
  requestedDurationMonths  Int?
  purpose                 LoanPurpose?
  description             String?
  monthlyIncome            Decimal?
  employmentType           EmploymentType?
  existingMonthlyDebt      Decimal?
  status                  LoanStatus          @default(DRAFT)
  currentStep              LoanApplicationStep @default(LOAN_DETAILS)
  approvedAmount           Decimal?
  approvedDurationMonths   Int?
  annualInterestRate       Decimal?
  decisionReason           String?
  reviewedById             String?
  submittedAt              DateTime?
  reviewedAt               DateTime?
  createdAt                DateTime            @default(now())
  updatedAt                DateTime            @updatedAt

  customer     User          @relation("CustomerLoanApplications", fields: [customerId], references: [id])
  reviewedBy   User?         @relation("ReviewedLoanApplications", fields: [reviewedById], references: [id])
  collaterals  Collateral[]
  installments Installment[]
  auditLogs    AuditLog[]

  @@index([customerId])
  @@index([status])
  @@index([currentStep])
  @@index([createdAt])
  @@index([submittedAt])
  @@index([reviewedById])
}
```

Notes:

- Request fields are optional at the database level because a draft may be incomplete.
- Backend validation decides which fields are required before moving steps or submitting.
- Approved fields are optional because they exist only after admin approval.
- `reviewedById` is optional because a new application may not be reviewed yet.
- `annualInterestRate` stores a percentage number. For example, `24` means `24%`.

### Collateral

```prisma
model Collateral {
  id                String           @id @default(uuid())
  loanApplicationId String
  type              CollateralType
  estimatedValue    Decimal
  description       String?
  status            CollateralStatus @default(PENDING)
  reviewerNote      String?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  loanApplication LoanApplication @relation(fields: [loanApplicationId], references: [id])

  @@index([loanApplicationId])
  @@index([status])
}
```

Notes:

- Collateral belongs to a loan application.
- Collateral can be reviewed by admin as accepted or rejected.

### Installment

```prisma
model Installment {
  id                String            @id @default(uuid())
  loanApplicationId String
  installmentNumber Int
  dueDate           DateTime
  principalAmount   Decimal
  interestAmount    Decimal
  totalAmount       Decimal
  paidAmount        Decimal           @default(0)
  status            InstallmentStatus @default(PENDING)
  paidAt            DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  loanApplication LoanApplication @relation(fields: [loanApplicationId], references: [id])
  payments        Payment[]

  @@unique([loanApplicationId, installmentNumber])
  @@index([loanApplicationId])
  @@index([status])
  @@index([dueDate])
}
```

Notes:

- `installmentNumber` is unique per loan application.
- `paidAmount` supports the MVP and prepares for partial payment later.

### Payment

```prisma
model Payment {
  id              String        @id @default(uuid())
  installmentId   String
  amount          Decimal
  method          PaymentMethod @default(MOCK)
  referenceNumber String        @unique
  paidAt          DateTime      @default(now())
  createdAt       DateTime      @default(now())

  installment Installment @relation(fields: [installmentId], references: [id])

  @@index([installmentId])
  @@index([paidAt])
}
```

Notes:

- `referenceNumber` is unique so every mock payment can be traced.
- For Phase 1, payment method is only `MOCK`.

### AuditLog

```prisma
model AuditLog {
  id                String      @id @default(uuid())
  actorId           String
  loanApplicationId String?
  action            AuditAction
  metadata          Json?
  createdAt         DateTime    @default(now())

  actor           User             @relation("ActorAuditLogs", fields: [actorId], references: [id])
  loanApplication LoanApplication? @relation(fields: [loanApplicationId], references: [id])

  @@index([actorId])
  @@index([loanApplicationId])
  @@index([action])
  @@index([createdAt])
}
```

Notes:

- Audit logs record important system actions.
- `loanApplicationId` is optional so the table can later support logs unrelated to a specific loan.
- `metadata` stores action-specific details.

## Validation Responsibility

Not every business rule belongs directly in the database schema.

Prisma/database should handle:

- Required fields that are always required
- Unique constraints
- Relations
- Indexes
- Basic data types

Backend services and DTOs should handle:

- Draft step validation
- Submit validation
- Status transitions
- Permission checks
- Approval rules
- Installment generation
- Payment rules

Example:

`requestedAmount` is optional in the database because a draft can be incomplete.

But `POST /loans/:id/submit` must reject the request if `requestedAmount` is missing.

## Index Reasoning

Indexes are planned for fields we commonly search, filter, sort, or join by.

Examples:

- `LoanApplication.status` for admin filtering.
- `LoanApplication.customerId` for customer application lists.
- `Installment.dueDate` for overdue checks.
- `AuditLog.action` and `AuditLog.createdAt` for audit filtering and sorting.

Indexes improve read performance, but too many indexes can slow writes. For the MVP, these indexes are reasonable and focused.
