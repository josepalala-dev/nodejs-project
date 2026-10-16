# TypeScript Research (M03–M04)

This document discusses what TypeScript is and how it applies to this project, in preparation for
M04 (TypeScript Basics & TypeScript on Node.js). It covers the basics M04 will tackle: the types
and generics you need, what the M02 toolkit does and how it gets ported, and the discriminated
unions behind `Result<T, E>`. M03 is still plain JavaScript, so its section covers only the parts
of Node.js that TypeScript will build on. Everything from M04 onward is TypeScript.

## 1. What TypeScript is

TypeScript is JavaScript with a static type system added on top. Three facts shape how you use it:

- **Types are erased.** The compiler checks types, then removes them. The output is ordinary
  JavaScript, so a type error never changes runtime behavior by itself. It only stops the code
  from being accepted by the type checker.
- **Typing is structural.** A value matches a type if it has the right shape, not because it was
  declared with that name. `{ id: 1, title: "x", done: false }` satisfies a `Task` type with those
  three fields even if it never mentioned `Task`.
- **Inference first, annotation second.** TypeScript infers most types from the code. Annotate
  function parameters and exported signatures; let local variables be inferred.

```ts
const count = 3;              // inferred as number
function add(a: number, b: number): number {
  return a + b;
}
add(1, "2");                  // error: string is not assignable to number
```

## 2. Core types

| Concept | Use it for | Example |
|---|---|---|
| Primitives | Basic values | `string`, `number`, `boolean`, `null`, `undefined` |
| Arrays | Lists of one type | `string[]`, `readonly number[]` (cannot be changed) |
| Tuples | Fixed-length lists with per-position types | `[number, string]` |
| Unions | "one of these" | `"open" \| "done"` instead of an `enum` |
| Intersections | "all of these" | `A & B` |
| Literal types, `as const` | Exact values | `as const` freezes an object's values as literals |
| Optional / `readonly` | Shape details | `title?: string`, `readonly id: number` |
| Narrowing | Going from a wide type to a specific one | `typeof`, `in`, `===`, discriminant checks |
| Utility types | Deriving types from others | `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `ReturnType`, `Awaited` |
| `satisfies` | Check a value against a type, keep its literal type | `const config = {...} satisfies Config` |
| `import type` | Import only for types (erased at runtime) | Required under `verbatimModuleSyntax` |

A `Task` shape built from these:

```ts
type TaskStatus = "open" | "done";          // a union of literals

type Task = {
  readonly id: number;                      // cannot be reassigned
  title: string;
  status: TaskStatus;
  dueDate?: string;                         // optional
};
```

### `unknown` vs `any` vs `never`

- `any` turns checking off for that value. Avoid it; it spreads silently through the code.
- `unknown` is "some value I haven't checked yet." You must narrow it before use. This is the right
  type for `catch (e)` values and parsed JSON.
- `never` is "no value can reach here." It appears in exhaustive checks and in functions that
  always throw.

```ts
try {
  await doWork();
} catch (e: unknown) {
  if (e instanceof Error) console.error(e.message);
  else console.error("non-error thrown", e);
}
```

### `type` vs `interface`

Both describe object shapes. Practical differences:

- `interface` can be extended and merged by declaration (`interface A {}` twice merges).
- `type` can be a union, intersection, tuple, or mapped type; an `interface` cannot be a union.
- Both are erased at runtime.

Use either for objects; use `type` when you need a union (such as a `Result`).

## 3. Discriminated unions

### Unions first

A union value can be one of several types. To use it, you narrow it first, usually with `typeof`
for primitives:

```ts
function show(value: string | number): string {
  if (typeof value === "number") return value.toFixed(2); // number here
  return value.toUpperCase();                             // string here
}
```

### What a discriminated union is

A discriminated union is a union of object types that share a field with a *literal* type (the
**discriminant**). Checking that one field narrows the whole value to one member of the union:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;   // radius is available here
    case "square":
      return shape.side ** 2;               // side is available here
  }
}
```

If you add a third shape later and forget a `case`, the compiler can flag it. Add a check to make it
explicit:

```ts
default: {
  const unreachable: never = shape;         // error if a shape is unhandled
  throw new Error(`unknown shape: ${JSON.stringify(unreachable)}`);
}
```

### `Result<T, E>`

This is the pattern M04 uses for the Task domain and the toolkit. Success and failure are two
members of one union, distinguished by `ok`:

```ts
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E> = Ok<T> | Err<E>;

function parsePort(raw: string): Result<number, string> {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    return { ok: false, error: `invalid port: ${raw}` };
  }
  return { ok: true, value: n };
}

const r = parsePort("8080");
if (r.ok) {
  r.value;   // number
} else {
  r.error;   // string
}
```

