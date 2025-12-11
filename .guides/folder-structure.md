# 📁 Estrutura de Pastas - WhaleBuddy

> **Baseado em T3 Stack + Bulletproof React** - Guia para entender onde cada coisa fica

---

## 🌳 Visão Geral da Estrutura

```
whalebuddy/
├── .guides/              # 📚 Guias para desenvolvedores
├── public/               # 🖼️ Arquivos estáticos (imagens, favicon, etc)
├── src/                  # 💻 Todo o código do projeto
│   ├── app/              # 🎯 Páginas e rotas (Next.js App Router)
│   ├── server/           # ⚙️ Código do servidor (API, DB, Auth)
│   ├── trpc/             # 🔌 Configuração do tRPC (client/server)
│   ├── styles/           # 🎨 Estilos globais (CSS/Tailwind)
│   └── env.js            # 🔐 Validação de variáveis de ambiente
├── drizzle.config.ts     # 🗄️ Configuração do Drizzle ORM
├── package.json          # 📦 Dependências do projeto
└── tsconfig.json         # ⚙️ Configuração do TypeScript
```

---

## 📂 Detalhamento das Pastas

### 🎯 `src/app/` - Páginas e Rotas (Next.js App Router)

Esta pasta segue o padrão do **Next.js 13+ App Router**. Cada pasta vira uma rota automaticamente.

```
src/app/
├── layout.tsx            # Layout principal (envolve todas as páginas)
├── page.tsx              # Página inicial (rota "/")
├── _components/          # Componentes usados APENAS nesta pasta
│   └── post.tsx          # Exemplo: componente de post
└── api/                  # Rotas de API
    ├── auth/             # Endpoints de autenticação (NextAuth)
    └── trpc/             # Endpoints do tRPC
```

**Regras importantes:**

- `page.tsx` = página visível na rota
- `layout.tsx` = layout que envolve as páginas
- `_components/` = componentes privados (o `_` indica que não é uma rota)
- Pastas sem `page.tsx` não criam rotas

**Exemplos de rotas:**

- `app/page.tsx` → `/` (home)
- `app/dashboard/page.tsx` → `/dashboard`
- `app/profile/settings/page.tsx` → `/profile/settings`

---

### ⚙️ `src/server/` - Código do Servidor

Todo código que roda **apenas no servidor** fica aqui. Nunca é enviado para o navegador.

```
src/server/
├── api/                  # 🔌 API do tRPC
│   ├── root.ts           # Router principal (junta todos os routers)
│   ├── trpc.ts           # Configuração base do tRPC
│   └── routers/          # Routers separados por feature
│       └── post.ts       # Exemplo: router de posts
├── auth/                 # 🔐 Autenticação (NextAuth)
│   ├── index.ts          # Exporta funções de auth
│   └── config.ts         # Configuração do NextAuth
└── db/                   # 🗄️ Banco de Dados (Drizzle)
    ├── index.ts          # Cliente do banco
    └── schema.ts         # Schema/tabelas do banco
```

**O que vai em cada pasta:**

#### `server/api/routers/` - Routers do tRPC

Cada arquivo é um "módulo" de funcionalidades relacionadas.

**Exemplo:** `post.ts`

```typescript
export const postRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx, input }) => {
    // Criar post
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Buscar todos os posts
  }),
});
```

#### `server/db/schema.ts` - Tabelas do Banco

Define a estrutura das tabelas usando Drizzle ORM.

**Exemplo:**

```typescript
export const posts = pgTable("whalebuddy_post", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdById: varchar("created_by_id", { length: 255 }).notNull(),
});
```

---

### 🔌 `src/trpc/` - Configuração do tRPC

Arquivos que conectam o cliente (navegador) com o servidor.

```
src/trpc/
├── react.tsx             # tRPC para componentes React (client)
├── server.ts             # tRPC para Server Components
└── query-client.ts       # Configuração do React Query
```

**Quando usar cada um:**

- `react.tsx` → Componentes client (`"use client"`)
- `server.ts` → Server Components (padrão no Next.js 13+)

---

### 🎨 `src/styles/` - Estilos Globais

```
src/styles/
└── globals.css           # Estilos globais + configuração do Tailwind
```

Aqui ficam estilos que afetam o projeto inteiro.

---

## 🚀 Como Organizar Novas Features

### Opção 1: Feature Simples (apenas uma página)

Se a feature é pequena, crie direto em `app/`:

```
src/app/
└── dashboard/
    ├── page.tsx          # Página do dashboard
    └── _components/      # Componentes usados só aqui
        ├── stats-card.tsx
        └── chart.tsx
```

### Opção 2: Feature Complexa (com API + DB)

Para features maiores, organize assim:

**1. Criar a rota em `app/`:**

```
src/app/tasks/
├── page.tsx              # Lista de tarefas
└── [id]/
    └── page.tsx          # Detalhes da tarefa
```

**2. Criar o router da API:**

```
src/server/api/routers/
└── task.ts               # Router de tarefas
```

**3. Adicionar tabelas no banco:**

```typescript
// src/server/db/schema.ts
export const tasks = pgTable("whalebuddy_task", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }),
  // ...
});
```

**4. Registrar o router:**

```typescript
// src/server/api/root.ts
import { taskRouter } from "./routers/task";

export const appRouter = createTRPCRouter({
  post: postRouter,
  task: taskRouter, // ← Adicionar aqui
});
```

---

## 📝 Convenções de Nomenclatura

### Arquivos e Pastas

- **Pastas:** `kebab-case` → `user-profile/`, `task-list/`
- **Componentes:** `kebab-case.tsx` → `user-card.tsx`, `task-item.tsx`
- **Routers:** `singular.ts` → `post.ts`, `user.ts`, `task.ts`

### Tabelas do Banco

- **Prefixo:** `whalebuddy_` → `whalebuddy_post`, `whalebuddy_user`
- **Nome:** singular → `post`, `user`, `task` (não `posts`, `users`)

---

## ❓ Perguntas Frequentes

**Q: Onde criar componentes reutilizáveis?**
A: Por enquanto, em `app/_components/`.

**Q: Onde colocar funções utilitárias?**
A: Crie `src/lib/utils.ts` ou `src/utils/`.

**Q: Onde ficam as variáveis de ambiente?**
A: Defina em `.env` e valide em `src/env.js`.

**Q: Como adicionar uma nova página?**
A: Crie uma pasta em `src/app/` com um arquivo `page.tsx`.

---

## 🔗 Referências

- [T3 Stack - Folder Structure](https://create.t3.gg/en/folder-structure)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
