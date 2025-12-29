---
description: How to add new environment variables
---

# Add Environment Variable

## 1. Add to .env.example

Edit `.env.example` to document the new variable:

```env
# Description of what this variable is for
MY_NEW_VAR="example-value"
```

## 2. Add to env.js Schema

Edit `src/env.js`:

### In the `server` section (for server-side vars):

```typescript
server: {
  // existing vars...
  MY_NEW_VAR: z.string(), // Required
  // OR
  MY_NEW_VAR: z.string().optional(), // Optional
  // OR
  MY_NEW_VAR: z.string().default("fallback"), // With default
  // OR for numbers:
  MY_PORT: z.coerce.number().optional(),
},
```

### In the `client` section (for client-side vars):

```typescript
client: {
  // Must start with NEXT_PUBLIC_
  NEXT_PUBLIC_MY_VAR: z.string(),
},
```

### In the `runtimeEnv` section:

```typescript
runtimeEnv: {
  // existing vars...
  MY_NEW_VAR: process.env.MY_NEW_VAR,
  // For client vars:
  NEXT_PUBLIC_MY_VAR: process.env.NEXT_PUBLIC_MY_VAR,
},
```

## 3. Add to Your Local .env

```env
MY_NEW_VAR="actual-value"
```

## 4. Use in Code

```typescript
import { env } from "~/env";

// Server-side
const value = env.MY_NEW_VAR;

// Client-side (must be NEXT_PUBLIC_)
const publicValue = env.NEXT_PUBLIC_MY_VAR;
```

## Validation Types

| Type              | Zod Schema                |
| ----------------- | ------------------------- |
| String (required) | `z.string()`              |
| String (optional) | `z.string().optional()`   |
| Number            | `z.coerce.number()`       |
| Boolean           | `z.coerce.boolean()`      |
| Enum              | `z.enum(["dev", "prod"])` |
| URL               | `z.string().url()`        |
| Email             | `z.string().email()`      |

## Important Notes

- Server vars are only accessible on the server
- Client vars MUST start with `NEXT_PUBLIC_`
- Never commit `.env` to git
- Always update `.env.example` for documentation
