# WhaleBuddy - Code Patterns

This document defines coding patterns and conventions for the project.

## Language Standards

- All code-related content MUST be in English:
  - Variable/function/class names
  - Comments and documentation
  - Commit messages
  - Error messages and logs

## Naming Conventions

### Files and Directories

- **Directories:** `kebab-case` → `user-profile/`, `task-list/`
- **Components:** `kebab-case.tsx` → `user-card.tsx`, `task-item.tsx`
- **Routers:** `singular.ts` → `post.ts`, `user.ts`, `task.ts`

### Code

- **Variables/Functions:** `camelCase` → `userName`, `getUserById`
- **Components:** `PascalCase` → `UserCard`, `TaskList`
- **Constants (global):** `UPPER_SNAKE_CASE` → `MAX_RETRY_COUNT`
- **Types/Interfaces:** `PascalCase` → `User`, `TaskProps`

### Database

- **Tables:** Auto-prefixed with `whalebuddy_` by `createTable`
- **Table Names:** `singular` → `post`, `user`, `task` (not `posts`)

## File Locations

| What            | Where                          | Example                                   |
| --------------- | ------------------------------ | ----------------------------------------- |
| Page            | `src/app/{route}/page.tsx`     | `src/app/tasks/page.tsx`                  |
| Page Components | `src/app/{route}/_components/` | `src/app/tasks/_components/task-card.tsx` |
| tRPC Router     | `src/server/api/routers/`      | `src/server/api/routers/task.ts`          |
| DB Schema       | `src/server/db/schema.ts`      | Add to existing file                      |
| Global Styles   | `src/styles/globals.css`       | Add to existing file                      |

## Import Conventions

Always use path aliases:

```typescript
// ✅ Correct
import { api } from "~/trpc/react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

// ❌ Wrong
import { api } from "../../../trpc/react";
```

## Component Patterns

### Client vs Server Components

- **Server Components (default):** No `"use client"`, can `await` data
- **Client Components:** Add `"use client"`, use hooks (useState, useEffect)

### When to use "use client"

- Using React hooks (useState, useEffect, etc.)
- Using event handlers (onClick, onChange, etc.)
- Using browser APIs
- Using `api.*.useQuery()` or `api.*.useMutation()`

## tRPC Patterns

### Procedures

- `publicProcedure` - No auth required
- `protectedProcedure` - Requires authenticated session

### Client Usage

```typescript
// Query
const { data, isLoading } = api.router.procedure.useQuery();

// Mutation
const mutation = api.router.procedure.useMutation({
  onSuccess: () => utils.router.procedure.invalidate(),
});
```

### Server Usage

```typescript
const data = await api.router.procedure();
```

## Tailwind Class Order

1. Layout (flex, grid, block)
2. Position (relative, absolute)
3. Size (w-, h-, max-w-)
4. Spacing (p-, m-, gap-)
5. Typography (text-, font-)
6. Colors (bg-, text-, border-)
7. Borders (border, rounded)
8. Effects (shadow, opacity)
9. States (hover:, focus:)

## Commit Message Format

```
type(WB-XXX): short description in english
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`

## Things to Avoid

- ❌ Committing with lint/TypeScript errors
- ❌ Using `console.log` in production code
- ❌ Leaving commented-out code
- ❌ Using `any` type
- ❌ Creating unused files
- ❌ Pushing directly to `main`
- ❌ Committing `.env` files