Why use it instead of throwing: the failure path is part of the function's type, so callers must
handle it, and the compiler checks that they did. It also avoids a problem described in section 5
(`mapLimit`): a success value and an error value can't be confused.

## 4. Generics

A generic is a type parameter: a placeholder filled in by the caller. It lets one function work for
many types while the compiler keeps the types connected across the call.

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity(5);       // T is number, so n: number
const s = identity("hi");    // T is string, so s: string
```

Without generics you would need `any` (losing the type) or one copy per type.

Three things to know:

- **Several parameters.** `function pair<A, B>(a: A, b: B): [A, B]` takes two independent types.
- **Constraints.** `<T extends { id: number }>` says `T` must have at least that shape. You can
  read `item.id` inside the function, but the caller can still pass any object that has `id`.
- **Defaults.** `type Page<T = unknown> = { items: T[]; total: number }` gives `T` a fallback when
  the caller doesn't supply it.

```ts
function getId<T extends { id: number }>(item: T): number {
  return item.id;
}

getId({ id: 7, title: "write docs" });   // 7
getId({ title: "no id" });               // error: id is missing
```

## 5. Porting the M02 toolkit

M02 wrote four helpers in plain JavaScript under `src/utils/`. M04 ports them to TypeScript with
generics: each function gets type parameters, and its options and return type are declared. Here
is what each one does in M02, and what its TypeScript signature will say.

### `sleep(ms)`

Returns a promise that resolves after `ms` milliseconds. It is the building block for `retry`.

```ts
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

Nothing generic here: it always resolves with no value, so the return type is `Promise<void>`.

### `retry(fn, options)`

Calls `fn`. If it throws or rejects, waits and tries again, up to `maxRetries` extra attempts. The
wait doubles each time (`delay`, then `delay × 2`, then `delay × 4`, ...). The function returns
whatever `fn` returned on the successful attempt.

M02 defaults: `maxRetries = 3`, `delay = 100` ms, and an optional `onRetry(error, attemptNumber)`
callback.

```ts
type RetryOptions = {
  maxRetries?: number;
  delay?: number;
  onRetry?: (error: unknown, attempt: number) => void;
};

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxRetries = 3, delay = 100, onRetry } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) throw lastError;
      onRetry?.(error, attempt + 1);
      await sleep(delay * 2 ** attempt);
    }
  }
  throw lastError;
}
```

What the types give you:

- `<T>` is the type `fn` resolves to. Pass a function returning `Promise<User>` and you get back
  `Promise<User>`, not `any`:

  ```ts
  const user = await retry(() => fetchUser(42), { maxRetries: 2 }); // user: User
  ```
- `RetryOptions` fields are optional, so `retry(fn)` works with defaults.
- `error` in the catch block is `unknown`, so the code must narrow it before reading `.message`.

### `withTimeout(promise, ms, message)`

Races the promise against a timer. If the timer fires first, the returned promise rejects with an
`Error`; otherwise it resolves with the original promise's value.

```ts
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = "Operation timed out",
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.finally(() => clearTimeout(timer));
  });
  return Promise.race([promise, timeout]);
}
```

- `Promise<T>` in, `Promise<T>` out: the value type is unchanged.
- `Promise<never>` for the timeout branch says that branch never resolves with a value. Because of
  that, `Promise.race` gives back `T`.

Watch for one thing when porting. `promise.finally(...)` returns a new promise. If `promise`
rejects, that new promise rejects too, and nothing handles it, so Node reports an unhandled
rejection. Handle it in the port (for example, `.catch(() => {})` on the `finally` chain), and
confirm the behavior with a test.

### `mapLimit(items, limit, fn)` and `mapLimitStrict`

`mapLimit` runs `fn` over every item, with at most `limit` calls in flight at once. Results come
back in the same order as the input, regardless of which call finishes first. That makes it the
right tool for things like fetching 100 URLs with at most 4 requests running at a time:

```ts
const sizes = await mapLimit(urls, 4, (url) => fetchSize(url)); // sizes: number[]
```

Generics: there are two type parameters because input and output can differ. `T` is the item type
you put in; `R` is the result type that `fn` returns.

```ts
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  // same worker-pool idea as M02; results stay in input order
}
```

Here is a problem to resolve in the port. The M02 version stores a failed item as an object
`{ error, index, item }` in the same `results` array as successful values, then searches for
the first entry with an `error` property:

```js
const firstError = results.find(r => r && r.error);
```

If a successful result is itself an object that happens to have an `error` field, it gets treated
as a failure. Typed code can avoid that by making every item a `Result<R, E>`, so success and
failure are never mixed. Decide in M04 whether `mapLimit` returns `Result<R, E>[]` (report every
outcome) or throws on the first failure (what M02 does), and document the choice.

