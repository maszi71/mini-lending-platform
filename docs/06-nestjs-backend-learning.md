# NestJS Backend Learning Notes

This document explains the NestJS/backend concepts we learned while building the Mini Lending Platform.

It is written as a future reference, so the goal is clarity over brevity.

## Big Picture

NestJS helps us organize backend code into clear responsibilities.

In this project, a request usually flows like this:

```txt
Client
-> NestJS app
-> global pipes / guards
-> controller
-> service
-> Prisma
-> PostgreSQL
-> service
-> controller
-> response
```

## Main NestJS Concepts

### Module

A module groups related backend code.

Example:

```txt
AuthModule
```

It groups:

- `AuthController`
- `AuthService`
- `JwtStrategy`
- JWT/Passport setup

Modules help keep a large backend organized by feature.

### Controller

A controller receives HTTP requests.

Controller responsibilities:

- Define routes
- Read request data
- Call services
- Return responses

Example:

```ts
@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

Controllers should usually stay thin. They should not contain heavy business logic.

### Service

A service contains business logic.

Service responsibilities:

- Check business rules
- Work with the database
- Hash passwords
- Sign tokens
- Build response objects

Example:

```txt
AuthService.register()
AuthService.login()
AuthService.getMe()
```

### Provider

A provider is a class that NestJS can create and inject into other classes.

Most services are providers.

Example:

```txt
AuthService
PrismaService
```

### Dependency Injection

Dependency injection means NestJS gives a class the dependencies it needs.

Example:

```ts
constructor(private readonly authService: AuthService) {}
```

The controller does not manually create `AuthService`. NestJS creates it and injects it.

This makes code easier to test, organize, and replace later.

## Request To Response Flow

Open the HTML diagram:

[Request to response flow](./06-nestjs-backend-diagrams.html#request-flow)

Example: `POST /auth/register`

```txt
Client sends register body
-> ValidationPipe validates RegisterDto
-> AuthController.register()
-> AuthService.register()
-> bcrypt hashes password
-> PrismaService creates User
-> AuthService signs JWT
-> response returns accessToken + user
```

## DTO

DTO means Data Transfer Object.

In NestJS, a DTO describes the shape of data moving into or out of the API.

Most commonly, DTOs describe request bodies.

Example:

```ts
export class LoginDto {
  identifier: string;
  password: string;
}
```

For us:

```txt
RegisterDto = expected body for POST /auth/register
LoginDto = expected body for POST /auth/login
AuthResponseDto = response shape for register/login
```

DTOs are not database models.

```txt
DTO = API input/output shape
Prisma model = database storage shape
```

## Validation Flow

Validation is configured globally in:

```txt
backend/src/main.ts
```

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

This means every request can be validated before the controller method runs.

The DTO connects to a request here:

```ts
register(@Body() dto: RegisterDto)
```

NestJS sees:

```txt
The request body should match RegisterDto.
```

Then `ValidationPipe` checks the decorators inside `RegisterDto`.

Open the HTML diagram:

[DTO validation flow](./06-nestjs-backend-diagrams.html#validation-flow)

Example DTO:

```ts
export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
```

### Validation Error Messages

Default messages come from `class-validator`.

Custom messages can be written inside DTO decorators.

Example:

```ts
@IsEmail({}, { message: 'Email format is invalid.' })
email: string;
```

In our code, `phoneNumber` has a custom message:

```ts
@Matches(/^\+?[0-9]{8,15}$/, {
  message: 'phoneNumber must contain 8 to 15 digits and may start with +',
})
phoneNumber: string;
```

If validation fails, the service is not called.

## Decorators

A decorator adds metadata or behavior to a class, method, or parameter.

NestJS uses decorators heavily.

Examples:

```ts
@Controller('auth')
@Post('login')
@Body()
@UseGuards(JwtAuthGuard)
```

Decorators make code declarative.

Instead of manually wiring every route, we describe what we want and NestJS uses that metadata at runtime.

### Route Decorators

```ts
@Controller('auth')
```

Defines the route prefix.

```ts
@Post('login')
```

Defines an HTTP POST route.

Together:

```txt
POST /auth/login
```

### Parameter Decorators

```ts
@Body()
```

Reads the request body.

Common parameter decorators:

- `@Body()` reads JSON body
- `@Param()` reads route params
- `@Query()` reads query params
- `@CurrentUser()` reads the authenticated user from the request

`@Body()` is common with `POST`, `PATCH`, and `PUT`.

For `GET`, we usually use `@Param()` or `@Query()`.

### Custom Decorators

We created:

```txt
CurrentUser
Roles
```

`@CurrentUser()` returns the authenticated user from `request.user`.

`@Roles(UserRole.ADMIN)` marks a route as admin-only.

## Swagger Decorators

Swagger decorators document the API. They do not enforce business rules.

### @ApiTags

```ts
@ApiTags('Auth')
@Controller('auth')
export class AuthController {}
```

`@ApiTags('Auth')` groups all routes in this controller under the `Auth` section in Swagger.

We put it above the class because it applies to the whole controller.

### @ApiProperty

```ts
@ApiProperty({ example: 'masoud@example.com' })
email: string;
```

`@ApiProperty()` documents a DTO field in Swagger.

It can show:

- field name
- type
- example
- description
- enum values

It does not validate data. Validation comes from decorators such as `@IsEmail()`.

### @ApiOperation

```ts
@ApiOperation({ summary: 'Login with email or phone number' })
```

Adds a human-readable description to an endpoint.

### @ApiOkResponse / @ApiCreatedResponse

These describe successful response shapes.

```ts
@ApiOkResponse({ type: AuthResponseDto })
```

Means this endpoint returns `200 OK` with `AuthResponseDto`.

```ts
@ApiCreatedResponse({ type: AuthResponseDto })
```

Means this endpoint returns `201 Created` with `AuthResponseDto`.

## Authentication Concepts

### Password Hashing

We do not store raw passwords.

Registration flow:

```txt
raw password
-> bcrypt hash
-> save hash in database
```

Login flow:

```txt
submitted password
-> compare with stored hash
-> if match, login succeeds
```

### passwordSaltRounds

`passwordSaltRounds` controls how much work bcrypt does while hashing.

In our app:

```ts
private readonly passwordSaltRounds = 12;
```

Higher rounds mean:

- harder to brute force
- slower hashing

`12` is a common practical default.

### JWT

JWT means JSON Web Token.

After login, backend returns:

```txt
accessToken
```

Frontend sends it on protected routes:

```txt
Authorization: Bearer <token>
```

The backend validates the token and identifies the user.

### JWT Payload

The JWT payload is the data we put inside the token.

Our payload:

```txt
sub
email
phoneNumber
role
```

`sub` means subject.

For us:

```txt
sub = user ID
```

Do not put secrets in the JWT payload.

Do not include:

- raw password
- password hash
- sensitive private data

## Passport And JwtStrategy

Passport is an authentication library.

NestJS integrates with Passport through:

```txt
@nestjs/passport
```

For JWT authentication, we use:

```txt
passport-jwt
JwtStrategy
JwtAuthGuard
```

### Auth Flow With Passport

Open the HTML diagram:

[Passport and JWT flow](./06-nestjs-backend-diagrams.html#passport-flow)

### JwtStrategy

`JwtStrategy` explains how JWT auth works.

It defines:

```txt
Where to read the token from
Which secret validates the token
What user object should be attached to the request
```

In our app:

```ts
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
```

Reads token from:

```txt
Authorization: Bearer <token>
```

```ts
secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
```

Uses `JWT_SECRET` to validate token signature.

```ts
validate(payload: JwtPayload)
```

Returns the authenticated user object.

Passport puts that result on:

```txt
request.user
```

## Guards

A guard decides whether a request can continue.

### JwtAuthGuard

Checks if the request has a valid JWT.

Used like:

```ts
@UseGuards(JwtAuthGuard)
```

If invalid:

```txt
401 Unauthorized
```

### RolesGuard

Checks whether the authenticated user has a required role.

Example:

```ts
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
```

This means:

```txt
User must be logged in
User must be ADMIN
```

If role is wrong:

```txt
403 Forbidden
```

## Auth Endpoint Flow

### Register

Open the HTML diagram:

[Register sequence](./06-nestjs-backend-diagrams.html#register-flow)

### Login

Open the HTML diagram:

[Login sequence](./06-nestjs-backend-diagrams.html#login-flow)

### Me

Open the HTML diagram:

[Authenticated user sequence](./06-nestjs-backend-diagrams.html#me-flow)

## Prisma And Database Connection

Prisma is our ORM.

It gives us a type-safe way to query PostgreSQL.

### PrismaService

`PrismaService` wraps Prisma Client so it can be injected into NestJS services.

```txt
AuthService -> PrismaService -> Prisma Client -> PostgreSQL
```

### Prisma Adapter

The adapter is the bridge between Prisma Client and the real PostgreSQL driver.

In our app:

```ts
adapter: new PrismaPg({ connectionString })
```

Flow:

Open the HTML diagram:

[Prisma to database flow](./06-nestjs-backend-diagrams.html#prisma-flow)

Prisma builds type-safe queries.

`PrismaPg` knows how to send those queries through `node-postgres`.

## Prisma Enums And Database Rules

We define enums in Prisma:

```prisma
enum UserRole {
  CUSTOMER
  ADMIN
}
```

Prisma turns this into a PostgreSQL enum:

```sql
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');
```

So invalid values are blocked at the database level.

For example, the database will reject:

```txt
SUPER_USER
```

unless we add it through a migration.

This means enum safety exists in both places:

```txt
Backend/Prisma type level
Database constraint level
```

## Config And Environment Validation

Environment values live outside the code.

Examples:

```txt
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
PORT
```

`ConfigModule` loads them.

`env.validation.ts` checks that required values exist and have valid shape.

Why this matters:

```txt
Without validation:
App may start, then fail later during login or DB access.

With validation:
App fails immediately with a clear config error.
```

## How The Current Files Fit Together

Open the HTML diagram:

[Current backend files](./06-nestjs-backend-diagrams.html#files-flow)

Important idea:

```txt
main.ts starts the app
AppModule connects feature modules
Controllers receive requests
Services perform logic
PrismaService talks to DB
Guards protect routes
Decorators provide metadata or request data
DTOs define and validate data shapes
Swagger decorators document the API
```
