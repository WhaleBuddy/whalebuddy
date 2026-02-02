# File Locations

## Pages and Routes

- Pages: `src/app/{route}/page.tsx`
- Page components: `src/app/{route}/_components/`

## Server Code

- tRPC routers: `src/server/api/routers/{name}.ts`
- DB schema: `src/server/db/schema.ts`
- Auth config: `src/server/auth/config.ts`

## Imports

Always use path aliases:

```typescript
import { api } from "~/trpc/react";
import { db } from "~/server/db";
import { auth } from "~/server/auth";
```

Never use relative paths like `../../../`.
