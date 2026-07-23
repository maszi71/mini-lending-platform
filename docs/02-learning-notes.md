# Learning Notes

This file records product, backend, database, and architecture concepts we learn during the project.

## Product Idea

A product idea is the high-level description of what we are building, who it serves, and what problem it solves.

In this project, the product idea is a mini lending platform where customers apply for loans and admins review those applications.

## MVP

MVP means Minimum Viable Product.

It is the smallest useful version of the product that can be built, tested, and improved.

For this project, the MVP is Phase 1: auth, loan application flow, collateral, admin review, installment generation, mock payment, dashboard, and audit logs.

## Phase

A phase is a planned delivery step.

We use phases to separate must-have features from later improvements.

In this project:

- Phase 1 is the MVP.
- Phase 2 is optional improvement work if there is time.

## User Role

A user role describes what type of user is using the system and what they are allowed to do.

Examples in this project:

- `CUSTOMER`
- `ADMIN`

Roles are important because they affect both frontend routing and backend authorization.

## User Flow

A user flow is the step-by-step path a user follows to complete a task.

Example customer flow:

```txt
Register
Login
Create loan application
Add collateral
Submit application
Wait for review
View decision
View installments after approval
Pay installment with mock payment
```

## Stepper

A stepper is a UI pattern that breaks a larger process into smaller ordered steps.

In this project, the loan application form will use these steps:

```txt
LOAN_DETAILS
FINANCIAL_PROFILE
COLLATERAL
REVIEW
```

A stepper is useful when one large form would feel too heavy or confusing.

## Form Progress

Form progress describes where the user is inside a multi-step form.

In this project, form progress is stored as `currentStep`.

Example:

```txt
currentStep = COLLATERAL
```

This means the customer was last working on the collateral step.

Form progress is different from business status.

## Business Status Vs Form Progress

Business status describes the real lifecycle of a business record.

Form progress describes where the user is in the UI while creating or editing that record.

Example:

```txt
status = DRAFT
currentStep = COLLATERAL
```

This means the loan application is still only a draft, and the customer last reached the collateral step.

This separation matters because backend business rules should depend mostly on business status, while the frontend stepper depends on form progress.

## Feature

A feature is a product capability that supports a user flow.

Example:

The customer flow needs a "create loan application" feature.

That feature may require:

- A frontend form
- A backend endpoint
- DTO validation
- Database records
- Authorization rules

## Entity

An entity is a business object or concept that the system needs to store, process, or reason about.

Examples in this project:

- `User`
- `LoanApplication`
- `Collateral`
- `Installment`
- `Payment`
- `AuditLog`

Entities usually become database tables, Prisma models, and backend concepts.

## Domain Model

A domain model describes the important business objects in the system and how they relate to each other.

In this project, the domain model includes:

- `User`
- `LoanApplication`
- `Collateral`
- `Installment`
- `Payment`
- `AuditLog`

Domain modeling comes before database implementation because we first need to understand the business concepts before turning them into tables.

## Relationship

A relationship describes how entities connect to each other.

Examples in this project:

- A `User` has many `LoanApplication` records.
- A `LoanApplication` belongs to one `User`.
- A `LoanApplication` has many `Collateral` records.
- An `Installment` has many `Payment` records.

Relationships become Prisma relations and database foreign keys.

## Decimal

`Decimal` is a precise numeric type used for money and rates.

Money should not be stored with floating-point types because floats can produce rounding errors.

Example:

```txt
0.1 + 0.2
```

In many programming environments, this does not produce exactly `0.3` with floating-point math.

For this project, fields like `requestedAmount`, `approvedAmount`, `annualInterestRate`, and `totalAmount` should use `Decimal`.

## JSON Metadata

JSON metadata is flexible structured data stored with a record.

In this project, `AuditLog.metadata` can store different details for different actions.

Examples:

```json
{
  "oldStatus": "UNDER_REVIEW",
  "newStatus": "APPROVED",
  "approvedAmount": "100000000"
}
```

or:

```json
{
  "installmentId": "abc123",
  "amount": "10333333",
  "referenceNumber": "MOCK-123"
}
```

This avoids creating many optional columns for action-specific audit details.

## Business Rule

A business rule is a condition that controls what the system allows, blocks, or automatically performs.

Examples:

- A customer cannot submit a loan application without collateral.
- A customer can edit a draft application.
- A customer cannot edit a submitted application.
- Only an admin can approve or reject applications.
- Approving a loan creates an installment schedule.

Business rules should be enforced by the backend, not only by the frontend.

Backend enforcement matters because frontend checks can be bypassed, broken, or skipped by direct API calls.

Example:

Even if the frontend hides the submit button until collateral exists, the backend must still reject a submit request when the application has no collateral.

Business rules help shape:

- DTO validation
- Service logic
- Database constraints
- API error cases
- Automated tests

## State Workflow

A state workflow describes how a record moves through different statuses over time.