`mapLimitStrict` in M02 processes items in fixed chunks of `limit` with `Promise.all`. It is
simpler but waits for each whole chunk, so one slow item holds up the next chunk. Port it too, or
note in the write-up why you didn't.

### Where the toolkit ends up

After the port, `src/utils/` should export typed `sleep`, `retry`, `withTimeout`, and `mapLimit`,
and the existing self-checks should still pass under `tsx`. The M04 deliverable is that the
ported code, plus the Task types, type-checks with zero `tsc --noEmit` errors on a strict config.

## 6. Project setup for M04

Key `tsconfig.json` options and what they do:

| Option | Why |
|---|---|
| `strict` | Turns on the full set of safety checks. |
| `module: "nodenext"`, `moduleResolution: "nodenext"` | Matches how Node resolves ESM and CJS. |
| `verbatimModuleSyntax` | Imports and exports are emitted exactly as written; forces `import type` for type-only imports. |
| `erasableSyntaxOnly` | Rejects TypeScript-only runtime syntax (`enum`, `namespace`, parameter properties). Needed so Node's native type stripping can run the file. |
| `noUncheckedIndexedAccess` | `arr[i]` is `T \| undefined`, so out-of-range access is caught. |
| `noEmit` | Type-check only; `tsx` runs the code, so `tsc` does not write JS. |
| `skipLibCheck` | Skips type-checking inside `.d.ts` files from dependencies. |

Scripts to expect:

- `npm run typecheck` → `tsc --noEmit`, the type-check gate. Zero errors is the M04 target.
- Running files: `tsx src/...` (see section 7).
- Types for Node APIs come from `@types/node`. Its major version should match the Node major you
  run. The brief pins the cohort to Node 24 with `@types/node@24`.

### Node version note

The M04 brief says the cohort runs **Node 24 LTS**, pinned in `.nvmrc`. This machine currently has
Node `v26.10.0`. Check `node -v` before setup and pin the version you actually use, so that the
write-up and `@types/node` match it.

## 7. Three ways to run TypeScript

1. **`tsx`** (this course's dev runner). Runs `.ts` files directly using esbuild. It does not type
   check, so keep `npm run typecheck` as a separate step.
2. **Node's native type stripping.** Node removes type annotations at load time, with no compiler
   step. It only accepts *erasable* syntax, so these fail:
   - `enum` and `namespace` (non-erasable)
   - parameter properties (`constructor(private x: number)`)
   - some import forms, and relative imports without an explicit extension

   Node 24 treats this as experimental; full stability is in Node 26, so on 24 it is awareness
   material. Record what happens when you try it.
3. **`tsc` build to JavaScript.** Compiles to a `dist/` folder. Awareness only in M04; you will
   meet it in deployment modules.

## 8. Reading compiler errors

Read the **first** error. It names the file, the line, the error code (`TS2322`, for example), and
the mismatch. Common ones:

- `Type 'X' is not assignable to type 'Y'`: the value's shape differs from the declared type.
- `Object is possibly 'undefined'`: narrow before use (`if (x) ...`) or handle the missing case.
- `Property 'x' does not exist on type 'Y'`: either the type is missing a field, or you need to
  narrow a union first.
- `'e' is of type 'unknown'`: narrow it (`if (e instanceof Error)`) before reading properties.
- `Cannot find module` after adding a dependency: install `@types/...` if the package ships no types.

## 9. TypeScript 6 → 7 (from the M04 brief)

- TypeScript 7 is the target version for this course.
- It is strict by default, drops legacy options, and uses a native compiler for speed.
- It does not offer the programmatic compiler API that some tools depend on. You'll see the effect
  of that in tooling discussions in M09.

## 10. M03 — what carries forward

M03 is plain JavaScript. Its concepts still apply once TypeScript starts:

- **Modules.** ESM vs CommonJS, `"type": "module"`, `node:` imports. The TypeScript config must match
  this (`nodenext`).
- **`parseArgs` and the `log-report` CLI.** Once typed, the parsed options become a typed object
  instead of loose strings. This is a good place to see `unknown` narrowing in practice.
- **Streams.** `node:stream` and async iteration over a file are typed with generics; the types
  show the chunk shape you're handling.
- **`node:http` server.** Hand-rolled routing and body parsing is where the request body starts as
  `unknown` and must be narrowed. That is exactly the problem Zod solves in M08.

M03 itself does not require TypeScript. Its write-up and PRs stay in JavaScript.

## 11. Study checklist before M04

- [ ] Explain structural typing, and why `{ ok: true, value }` works without a class.
- [ ] Explain `unknown` vs `any`, and `type` vs `interface`, in your own words.
- [ ] Write a discriminated union and narrow it with `if (r.ok)` or a `switch`.
- [ ] Write a generic function with one type parameter and one constraint.
- [ ] Explain what `retry`, `withTimeout`, and `mapLimit` do, and write their signatures.
- [ ] Explain the `mapLimit` error-mixing problem and pick a `Result`-based design.
- [ ] Know which `tsconfig` options matter for Node (`nodenext`, `verbatimModuleSyntax`,
      `erasableSyntaxOnly`).
- [ ] Know the difference between `tsx`, native type stripping, and `tsc` build.

## Addendum: use cases for strictly typed APIs

This is inspiration, not a requirement. Sections 1–11 cover the basics M04 needs. This addendum
shows what those basics lead to in APIs that need strict types.

### Where TypeScript pays off

- **Request and response contracts.** Every route has a defined input (params, query, body) and
  output. The compiler checks both sides of the call, not just one.
- **Shared types across client and server.** The frontend and backend import the same types, so
  they can't silently drift apart.
- **Data layers.** ORMs such as Prisma or Drizzle generate types from the database schema, so the
  code always matches the tables.
- **Configuration and environment.** Typed config fails fast at startup if a required variable is
  missing or has the wrong type, instead of failing on the first request.
- **Large codebases and teams.** Types document the code. A new developer can read a function
  signature instead of guessing what it accepts.

### What it prevents

| Bug | Without types | With types |
|---|---|---|
| Typo in a field name (`usr.nmae`) | Undefined at runtime; a blank value on the page | Compile error at the typo |
| Request body missing a field | Crash or bad data in the database | Rejected at the boundary by a schema, with a typed result |
| Client and server disagree on a response shape | Found by a user in production | Client build fails when the server type changes |
| Database column renamed | Queries break at runtime, possibly only on some routes | Every route that uses the column shows an error |
| Unhandled error path | Forgotten `catch`; the process crashes or returns a partial result | `Result<T, E>` forces the caller to handle failure |
| Wrong argument order (`retry(delay, fn)`) | Runs with the wrong values, no error | Compile error on mismatched argument types |
| `null` or `undefined` used as a value | `Cannot read properties of undefined` in production | Flagged when the value is used without a check |
| Unknown or extra fields reaching the database | Silent data corruption or a failed write | Schema strips or rejects them before the service runs |

### An example of the pattern

A typed API boundary, with runtime validation (Zod) at the edge, a typed service in the middle, and a
typed database layer at the bottom:

```
[ Client Request ] ──► [ Runtime Validation (Zod) ] ──► [ Typed Controller/Service ] ──► [ Typed Database (ORM) ]
```

Zod checks the data when it arrives. TypeScript infers the static type from the same schema, so you
don't write the shape twice:

```ts
import { z } from 'zod';

const CreateTask = z.object({
  title: z.string().min(1),
  status: z.enum(['open', 'done']).default('open'),
});

type CreateTaskInput = z.infer<typeof CreateTask>; // { title: string; status: 'open' | 'done' }
```

tRPC takes this further. A server defines procedures with Zod inputs, exports only the router's type,
and a client imports that type. The type is erased at compile time, so no server code reaches the
browser:

```ts
// server.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => ({ id: input.id, name: 'Alice', role: 'admin' })),
});

export type AppRouter = typeof appRouter;
```

```ts
// client.ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server';

const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
});

const user = await trpc.getUser.query({ id: 'usr_123' }); // autocomplete and types
console.log(user.name);                                    // string
```

If the server renames `name` or changes the input, the client build fails before anything is
deployed.

### How the API styles compare

| Feature | REST | gRPC | tRPC |
|---|---|---|---|
| Interface definition | OpenAPI / Swagger (optional) | `.proto` files | Native TypeScript types |
| Code generation | Needed for type safety (openapi-generator) | Needed (protoc compiler) | None (uses `typeof` inference) |
| Contract drift | Possible if the API doc isn't updated | Prevented via `.proto` | Caught at build time when the server changes |
| Language target | Any | Multi-language | Full-stack TypeScript (Node, Next.js, React Native) |
| Transport | JSON over HTTP/1.1 or HTTP/2 | Protobuf over HTTP/2 | JSON over HTTP (batched requests) |

This course uses plain REST with Express (M05), with Prisma (M07) and Zod (M08) layered on. tRPC is
not part of this project; it's here to show where typed APIs can go.

## References

- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- TSConfig reference: https://www.typescriptlang.org/tsconfig
- Node.js TypeScript support (type stripping): https://nodejs.org/api/typescript.html
- `tsx`: https://tsx.is
