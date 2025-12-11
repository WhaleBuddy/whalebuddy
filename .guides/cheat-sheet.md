# 📋 Cheat Sheet - WhaleBuddy

> **Cola rápida para o dia a dia**

---

## 🚀 Comandos Essenciais

### Desenvolvimento

```bash
npm run dev          # Iniciar servidor (localhost:3000)
npm run check        # Verificar erros (TypeScript + ESLint)
npm run lint:fix     # Corrigir erros de lint
npm run format:write # Formatar código
```

### Banco de Dados

```bash
./start-database.sh  # Iniciar PostgreSQL
npm run db:push      # Aplicar mudanças no schema
npm run db:studio    # Abrir interface visual (localhost:4983)
```

### Git

```bash
git checkout main && git pull              # Atualizar main
git checkout -b WB-XXX/descricao          # Criar branch
git add . && git commit -m "tipo(WB-XXX): msg"  # Commit
git push -u origin WB-XXX/descricao       # Push (primeira vez)
git push                                   # Push (próximas vezes)
```

---

## 📁 Onde Criar Arquivos

| O que criar          | Onde criar                    | Exemplo                                   |
| -------------------- | ----------------------------- | ----------------------------------------- |
| Nova página          | `src/app/`                    | `src/app/tasks/page.tsx`                  |
| Componente da página | `src/app/[rota]/_components/` | `src/app/tasks/_components/task-card.tsx` |
| Router tRPC          | `src/server/api/routers/`     | `src/server/api/routers/task.ts`          |
| Tabela do banco      | `src/server/db/schema.ts`     | Adicionar no arquivo existente            |
| Estilo global        | `src/styles/globals.css`      | Adicionar no arquivo existente            |

---

## 🎯 Padrão de Commits (Conventional Commits)

```bash
feat(WB-XXX): add new feature       # Nova funcionalidade
fix(WB-XXX): fix bug in component   # Correção de bug
refactor(WB-XXX): improve code      # Melhorar código
chore(WB-XXX): update dependencies  # Tarefas internas
docs(WB-XXX): update guide          # Documentação
test(WB-XXX): add unit tests        # Testes
```

---

## 🏗️ Templates de Código

### Componente Client

```typescript
"use client";

import { api } from "~/trpc/react";

export function MyComponent() {
  const { data, isLoading } = api.myRouter.myQuery.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return <div>{data?.name}</div>;
}
```

### Página (Server Component)

```typescript
import { MyComponent } from "./_components/my-component";

export default function MyPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Title</h1>
      <MyComponent />
    </main>
  );
}
```

### Router tRPC

```typescript
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const myRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.myTable.findMany();
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(myTable).values(input);
    }),
});
```

### Tabela do Banco

```typescript
export const myTable = pgTable("whalebuddy_my_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 🎨 Classes Tailwind Comuns

### Layout

```typescript
className = "flex items-center justify-between"; // Flexbox
className = "grid grid-cols-3 gap-4"; // Grid
className = "container mx-auto"; // Container centralizado
```

### Espaçamento

```typescript
className = "p-4"; // Padding (1rem)
className = "m-4"; // Margin (1rem)
className = "gap-4"; // Gap em flex/grid
className = "space-y-4"; // Espaço vertical entre filhos
```

### Tipografia

```typescript
className = "text-xl font-bold"; // Título
className = "text-sm text-gray-600"; // Texto pequeno
className = "text-center"; // Centralizar texto
```

### Cores

```typescript
className = "bg-white text-black"; // Fundo branco, texto preto
className = "bg-blue-500 text-white"; // Botão azul
className = "border border-gray-200"; // Borda cinza
```

### Bordas e Sombras

```typescript
className = "rounded-lg"; // Bordas arredondadas
className = "shadow-sm"; // Sombra leve
className = "border"; // Borda padrão
```

### Estados

```typescript
className = "hover:bg-blue-600"; // Hover
className = "focus:ring-2"; // Focus
className = "disabled:opacity-50"; // Disabled
```

---

## 🔍 Debugging Rápido

### Erro de TypeScript

```bash
rm -rf .next && npm run dev
```

### Erro de Dependências

```bash
rm -rf node_modules package-lock.json && npm install
```

### Erro de Banco

```bash
npm run db:push
```

### Porta em uso

```bash
lsof -ti:3000 | xargs kill -9  # Mac/Linux
```

### Ver logs do tRPC

```typescript
// No router, adicione:
console.log("Input:", input);
console.log("Result:", result);
```

---

## 📝 Checklist Antes de Criar PR

- [ ] `npm run check` passou sem erros
- [ ] `npm run format:write` executado
- [ ] Testei localmente e funciona
- [ ] Removi todos os `console.log`
- [ ] Commit segue padrão: `tipo(WB-XXX): mensagem`
- [ ] Branch segue padrão: `WB-XXX/descricao`
- [ ] Preenchi o template da PR completamente

💡 **Após criar a PR, o CI vai rodar automaticamente:**

- ✅ ESLint
- ✅ TypeScript
- ✅ Prettier
- ✅ Build

---

## 🆘 Ajuda Rápida

| Problema                   | Solução                                          |
| -------------------------- | ------------------------------------------------ |
| Não sei onde criar arquivo | Ver [Estrutura de Pastas](./folder-structure.md) |
| Erro que não entendo       | Ver [Troubleshooting](./troubleshooting.md)      |
| Como fazer commit          | Ver [Git Guide](./git.md)                        |
| Como criar feature         | Ver [Workflow](./workflow.md)                    |
| Padrões de código          | Ver [Coding Standards](./coding-standards.md)    |

---

## 🔗 Links Úteis

- **Localhost:** http://localhost:3000
- **DB Studio:** http://localhost:4983
- **GitHub:** https://github.com/WhaleBuddy/whalebuddy
- **Tailwind Docs:** https://tailwindcss.com/docs
- **tRPC Docs:** https://trpc.io/docs

---

## 💡 Dicas Rápidas

✅ **Sempre** rode `git pull` antes de criar uma branch
✅ **Sempre** rode `npm run check` antes de commitar
✅ **Sempre** use `"use client"` quando usar hooks do React
✅ **Sempre** use `~` para imports: `import { x } from "~/..."`
✅ **Sempre** prefixe tabelas com `whalebuddy_`

❌ **Nunca** commite com erros de lint
❌ **Nunca** commite `console.log` em produção
❌ **Nunca** edite arquivos em `node_modules/`
❌ **Nunca** commite o arquivo `.env`
❌ **Nunca** faça push direto para `main`

---

**💪 Bora codar!**
