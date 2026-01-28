---
description: How to create a new tRPC router with queries and mutations
---

# Create tRPC Router

## 1. Create Router File

Create `src/server/api/routers/{feature-name}.ts` using kebab-case.

## 2. Router Template

```typescript
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { tableName } from "~/server/db/schema";

export const featureRouter = createTRPCRouter({
  // Public query - no auth required
  getPublic: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tableName.findMany();
  }),

  // Protected query - requires auth
  getOwn: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tableName.findMany({
      where: (table, { eq }) => eq(table.userId, ctx.session.user.id),
    });
  }),

  // Protected query with input
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tableName.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      });
    }),

  // Mutation with validation
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(tableName).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),

  // Update mutation
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(256).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.update(tableName).set(data).where(eq(tableName.id, id));
    }),

  // Delete mutation
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(tableName).where(eq(tableName.id, input.id));
    }),
});
```

## 3. Register in Root Router

Edit `src/server/api/root.ts`:

```typescript
import { featureRouter } from "./routers/feature-name";

export const appRouter = createTRPCRouter({
  // existing routers...
  feature: featureRouter,
});
```

## 4. Use in Client Component

```typescript
"use client";

import { api } from "~/trpc/react";

export function MyComponent() {
  // Query
  const { data, isLoading, refetch } = api.feature.getOwn.useQuery();

  // Mutation
  const createMutation = api.feature.create.useMutation({
    onSuccess: () => refetch(),
  });

  const handleCreate = () => {
    createMutation.mutate({ name: "New Item" });
  };

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* UI */}</div>;
}
```

## 5. Use in Server Component

```typescript
import { api } from "~/trpc/server";

export default async function Page() {
  const data = await api.feature.getPublic();
  return <div>{/* UI */}</div>;
}
```
