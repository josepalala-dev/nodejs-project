# NodeJS Project — "Dev Pulse" Backend Capstone & Curriculum Roadmap

This NodeJS Project is a capstone project to apply the lessons from the NodeJS Training modules. It features high-performance, developer-focused task and project tracking RESTful backend service built with Node.js, Express, TypeScript, SQLite, Prisma, Zod, and Jest.

This repository tracks progress through a structured 10-stage engineering curriculum, starting from core Node.js runtime fundamentals to database migrations, runtime schema validation, integration testing, and a final M10 production capstone deployment.

##  System Architecture

```
                             ┌───────────────────────────────────┐
                             │           HTTP Clients            │
                             │ (Postman / Jest Supertest / CI)   │
                             └─────────────────┬─────────────────┘
                                               │ JSON Requests
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Express Application                                │
│                                                                                 │
│   ┌──────────────────────────┐    ┌─────────────────────────┐    ┌───────────┐  │
│   │   Zod Middleware (M08)   │───>│ Request Logger & Errors │───>│  Routers  │  │
│   │ (Request Gate Validation)│    │ Middleware Layer (M05)  │    │ (M05/M10) │  │
│   └──────────────────────────┘    └─────────────────────────┘    └─────┬─────┘  │
└────────────────────────────────────────────────────────────────────────┼────────┘
                                                                         │
                                                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Data & Service Layer                               │
│                                                                                 │
│   ┌──────────────────────────┐                      ┌────────────────────────┐  │
│   │   Prisma ORM Client      │ ◄─────────────────── │ Async Utilities Module │  │
│   │   (M07 Typed Interface)  │                      │ (M02 System Metrics)   │  │
│   └────────────┬─────────────┘                      └────────────────────────┘  │
│                │ Relational SQL                                                 │
│                ▼                                                                │
│   ┌──────────────────────────┐                                                  │
│   │ SQLite Database (M06)    │                                                  │
│   └──────────────────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

```

## Curriculum Progress & To-Do Checklist


---

## Module Demonstration Checklist (M01 – M10)

This roadmap tracks how each module's core concepts are directly demonstrated inside the codebase.

### M01: Dev Environment, Git & GitHub Workflow

> **Theme:** Toolchain setup & Git workflow
> **Leaves Behind:** Clean repository & initial Git workflow proof

* [ ] Initialize Node.js project with `.gitignore`, `package.json`, and standard `.editorconfig`.
* [ ] Establish `main` branch protection rules and setup strict commit conventions.
* [ ] Create a feature branch (`feature/git-workflow-demo`), intentionally trigger a merge conflict on a shared configuration file, and resolve it via PR merge.

---

### M02: Modern JavaScript & Async / Await

> **Theme:** Event loop, promises, and reliable asynchronous operations
> **Leaves Behind:** The `Async Toolkit` (ported to TypeScript in M04)

* [ ] Demonstrate `fs/promises` by creating an asynchronous system activity log parser (`/src/utils/logReader.js`).
* [ ] Build a resilient HTTP fetch helper (`/src/utils/asyncToolkit.js`) implementing exponential backoff retries using pure `async/await`.
* [ ] Handle concurrent execution using `Promise.all` and `Promise.allSettled` to aggregate non-blocking system metrics.

---

### M03: Node.js Runtime & npm

> **Theme:** Core modules, npm dependencies, and native HTTP
> **Leaves Behind:** Bare `node:http` standalone health server

* [ ] Create an independent HTTP server using native `node:http` (`/src/server-raw.js`) without external frameworks.
* [ ] Parse URL query strings and incoming request streams using `node:stream` and standard Node event emitters.
* [ ] Serve health status and runtime memory metrics (`process.memoryUsage()`) returning raw JSON headers.

---

### M04: TypeScript Basics & TypeScript on Node.js

> **Theme:** Strict typing & domain modeling
> **Leaves Behind:** Ported `Async Toolkit` & Task domain interfaces

* [ ] Configure `tsconfig.json` with strict mode enabled (`"strict": true`).
* [ ] Port the JavaScript `Async Toolkit` from M02 into fully-typed TypeScript modules (`/src/utils/asyncToolkit.ts`).
* [ ] Define core Task domain models, generics, and enums:
```typescript
export enum Priority { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH' }
export enum TaskStatus { TODO = 'TODO', IN_PROGRESS = 'IN_PROGRESS', DONE = 'DONE' }

export interface TaskDomain {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  projectId: string;
  assigneeId?: string;
  dueDate?: Date;
  createdAt: Date;
}

```

---

### M05: Express: Routing, Middleware & Error Handling

> **Theme:** REST API structure & centralized error pipeline
> **Leaves Behind:** **Task API v1** (In-memory storage)

