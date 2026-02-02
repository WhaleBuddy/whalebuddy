---
description: How to add a new page/route to the application
---

# Create New Page

## 1. Create Page Directory

Create folder at `src/app/{route-name}/`.
Use kebab-case for route names (e.g., `user-profile`, `task-list`).

## 2. Create page.tsx

Create `src/app/{route-name}/page.tsx`:

### Server Component Page (Default)

```typescript
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { MyComponent } from "./_components/my-component";

export default async function MyPage() {
  const session = await auth();
  if (!session) redirect("/");

  const data = await api.myRouter.getAll();

  return (
    <main className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Page Title</h1>
      <MyComponent data={data} />
    </main>
  );
}
```

### Client Component Page

```typescript
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { MyClientComponent } from "./_components/my-client-component";

export default function MyPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    redirect("/");
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Page Title</h1>
      <MyClientComponent />
    </main>
  );
}
```

## 3. Create Components Directory

Create `src/app/{route-name}/_components/` for page-specific components.
The `_` prefix prevents it from being a route.

## 4. Dynamic Routes

For dynamic segments like `/tasks/[id]`:

Create `src/app/tasks/[id]/page.tsx`:

```typescript
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: Props) {
  const { id } = await params;
  const task = await api.task.getById({ id: Number(id) });

  if (!task) notFound();

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">{task.name}</h1>
    </main>
  );
}
```

## Route Examples

| Path                | File                                |
| ------------------- | ----------------------------------- |
| `/`                 | `src/app/page.tsx`                  |
| `/dashboard`        | `src/app/dashboard/page.tsx`        |
| `/tasks`            | `src/app/tasks/page.tsx`            |
| `/tasks/123`        | `src/app/tasks/[id]/page.tsx`       |
| `/settings/profile` | `src/app/settings/profile/page.tsx` |
