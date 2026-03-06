# Cuti Ku API

The Employee Management System is a comprehensive application designed to manage employee data, leaves, and authentication. It provides a robust and scalable solution for businesses to streamline their employee management processes. The system is built using AdonisJs, a Node.js framework, and utilizes Prisma for database management.

## Docker Compose Installation

Work in progress, stay tune

## Features

- Employee registration and management
- Leave management (submit, fetch, confirm, and delete)
- Authentication (conventional login, OAuth login, and password management)
- Authorization (role-based access control)
- Logging and error handling
- Standardized response format for API endpoints

## Tech Stack

- AdonisJs (Node.js framework)
- Prisma (database management)
- TypeScript
- JavaScript
- @adonisjs/core
- @adonisjs/auth
- @prisma/client
- jsonwebtoken
- crypto
- dotenv
- pino
- reflect-metadata
- source-map-support

## System Diagram

        +------------+
        |   Client   |
        | Web        |
        +------------+
                │
                ▼
        +------------+
        | API Server |
        |  AdonisJS  |
        +------------+
            │       │
            ▼       ▼
    +--------+ +--------+
    | Redis  | |Postgres|
    |Session | |Database|
    +--------+ +--------+
            │
            ▼
        +-----------+
        |Cloudinary |
        |Attachments|
        +-----------+

## Required External Stack

- Redis
- PostgreSQL
- Google OAuth2 credentials (check env.example)
- Cloudinary credentials (check env.example)

## Installation

To install the Employee Management System, follow these steps:

1. Clone the repository: `git clone https://github.com/your-repo/employee-management-system.git`
2. Install dependencies: `npm install` or `yarn install`
3. Configure environment variables: create a `.env` file and add your database connection URL, secret key, and other required variables
4. Pull schema from database by using script: `npm run pull-db` (or manual migration)
5. Make initial admin registration by running `npm run register-admin`
6. Start the server: `npm run start`

## Documentation

See postman documentation [here](https://dhana-pns-2121559.postman.co/documentation/49071923-cee0e16b-3673-4cce-a4ff-800475e9dd89/publish?workspaceId=dc9221d4-decb-46ac-8c96-cab2394da29e&authFlowId=46107f14-0ebb-4903-a972-0a7235444f84)

## App Dir Structure

```
├── Controllers
│   └── Http
│       ├── AuthController.ts
│       ├── LeavesController.ts
│       └── UserController.ts
├── Exceptions
│   └── Handler.ts
├── Middleware
│   ├── AdminCookieAuth.ts
│   ├── EmployeeCookieAuth.ts
│   └── GlobalCookieAuth.ts
├── Models
├── Validators
│   ├── ChangePasswordValidator.ts
│   ├── ConventionalLoginValidator.ts
│   ├── DateValidator.ts
│   ├── EmailValidator.ts
│   ├── IdValidator.ts
│   ├── LeaveConfirmValidator.ts
│   ├── PaginatedLeavesValidator.ts
│   ├── PaginationValidator.ts
│   └── SetPasswordValidator.ts
├── controller
│   └── leavesController.ts
├── entities
│   ├── leave_balance.ts
│   ├── paid_leave.ts
│   └── user.ts
├── helper
│   ├── ErrorMapper.ts
│   ├── attachmentUploadDTO.ts
│   ├── cookieTTL.ts
│   ├── cookies.ts
│   └── standarizedResponse.ts
├── repositories
│   ├── PrismaUserRepository.ts
│   └── RedisUserRepository.ts
├── repositories_contract
│   ├── CacheRepository.ts
│   └── UserRepository.ts
├── services
│   ├── AllyGoogleOauthProvider.ts
│   ├── CloudinaryServices.ts
│   ├── JwtServices.ts
│   └── PinoLogger.ts
├── services_contract
│   ├── CloudinaryServicesContract.ts
│   ├── Context.ts
│   ├── JwtServicesContract.ts
│   ├── LoggerContract.ts
│   └── OAuthProvider.ts
└── usecases
    ├── changePassword.ts
    ├── confirmLeaves.ts
    ├── conventionalLogin.ts
    ├── deleteLeaves.ts
    ├── deleteMyLeaves.ts
    ├── enableEmployeeAccount.ts
    ├── fetchPaginatedLeaveList.ts
    ├── fetchPaginatedUser.ts
    ├── getMyLeaveList.ts
    ├── oauthLogin.ts
    ├── refreshingToken.ts
    ├── registerEmployee.ts
    ├── setPassword.ts
    └── uploadAttachment.ts
```

## Credit

This readme.md is written partially by readme.ai [readme.ai](https://readme-generator-phi.vercel.app/)