* [ ] Build Task API v1 using Express router endpoints (`/api/v1/tasks`), request-latency middleware, and a centralized `AppError` handler (`/src/middleware/errorHandler.ts`).

---

### M06: SQL Fundamentals with SQLite

> **Theme:** Relational schema design, SQL injection prevention, and transactions
> **Leaves Behind:** Standard SQL schema design

* [ ] Design and query a relational SQLite database (`users`, `projects`, `tasks`, `tags`) using raw SQL with parametric binding (`?`), multi-table `JOIN`s, and explicit transactions.

---

### M07: Prisma ORM & Database Migrations

> **Theme:** Schema migrations, typed client, and ORM error mapping
> **Leaves Behind:** **Task API v2** (Prisma-backed)

* [ ] Upgrade to Task API v2 by modeling the relational schema in `prisma/schema.prisma`, running migrations (`npx prisma migrate dev`), and replacing raw SQL with a typed `PrismaClient` mapped to `AppError`.

---

### M08: Zod Validation & Type Inference

> **Theme:** Runtime request validation & schema type inference
> **Leaves Behind:** **Task API v3** (Validated API endpoints)

* [ ] Upgrade to Task API v3 by implementing Zod request schemas with inferred TypeScript types (`z.infer`) and a global `validateRequest` middleware to handle invalid HTTP payloads.

---

### M09: Integration Testing with Jest + Supertest

> **Theme:** Real-database integration testing & CI automation
> **Leaves Behind:** **Task API v4** (Fully tested API ready for handoff)

* [ ] Deliver Task API v4 by adding Jest and Supertest integration tests against an isolated SQLite test database and setting up a GitHub Actions workflow (`ci.yml`) to automate testing on pull requests.

---

### M10: Capstone Project Delivery

> **Theme:** Full system integration, production readiness, and documentation
> **Leaves Behind:** Production-ready **DevPulse Engine**

* [ ] Complete the DevPulse backend with database seed scripts (`prisma/seed.ts`), advanced query options (sorting, pagination, tag aggregation), and an OpenAPI/Postman specification.
---

## Project Structure Overview

```
devpulse-backend/
├── .github/
│   └── workflows/
│       └── ci.yml               # M09: CI Pipeline
├── prisma/
│   ├── schema.prisma            # M07: Prisma Schema
│   ├── seed.ts                  # M10: Seed Script
│   └── migrations/              # M07: Migration History
├── src/
│   ├── db/
│   │   └── schema.sql           # M06: Raw SQL Reference Schema
│   ├── middleware/
│   │   ├── errorHandler.ts      # M05: Centralized Error Handler
│   │   ├── logger.ts            # M05: Request Latency Logger
│   │   └── validate.ts          # M08: Zod Validation Middleware
│   ├── routes/
│   │   ├── health.ts            # M03: Bare Node HTTP / Express Health Checks
│   │   ├── tasks.ts             # M05-M08: Task Endpoints
│   │   └── projects.ts          # M07: Project Endpoints
│   ├── schemas/
│   │   └── task.schema.ts       # M08: Zod Schemas & Inferred Types
│   ├── types/
│   │   └── index.ts             # M04: Task & Domain Types
│   ├── utils/
│   │   ├── asyncToolkit.ts      # M02 / M04: Ported Async Toolkit
│   │   └── errors.ts            # M05: Custom Error Classes
│   ├── app.ts                   # M05: Express Setup
│   └── server.ts                # App Entry Point
├── tests/
│   ├── integration/
│   │   └── tasks.test.ts        # M09: Jest + Supertest Suites
│   └── setup.ts                 # M09: Database Test Lifecycle
├── tsconfig.json                # M04: Strict TypeScript Config
└── package.json

```

---

## Getting Started

### Prerequisites

* Node.js [Download here](https://downloads.nodesource.com/)
* npm _and/or_ [pnpm](https://pnpm.io)

_Note: npm comes bundled automatically when you install Node.js_

Install NVM as well. [NVM](https://github.com/nvm-sh/nvm) is a de facto standard, typically useful if you switch node versions (for different projects). There are [alternatives](https://nodejs.org/learn/getting-started/node-version-managers).

### Setup Instructions

1. **Clone & Install Dependencies:**
```bash
git clone https://github.com/your-username/devpulse-backend.git
cd devpulse-backend
npm install

```


2. **Environment Configuration:**
Copy the example environment file:
```bash
cp .env.example .env

```


3. **Run Database Migrations & Seeds:**
```bash
npx prisma migrate dev --name init
npx prisma db seed

```


4. **Start Development Server:**
```bash
npm run dev

```


5. **Run Test Suites:**
```bash
npm run test

```