In this project, a loan application is not just created, edited, and deleted. It moves through meaningful states:

```txt
DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED
DRAFT -> SUBMITTED -> UNDER_REVIEW -> REJECTED
```

Each state has rules.

Examples:

- A customer can edit a `DRAFT` application.
- A customer can submit only a `DRAFT` application.
- A customer should not freely edit a `SUBMITTED` application.
- An admin can start reviewing a `SUBMITTED` application.
- An admin can approve or reject an application during review.
- Approving an application creates installments.

State workflows are common in real systems such as loan applications, invoices, support tickets, order fulfillment, and contract approvals.

## Draft

A draft is a record that has been started but not officially submitted or finalized.

In this project, `DRAFT` means the customer is still preparing the loan application. The customer may fill part of the form, leave, return later, edit it, add collateral, and then submit it when ready.

After the customer submits the application, the status changes from `DRAFT` to `SUBMITTED`.

## Identifier Login

Identifier login means using one login field that accepts more than one type of identity value.

In this project, the user can log in with either:

- Email
- Phone number

The request body can look like this:

```json
{
  "identifier": "user@example.com",
  "password": "12345678"
}
```

or:

```json
{
  "identifier": "09123456789",
  "password": "12345678"
}
```

The backend finds the user by checking whether the identifier matches an email or phone number, then verifies the password.

## Duration

Duration means how many months the customer wants to use for repayment.

Examples:

- 6 months
- 12 months
- 18 months
- 24 months

If a loan is approved with a 12 month duration, the system should create 12 installments.

## Interest Calculation

Interest calculation defines how the loan repayment amount is calculated from approved amount, duration, and interest rate.

For the MVP, we use a simple fixed-interest formula:

```txt
totalInterest = approvedAmount * (annualInterestRate / 100) * approvedDurationMonths / 12
totalPayable = approvedAmount + totalInterest
monthlyInstallment = totalPayable / approvedDurationMonths
```

This is intentionally simpler than real banking amortization formulas.

The goal is to practice backend business logic and installment generation without making the financial math too complex too early.

In this project, `annualInterestRate` is stored as a percentage number. For example, `24` means `24%`.

## Monthly Income

Monthly income helps the admin estimate whether the customer can realistically repay the loan.

Even when collateral exists, income is useful because collateral protects the lender, while income shows repayment ability.

For the MVP, monthly income is an informational field for admin review. Later, it can be used for risk scoring or affordability checks.

## Audit Log

An audit log is a history of important actions in the system.

It helps answer:

- Who did what?
- When did they do it?
- What changed?
- Why did it happen?

Example loan application audit history:

```txt
Customer created draft application.
Customer added collateral.
Customer submitted application.
Admin started review.
Admin approved application.
System generated installments.
```

Audit logs are especially important in fintech because they help with traceability, compliance, debugging, security, admin accountability, and customer support.

## API Contract

An API contract defines how the frontend and backend communicate.

It usually includes:

- Endpoint URL
- HTTP method
- Request body
- Response shape
- Authentication requirement
- Error cases

Example:

```txt
POST /loans/:id/submit
```

This endpoint may mean: submit a draft loan application for admin review.

## Pagination

Pagination means returning a list in smaller chunks instead of returning all records at once.

Example:

```txt
GET /admin/loans?page=1&limit=10
```

Example response shape:

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

Pagination is important because large result sets can slow down the database, backend, network, and frontend.

## Filtering

Filtering means asking the backend to return only records that match certain conditions.

Example:

```txt
GET /admin/loans?status=SUBMITTED
```

This returns only submitted loan applications.

## Sorting

Sorting means asking the backend to order records by a specific field and direction.

Example:

```txt
GET /admin/loans?sortBy=createdAt&sortOrder=desc
```

This returns the newest records first.

## Swagger / OpenAPI

Swagger is a tool for documenting and testing APIs.

OpenAPI is the specification format behind Swagger.

In this project, Swagger will show:

- Endpoints
- Request bodies
- Response shapes
- Query params
- Path params
- Bearer auth requirements

Planned backend docs URL:

```txt
/api/docs
```

Swagger is useful because it makes the backend contract visible while we build and test the app.

## Database Schema

A database schema describes how data is stored in the database.

It includes:

- Tables
- Columns
- Data types
- Relations
- Constraints
- Indexes

In this project, the database schema will be designed through Prisma models and then applied to PostgreSQL through migrations.

## Prisma Schema

A Prisma schema is the file where we define database models, fields, relations, enums, and Prisma Client generation settings.

In this project, the actual schema will live at:

```txt
backend/prisma/schema.prisma
```

The Prisma schema is where our domain model becomes concrete database structure.

## Optional Field

An optional field is a field that may be empty.

In Prisma, optional fields use `?`.

Example:

```prisma
requestedAmount Decimal?
```

This is useful for drafts because a user may start a loan application before completing all required data.

The database allows the field to be empty, but backend business rules can still require it before submit.

## Unique Constraint

