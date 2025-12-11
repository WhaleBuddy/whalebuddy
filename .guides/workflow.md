# 🔄 Workflow de Trabalho - WhaleBuddy

> **Passo a passo completo: da task ao merge**

---

## 📋 Visão Geral do Processo

```
1. Pegar task no board
2. Criar branch
3. Desenvolver feature
4. Testar localmente
5. Fazer commit
6. Criar Pull Request
7. Code Review
8. Merge
9. Limpar branch local
```

---

## 1️⃣ Pegar Task no Board

1. Acesse o board de tasks (Jira, Trello, GitHub Projects, etc.)
2. Escolha uma task disponível
3. Mova para "In Progress"
4. Anote o código da task (ex: `WB-014`)

---

## 2️⃣ Criar Branch

```bash
# Atualizar main
git checkout main
git pull origin main

# Criar branch da task
git checkout -b WB-014/add-task-feature

# Verificar que está na branch correta
git branch
```

**Formato da branch:** `WB-XXX/descricao-curta-em-ingles`

---

## 3️⃣ Desenvolver a Feature

### Exemplo: Criar uma feature de "Tasks"

#### Passo 1: Criar a tabela no banco

```typescript
// src/server/db/schema.ts
export const tasks = pgTable("whalebuddy_task", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

```bash
# Aplicar mudanças no banco
npm run db:push
```

#### Passo 2: Criar o router da API

```typescript
// src/server/api/routers/task.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { tasks } from "~/server/db/schema";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.userId, ctx.session.user.id),
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(tasks).values({
        ...input,
        userId: ctx.session.user.id,
      });
    }),
});
```

#### Passo 3: Registrar o router

```typescript
// src/server/api/root.ts
import { taskRouter } from "./routers/task";

export const appRouter = createTRPCRouter({
  post: postRouter,
  task: taskRouter, // ← Adicionar
});
```

#### Passo 4: Criar a página

```typescript
// src/app/tasks/page.tsx
import { TaskList } from "./_components/task-list";

export default function TasksPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">My Tasks</h1>
      <TaskList />
    </main>
  );
}
```

#### Passo 5: Criar o componente

```typescript
// src/app/tasks/_components/task-list.tsx
"use client";

import { api } from "~/trpc/react";

export function TaskList() {
  const { data: tasks, isLoading } = api.task.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <div key={task.id} className="rounded-lg border p-4">
          <h3 className="font-bold">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600">{task.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 4️⃣ Testar Localmente

```bash
# Verificar erros de TypeScript e lint
npm run check

# Se houver erros de formatação, corrigir
npm run format:write

# Testar no navegador
npm run dev
```

**Checklist de testes:**

- [ ] A página carrega sem erros
- [ ] Os dados aparecem corretamente
- [ ] Não há erros no console do navegador
- [ ] Não há erros de TypeScript
- [ ] O código está formatado corretamente

---

## 5️⃣ Fazer Commit

```bash
# Ver o que mudou
git status

# Adicionar arquivos
git add .

# Fazer commit (seguindo Conventional Commits)
git commit -m "feat(WB-014): add task management feature"

# Enviar para GitHub
git push -u origin WB-014/add-task-feature
```

**Tipos de commit:**

- `feat` → nova funcionalidade
- `fix` → correção de bug
- `refactor` → melhorar código sem mudar comportamento
- `chore` → tarefas internas (configs, updates)
- `docs` → documentação

---

## 6️⃣ Criar Pull Request

1. Acesse o GitHub
2. Clique em "Compare & pull request"
3. Preencha o template que aparece automaticamente:
   - **Título:** `feat(WB-014): add task management feature`
   - **Descrição:** Preencha as seções do template
   - **Checklist:** Marque todos os itens ✅
4. Marque reviewers
5. Clique em "Create pull request"

💡 **Dica:** O template já vem preenchido, só completar as informações!

### ⚙️ CI/CD Automático

Após criar a PR, o GitHub Actions vai rodar automaticamente:

- ✅ **ESLint** - Verifica erros de código
- ✅ **TypeScript** - Verifica erros de tipo
- ✅ **Prettier** - Verifica formatação
- ✅ **Build** - Tenta compilar o projeto

**Se algum check falhar:**

```bash
# Ver o erro localmente
npm run check

# Corrigir e fazer push
git add .
git commit -m "fix(WB-014): fix ci errors"
git push
```

---

## 7️⃣ Code Review

### Se pedirem mudanças:

```bash
# Fazer as alterações solicitadas

# Commitar as mudanças
git add .
git commit -m "fix(WB-014): address review comments"
git push

# A PR será atualizada automaticamente
```

### Se aprovarem:

Aguarde o merge! 🎉

---

## 8️⃣ Após o Merge

```bash
# Voltar para main
git checkout main

# Atualizar com as mudanças
git pull origin main

# Deletar branch local
git branch -d WB-014/add-task-feature
```

---

## 9️⃣ Atualizar Task no Board

1. Mova a task para "Done"
2. Adicione comentário com link da PR (se aplicável)

---

## 🚨 Problemas Comuns

### Conflitos ao fazer merge da main

```bash
# Atualizar sua branch com a main
git checkout main
git pull origin main
git checkout WB-014/add-task-feature
git merge main

# Se houver conflitos:
# 1. Abra os arquivos com conflito
# 2. Resolva manualmente (procure por <<<<<<, ======, >>>>>>)
# 3. Depois:
git add .
git commit -m "fix(WB-014): resolve merge conflicts"
git push
```

### PR com erros de lint/TypeScript

```bash
# Corrigir erros
npm run lint:fix
npm run check

# Commitar correções
git add .
git commit -m "fix(WB-014): fix lint errors"
git push
```

---

## 📚 Recursos

- [Guia de Git](./git.md)
- [Padrões de Código](./coding-standards.md)
- [Estrutura de Pastas](./folder-structure.md)
- [Guia de Desenvolvimento](./development.md)
