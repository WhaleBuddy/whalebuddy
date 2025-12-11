# 💻 Padrões de Código - WhaleBuddy

> **Boas práticas, convenções e como escrever código consistente**

---

## 📝 Convenções de Nomenclatura

### Arquivos e Pastas

```
✅ BOM                          ❌ EVITAR
user-profile.tsx               UserProfile.tsx
task-list.tsx                  taskList.tsx
api-client.ts                  APIClient.ts
use-auth.ts                    useAuth.ts
```

**Regra:** Use `kebab-case` (tudo minúsculo com hífens)

### Variáveis e Funções

```typescript
// ✅ BOM - camelCase
const userName = "João";
const isAuthenticated = true;
function getUserById(id: number) { }

// ❌ EVITAR
const UserName = "João";
const is_authenticated = true;
function GetUserById(id: number) { }
```

### Componentes React

```typescript
// ✅ BOM - PascalCase
export function UserCard() { }
export function TaskList() { }

// ❌ EVITAR
export function userCard() { }
export function task_list() { }
```

### Constantes

```typescript
// ✅ BOM - UPPER_SNAKE_CASE para constantes globais
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "https://api.example.com";

// ✅ BOM - camelCase para constantes locais
const defaultOptions = { timeout: 5000 };
```

### Tipos e Interfaces

```typescript
// ✅ BOM - PascalCase
type User = { id: number; name: string };
interface TaskProps { title: string; }

// ❌ EVITAR
type user = { id: number; name: string };
interface taskProps { title: string; }
```

---

## 🎯 Estrutura de Componentes React

### Componente Básico

```typescript
// src/app/_components/user-card.tsx
interface UserCardProps {
  name: string;
  email: string;
}

export function UserCard({ name, email }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-bold">{name}</h3>
      <p className="text-gray-600">{email}</p>
    </div>
  );
}
```

### Componente com Estado

```typescript
"use client";

import { useState } from "react";

interface CounterProps {
  initialValue?: number;
}

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Componente com tRPC

```typescript
"use client";

import { api } from "~/trpc/react";

export function PostList() {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id}>{post.name}</div>
      ))}
    </div>
  );
}
```

---

## 🔌 Criando Routers tRPC

### Router Básico

```typescript
// src/server/api/routers/task.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  // Query pública (qualquer um pode acessar)
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tasks.findMany();
  }),

  // Query protegida (precisa estar logado)
  getMyTasks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.userId, ctx.session.user.id),
    });
  }),

  // Mutation com validação de input
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(256),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(tasks).values({
        title: input.title,
        description: input.description,
        userId: ctx.session.user.id,
      });
    }),
});
```

### Registrar o Router

```typescript
// src/server/api/root.ts
import { taskRouter } from "./routers/task";

export const appRouter = createTRPCRouter({
  post: postRouter,
  task: taskRouter,  // ← Adicionar aqui
});
```

---

## 🗄️ Schema do Banco de Dados

### Definir Tabela

```typescript
// src/server/db/schema.ts
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("whalebuddy_task", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Relacionamentos

```typescript
import { relations } from "drizzle-orm";

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));
```

---

## 🎨 Estilização com Tailwind

### Classes Básicas

```typescript
// ✅ BOM - Classes organizadas e legíveis
<div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
    Click me
  </button>
</div>

// ❌ EVITAR - Classes desorganizadas
<div className="p-4 bg-white border shadow-sm rounded-lg flex justify-between items-center">
```

### Ordem Recomendada das Classes

1. Layout (flex, grid, block)
2. Posicionamento (relative, absolute)
3. Tamanho (w-, h-, max-w-)
4. Espaçamento (p-, m-, gap-)
5. Tipografia (text-, font-)
6. Cores (bg-, text-, border-)
7. Bordas (border, rounded)
8. Efeitos (shadow, opacity)
9. Estados (hover:, focus:)

---

## ✅ Boas Práticas Gerais

### 1. Sempre use TypeScript

```typescript
// ✅ BOM - Tipos explícitos
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0);
}

// ❌ EVITAR - Sem tipos
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0);
}
```

### 2. Evite `any`

```typescript
// ✅ BOM
function processData(data: unknown) {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
}

// ❌ EVITAR
function processData(data: any) {
  return data.toUpperCase();
}
```

### 3. Use destructuring

```typescript
// ✅ BOM
const { name, email } = user;

// ❌ EVITAR
const name = user.name;
const email = user.email;
```

### 4. Prefira const sobre let

```typescript
// ✅ BOM
const userName = "João";
const items = [1, 2, 3];

// ❌ EVITAR (a menos que precise reatribuir)
let userName = "João";
```

### 5. Use optional chaining

```typescript
// ✅ BOM
const userName = user?.profile?.name ?? "Guest";

// ❌ EVITAR
const userName = user && user.profile && user.profile.name || "Guest";
```

---

## 🚫 O Que Evitar

❌ **Não commite código com erros de lint**
```bash
npm run check  # Sempre rode antes de commitar
```

❌ **Não use `console.log` em produção**
```typescript
// Use apenas para debug local, remova antes do commit
console.log("Debug:", data);
```

❌ **Não deixe código comentado**
```typescript
// ❌ EVITAR
// const oldFunction = () => { ... }
// function unused() { ... }
```

❌ **Não crie arquivos sem usar**
- Se criou um arquivo e não usou, delete
- Se não tem certeza, pergunte antes de commitar

---

## 📚 Recursos para Aprender Mais

- **TypeScript:** https://www.typescriptlang.org/docs/
- **React:** https://react.dev/learn
- **Next.js:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **tRPC:** https://trpc.io/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs

