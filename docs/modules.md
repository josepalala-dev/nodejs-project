# Modules Synthesis

This repository (`nodejs-project`) is itself **M10 — the capstone project**: per the README, it's where the "Dev Pulse" backend built across M01-M09 (Task API v1-v4, async toolkit, SQL schema, Prisma, Zod, Jest/CI) gets delivered as a production-ready system, with seed scripts, advanced query options, and an OpenAPI/Postman spec.

Synthesized from each module's `brief.md`. Each row is one lab task (from the "You do." steps); "Output" is what that task should produce. M01 is marked **Skipped** throughout since it can't be done within a repository (it requires creating a public GitHub repo, PRs, and a deliberate merge conflict).

| Module | Task | Output | Status |
|---|---|---|---|
| M01 | Set up toolchain (VS Code, Git, Node version manager, Bruno) and create the public repo | A public GitHub repo | Skipped |
| M01 | Write the `hello-node` script on a feature branch with Conventional Commits | `hello-node` script on a feature branch | Skipped |
| M01 | Add `.gitignore` and `.env.example` | `.gitignore` and `.env.example` files in the repo | Skipped |
| M01 | Open a pull request for the branch | An open pull request | Skipped |
| M01 | Deliberately create and resolve a merge conflict | A resolved merge conflict in the PR history | Skipped |
| M01 | Merge the PR (3+ Conventional Commits) | A merged pull request | Skipped |
| M02 | Research language essentials and async concepts | Notes/understanding to support the build | Done |
| M02 | Build `sleep`, `retry`, `withTimeout`, `mapLimit` with self-checks | "Async toolkit" ES module with passing `node:assert` self-checks | Not Started |
| M02 | Fetch from JSONPlaceholder sequentially then in parallel, compare timings | Timing comparison with actual numbers showing parallel beats sequential | Not Started |
| M02 | Refactor callback-style `node:fs` code to promises/async-await | Refactored async/await code | Not Started |
| M02 | Predict/explain output order of a mixed `setTimeout`/promise/`await` snippet | Verbal/written explanation of execution order | Not Started |
| M03 | Get the synthetic log file from trainer | Log file available locally | Not Started |
| M03 | Build the `log-report` CLI (streaming, aggregation, `parseArgs`, JSON report) | `log-report` CLI producing a JSON report | Not Started |
| M03 | Build bare `node:http` server with three JSON endpoints | `node:http` server with hand-rolled routing/body parsing | Not Started |
| M03 | Merge both programs to `main` by PR | Two merged pull requests | Not Started |
| M04 | Set up TypeScript project (`tsconfig.json`, scripts) | Configured TypeScript project | Not Started |
| M04 | Port `retry`, `mapLimit`, `sleep`, `withTimeout` to TypeScript with generics | Typed async toolkit module | Not Started |
| M04 | Model Task domain types and discriminated-union `Result<T, E>` | `Task`, `CreateTaskInput`, `UpdateTaskInput`, `Result<T, E>` types | Not Started |
| M04 | Run toolkit via `tsx`, attempt via Node's native type stripping | Toolkit running under `tsx`; documented native type-stripping attempt | Not Started |
| M05 | Write `app.ts` (exports app, no `listen`) and `server.ts` (listens, graceful shutdown) | Separate `app.ts`/`server.ts` files | Not Started |
| M05 | Build `AppError` hierarchy and central error handler producing fixed envelope | Central error handler with fixed JSON error envelope | Not Started |
| M05 | Build request-ID and logging middleware | Request-ID/logging middleware | Not Started |
| M05 | Build in-memory store and five `/api/v1/tasks` endpoints with hand-written validation | Task API v1 (in-memory, 5 endpoints) | Not Started |
| M05 | Add 404 handler and health endpoint | 404 handler + health endpoint | Not Started |
| M05 | Build Bruno collection with assertions for every endpoint/error path | Committed `bruno/` collection, passing | Not Started |
| M06 | Design schema including `task_tags` junction table | Relational schema design (`users`/`tasks`/`tags`/`task_tags`) | Not Started |
| M06 | Write DDL and seed the database with SQL | Schema + seed SQL | Not Started |
| M06 | Write and run 20+ graded query exercises (filtering/sorting/pagination, joins, aggregates, subquery) | 20+ query exercises | Not Started |
| M06 | Write at least one query inside an explicit transaction | Transactional query example | Not Started |
| M06 | Demonstrate SQL-injection attack then fix with parameters | Before/after injection demo | Not Started |
| M06 | Draw the ERD in Mermaid matching the built schema | Mermaid ERD in README | Not Started |
| M07 | Set up Prisma 7 with SQLite driver adapter, translate M06 schema | Prisma schema matching M06 design | Not Started |
| M07 | Create initial migration, then a second migration adding a column | 2+ migrations | Not Started |
| M07 | Hand-edit one migration via `--create-only` | Hand-edited migration SQL | Not Started |
| M07 | Build service layer on Prisma, replacing in-memory store | Prisma-backed service layer | Not Started |
| M07 | Implement list endpoint filters, sorting, pagination (`{ data, meta }`) | Filtered/sorted/paginated listing endpoint | Not Started |
| M07 | Write seed script and map Prisma error codes into M05 error handler | Seed script; `P2002`/`P2025`/`P2003` mapped to status codes — Task API v2 | Not Started |
| M08 | Write Zod schemas for create, update, list query, and params | Zod schemas for all input shapes | Not Started |
| M08 | Build typed `validate` middleware (working around read-only `req.query`) | Typed `validate({ body, params, query })` middleware | Not Started |
| M08 | Remove every hand-written validation check as Zod is wired in | Codebase with no manual validation checks remaining | Not Started |
| M08 | Map `ZodError` output into the fixed M05 envelope's `details` array | Zod errors mapped to 400 responses with `details` | Not Started |
| M08 | Add env validation in `config.ts` that fails fast on startup | `config.ts` with env validation — Task API v3 | Not Started |
| M09 | Set up Jest, Supertest, and test database strategy (`test.db`, `globalSetup`, cleanup) | Configured test environment | Not Started |
| M09 | Write tests for happy paths, validation failures, 404s, 409s, malformed JSON | Integration test suite covering these cases | Not Started |
| M09 | Write tests for pagination/filter/sort and middleware behavior | Additional integration tests | Not Started |
| M09 | Add `PATCH /tasks/:id/complete` test-first (red → green → refactor) | New endpoint built via TDD | Not Started |
| M09 | Set up GitHub Actions workflow and confirm green CI | Passing CI workflow with status badge — Task API v4 | Not Started |

M02 - Research done (see docs)
