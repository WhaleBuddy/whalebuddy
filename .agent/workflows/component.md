---
description: How to create React components following project patterns
---

# Create React Component

## Naming Conventions

- **Files:** `kebab-case.tsx` (e.g., `user-card.tsx`)
- **Components:** `PascalCase` (e.g., `UserCard`)
- **Location:** `src/app/{route}/_components/` for page-specific components

## 1. Server Component (Default)

Create `src/app/{route}/_components/my-component.tsx`:

```typescript
interface MyComponentProps {
  title: string;
  description?: string;
}

export function MyComponent({ title, description }: MyComponentProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      )}
    </div>
  );
}
```

## 2. Client Component (With Hooks/State)

Create `src/app/{route}/_components/my-client-component.tsx`:

```typescript
"use client";

import { useState } from "react";

interface MyClientComponentProps {
  initialValue?: number;
}

export function MyClientComponent({ initialValue = 0 }: MyClientComponentProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="flex items-center gap-4">
      <span className="text-white">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Increment
      </button>
    </div>
  );
}
```

## 3. Component with tRPC Data

```typescript
"use client";

import { api } from "~/trpc/react";

export function DataComponent() {
  const { data, isLoading, error } = api.myRouter.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.map((item) => (
        <div key={item.id} className="rounded-lg border p-4">
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

## 4. Component with Form/Mutation

```typescript
"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateForm() {
  const [name, setName] = useState("");
  const utils = api.useUtils();

  const createMutation = api.myRouter.create.useMutation({
    onSuccess: () => {
      setName("");
      utils.myRouter.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
        placeholder="Enter name..."
      />
      <button
        type="submit"
        disabled={createMutation.isPending || !name}
        className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {createMutation.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

## Tailwind Class Order

1. Layout (flex, grid)
2. Position (relative, absolute)
3. Size (w-, h-)
4. Spacing (p-, m-, gap-)
5. Typography (text-, font-)
6. Colors (bg-, text-, border-)
7. Borders (border, rounded)
8. Effects (shadow, opacity)
9. States (hover:, focus:)
