---
description: How to implement a new feature end-to-end (DB + API + UI)
---

# New Feature Implementation

Follow these steps to implement a new feature in WhaleBuddy.

## 1. Update Main Branch

```bash
git checkout main
git pull origin main
```

## 2. Create Feature Branch

```bash
git checkout -b WB-XXX/feature-description
```

Replace `WB-XXX` with the task ID and use kebab-case for description.

## 3. Create Database Schema

Edit `src/server/db/schema.ts`:

```typescript
export const myTable = createTable("my_table", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }).notNull(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));
```

Tables are auto-prefixed with `whalebuddy_` by `createTable`.

// turbo

## 4. Push Schema to Database

```bash
npm run db:push
```

## 5. Create tRPC Router

Create `src/server/api/routers/my-feature.ts`:

```typescript
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const myFeatureRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.myTable.findMany({
      where: (table, { eq }) => eq(table.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(myTable).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
});
```

## 6. Register Router

Edit `src/server/api/root.ts`:

```typescript
import { myFeatureRouter } from "./routers/my-feature";

export const appRouter = createTRPCRouter({
  post: postRouter,
  myFeature: myFeatureRouter, // Add here
});
```

## 7. Create Page

Create `src/app/my-feature/page.tsx`:

```typescript
import { MyFeatureList } from "./_components/my-feature-list";

export default function MyFeaturePage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">My Feature</h1>
      <MyFeatureList />
    </main>
  );
}
```

## 8. Create Component

Create `src/app/my-feature/_components/my-feature-list.tsx`:

```typescript
"use client";

import { api } from "~/trpc/react";

export function MyFeatureList() {
  const { data, isLoading } = api.myFeature.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {data?.map((item) => (
        <div key={item.id} className="rounded-lg border p-4">
          <h3 className="font-bold">{item.name}</h3>
        </div>
      ))}
    </div>
  );
}
```

// turbo

## 9. Verify Build

```bash
npm run check
```

## 10. Format Code

```bash
npm run format:write
```

## 11. Commit Changes

```bash
git add .
git commit -m "feat(WB-XXX): add my feature"
git push -u origin WB-XXX/feature-description
```

## 12. Create Pull Request

Go to GitHub and create a PR with the provided template.
