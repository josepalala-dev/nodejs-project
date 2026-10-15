# NodeJS Project — "Dev Pulse" Backend Capstone & Curriculum Roadmap

This NodeJS Project is a capstone project to apply the lessons from the NodeJS Training modules. It features a high-performance, developer-focused task and project tracking RESTful backend service built with Node.js, Express, TypeScript, SQLite, Prisma, Zod, and Jest.

This documentation site tracks progress through a structured 10-stage engineering curriculum, starting from core Node.js runtime fundamentals to database migrations, runtime schema validation, integration testing, and a final M10 production capstone deployment.

## System Architecture

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

## Curriculum Modules (M02 – M09)

Use the sidebar to browse each module's brief, tasks, and write-up template.

* **M02** — Modern JavaScript & Async/Await — the `Async Toolkit` (later ported to TypeScript in M04)
* **M03** — Node.js Runtime & npm — bare `node:http` standalone health server
* **M04** — TypeScript on Node — ported `Async Toolkit` & Task domain interfaces
* **M05** — Express: Routing, Middleware & Error Handling — **Task API v1**
* **M06** — SQL Fundamentals with SQLite — relational schema design
* **M07** — Prisma ORM & Database Migrations — **Task API v2**
* **M08** — Zod Validation & Type Inference — **Task API v3**
* **M09** — Integration Testing with Jest + Supertest — **Task API v4**

## Getting Started

### Prerequisites

* Node.js [Download here](https://downloads.nodesource.com/)
* npm _and/or_ [pnpm](https://pnpm.io)

_Note: npm comes bundled automatically when you install Node.js_

Install [NVM](https://github.com/nvm-sh/nvm) as well — a de facto standard, useful if you switch Node versions across projects.

### Setup Instructions

1. **Clone & Install Dependencies:**
   ```bash
   git clone https://github.com/josepalala-dev/nodejs-project.git
   cd nodejs-project
   npm install
   ```

2. **Environment Configuration:**
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

---

[View on GitHub](https://github.com/josepalala-dev/nodejs-project)