A unique constraint means two records cannot have the same value for a field or group of fields.

Examples:

```prisma
email       String @unique
phoneNumber String @unique
```

In this project, `email` and `phoneNumber` are unique because users can log in with either one.

## Index

An index helps the database find, filter, or sort records faster.

Example:

```prisma
@@index([status])
```

This is useful because admins will filter loan applications by status.

Indexes improve reads, but too many indexes can slow writes, so they should be added intentionally.

## Foreign Key

A foreign key connects one table to another table.

Example:

```txt
LoanApplication.customerId -> User.id
```

This means each loan application belongs to one user.

In Prisma, relationships define these connections in the schema.

## ConfigModule

`ConfigModule` is a NestJS module for loading environment variables.

In this project, it loads values such as:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

We also validate required values at startup so configuration problems fail early.

## PrismaModule

`PrismaModule` wraps Prisma database access in a NestJS module.

The main provider is `PrismaService`.

This lets other modules inject Prisma instead of creating database clients manually.

## DTO

DTO means Data Transfer Object.

In NestJS, DTO classes describe the shape of data moving into or out of the API.

Most commonly, DTOs describe request bodies.

Example:

```txt
RegisterDto
LoginDto
```

`RegisterDto` means: this is the data the backend expects when someone calls `POST /auth/register`.

DTOs are useful because they connect:

- Runtime validation
- TypeScript types
- Swagger documentation

DTOs are not database models. A DTO describes API input/output, while a Prisma model describes database storage.

## ValidationPipe

`ValidationPipe` makes NestJS validate incoming requests using DTO decorators.

In this project, it is configured globally.

`whitelist: true` removes unknown fields from incoming request bodies.

## JWT

JWT means JSON Web Token.

After login, the backend returns an access token. The frontend sends it on protected requests:

```txt
Authorization: Bearer <token>
```

The backend validates the token and identifies the user.

## Guard

A guard decides whether a request is allowed to continue.

Examples in this project:

- `JwtAuthGuard` checks whether the user has a valid JWT.
- `RolesGuard` checks whether the authenticated user has one of the required roles.

Guards are important for backend authorization.

## Decorator

A decorator adds metadata or behavior to a class, method, or parameter.

NestJS uses decorators heavily.

Examples:

```ts
@Controller('auth')
@Post('login')
@UseGuards(JwtAuthGuard)
```

In this project:

- `@CurrentUser()` reads the authenticated user from the request.
- `@Roles(UserRole.ADMIN)` marks a route as admin-only.
- `@ApiTags('Auth')` adds Swagger metadata.

Decorators make code declarative: we describe what a route needs, and NestJS uses that metadata at runtime.

## Controller

A controller receives HTTP requests and returns HTTP responses.

Controller responsibility:

- Define routes
- Read request data
- Call services
- Return service results

Controllers should stay thin. Business logic should usually live in services.

## Service

A service contains business logic.

Service responsibility:

- Validate workflow rules
- Read/write database records
- Call other services
- Return useful data to controllers

Example:

`AuthService` hashes passwords, creates users, validates login, and signs JWT tokens.

## Module

A module groups related NestJS code.

Example:

`AuthModule` groups:

- `AuthController`
- `AuthService`
- `JwtStrategy`
- JWT/Passport imports

Modules help keep large backends organized by feature.

## Provider

A provider is a class that NestJS can create and inject into other classes.

Most services are providers.

Example:

`PrismaService` is injected into `AuthService` so auth code can access the database.

## Dependency Injection

Dependency injection means a class receives the objects it needs from NestJS instead of creating them manually.

Example:

```ts
constructor(private readonly authService: AuthService) {}
```

The controller does not create `AuthService`; NestJS provides it.

This makes code easier to test, replace, and organize.

## Strategy

A Passport strategy defines how authentication is performed.

In this project, `JwtStrategy` reads the bearer token, validates it, and attaches the authenticated user to the request.

## JWT Payload

The JWT payload is the data we put inside the token.

In this project, the payload contains:

```txt
sub
email
phoneNumber
role
```

`sub` means subject and stores the user ID.

The payload should contain useful identity/authorization data, but it should not contain secrets like password hashes.

## Passport

Passport is an authentication middleware library.

NestJS integrates with Passport through `@nestjs/passport`.

In this project:

- `passport-jwt` knows how to read and validate bearer JWT tokens.
- `JwtStrategy` configures how JWT authentication works.
- `JwtAuthGuard` uses that strategy to protect routes.

## Password Hashing

Password hashing stores a one-way hash instead of the raw password.

In this project, registration hashes the password with bcrypt before saving the user.

Login compares the submitted password with the stored hash.

Raw passwords should never be stored in the database.

## Monorepo

A monorepo is one repository that contains multiple related projects.

In this project, the monorepo contains:

- `backend`
- `frontend`
- `docs`
- `docker-compose.yml`

This keeps the full-stack project together while still separating backend and frontend code.
