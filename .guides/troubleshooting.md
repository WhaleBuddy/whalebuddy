# 🔧 Troubleshooting - WhaleBuddy

> **Soluções para problemas comuns**

---

## 🚨 Problemas de Setup

### ❌ Erro: "Cannot find module"

**Sintoma:**

```
Error: Cannot find module 'xyz'
```

**Causas comuns:**

1. Dependências não instaladas
2. Cache do Node desatualizado
3. Caminho de import incorreto

**Soluções:**

```bash
# 1. Reinstalar dependências
rm -rf node_modules
npm install

# 2. Limpar cache do npm
npm cache clean --force
npm install

# 3. Verificar o caminho do import
# Use ~ para imports do src/
import { api } from "~/trpc/react";  # ✅ Correto
import { api } from "../trpc/react"; # ❌ Evitar
import { api } from "@/trpc/react"; # ❌ Nunca usar
```

---

### ❌ Erro: "Port 3000 already in use"

**Sintoma:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução:**

```bash
# Linux/Mac - Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Windows - Encontrar e matar processo
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Ou use outra porta
PORT=3001 npm run dev
```

---

### ❌ Erro: "Cannot connect to database"

**Sintoma:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Causas:**

1. PostgreSQL não está rodando
2. Credenciais incorretas no `.env`
3. Porta incorreta

**Soluções:**

```bash
# 1. Iniciar o banco de dados
./start-database.sh

# 2. Verificar se está rodando
docker ps

# 3. Verificar .env
# DATABASE_URL deve ser:
DATABASE_URL="postgresql://postgres:password@localhost:5432/whalebuddy"

# 4. Testar conexão
npm run db:studio
```

---

## 🐛 Problemas de Desenvolvimento

### ❌ Erro: TypeScript não reconhece tipos

**Sintoma:**

```
Property 'xyz' does not exist on type 'ABC'
```

**Soluções:**

```bash
# 1. Reiniciar TypeScript server (VS Code)
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# 2. Limpar cache do Next.js
rm -rf .next
npm run dev

# 3. Verificar tsconfig.json
npm run typecheck
```

---

### ❌ Erro: tRPC "No QueryClient set"

**Sintoma:**

```
Error: No QueryClient set, use QueryClientProvider to set one
```

**Causa:** Usando `api` do tRPC fora de um componente client.

**Solução:**

```typescript
// ❌ ERRADO - Server Component
import { api } from "~/trpc/react";

export default function Page() {
  const { data } = api.post.getAll.useQuery(); // Erro!
}

// ✅ CORRETO - Client Component
("use client");

import { api } from "~/trpc/react";

export default function Page() {
  const { data } = api.post.getAll.useQuery(); // OK!
}

// ✅ CORRETO - Server Component
import { api } from "~/trpc/server";

export default async function Page() {
  const posts = await api.post.getAll(); // OK!
}
```

---

### ❌ Erro: "Hydration failed"

**Sintoma:**

```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Causas comuns:**

1. Renderização diferente entre servidor e cliente
2. Usar `window` ou `document` em Server Component
3. HTML inválido (ex: `<p>` dentro de `<p>`)

**Soluções:**

```typescript
// ❌ ERRADO
export default function Component() {
  const isClient = typeof window !== "undefined";
  return <div>{isClient ? "Client" : "Server"}</div>;
}

// ✅ CORRETO - Use useEffect
"use client";

import { useEffect, useState } from "react";

export default function Component() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return <div>Client only content</div>;
}
```

---

## 🗄️ Problemas de Banco de Dados

### ❌ Erro: "relation does not exist"

**Sintoma:**

```
error: relation "whalebuddy_post" does not exist
```

**Causa:** Tabela não foi criada no banco.

**Solução:**

```bash
# Aplicar schema ao banco
npm run db:push

# Ou gerar e aplicar migration
npm run db:generate
npm run db:migrate
```

---

### ❌ Erro: Drizzle schema não atualiza

**Sintoma:** Mudanças no `schema.ts` não aparecem no banco.

**Solução:**

```bash
# 1. Verificar se salvou o arquivo schema.ts

# 2. Aplicar mudanças
npm run db:push

# 3. Verificar no Drizzle Studio
npm run db:studio
```

---

## 🎨 Problemas de Estilo

### ❌ Tailwind classes não funcionam

**Sintoma:** Classes do Tailwind não aplicam estilos.

**Soluções:**

```bash
# 1. Verificar se importou globals.css
# src/app/layout.tsx deve ter:
import "~/styles/globals.css";

# 2. Reiniciar servidor
# Ctrl+C e depois:
npm run dev

# 3. Verificar se a classe existe
# Consulte: https://tailwindcss.com/docs
```

---

## 🔐 Problemas de Autenticação

### ❌ Erro: "Invalid environment variables"

**Sintoma:**

```
Invalid environment variables: { AUTH_SECRET: ... }
```

**Solução:**

```bash
# 1. Gerar novo secret
npx auth secret

# 2. Adicionar ao .env
AUTH_SECRET="cole-o-secret-aqui"

# 3. Reiniciar servidor
npm run dev
```

---

### ❌ Login com Discord não funciona

**Sintoma:** Erro ao fazer login ou redirect não funciona.

**Soluções:**

1. **Verificar credenciais no `.env`:**

```env
AUTH_DISCORD_ID="seu-client-id"
AUTH_DISCORD_SECRET="seu-client-secret"
```

2. **Verificar redirect URI no Discord:**
   - Acesse [Discord Developer Portal](https://discord.com/developers/applications)
   - Vá em OAuth2 → Redirects
   - Adicione: `http://localhost:3000/api/auth/callback/discord`

3. **Verificar AUTH_SECRET:**

```bash
npx auth secret
# Copie o resultado para .env
```

---

## 🔍 Como Debugar

### 1. Ler a mensagem de erro completa

Não ignore o stack trace! Ele mostra:

- Qual arquivo tem o erro
- Qual linha
- O que causou

### 2. Verificar o console do navegador

```
F12 → Console
```

Procure por:

- Erros em vermelho
- Warnings em amarelo
- Network errors (aba Network)

### 3. Usar console.log estrategicamente

```typescript
export function MyComponent({ data }: Props) {
  console.log("1. Component rendered");
  console.log("2. Data:", data);

  const result = processData(data);
  console.log("3. Result:", result);

  return <div>{result}</div>;
}
```

**Lembre-se:** Remova os `console.log` antes de commitar!

### 4. Verificar tipos TypeScript

```bash
npm run typecheck
```

### 5. Verificar lint

```bash
npm run check
```

---

## 🆘 Ainda com Problemas?

### Antes de pedir ajuda:

1. ✅ Leia a mensagem de erro completa
2. ✅ Procure o erro no Google
3. ✅ Verifique os guias desta pasta
4. ✅ Tente por 15-30 minutos
5. ✅ Prepare informações sobre o problema

### Como pedir ajuda:

**Informações necessárias:**

- O que você está tentando fazer
- O que você já tentou
- Mensagem de erro completa
- Código relevante (se aplicável)
- Screenshots (se ajudar)

**Exemplo bom:**

```
Estou tentando criar um router tRPC mas recebo este erro:

Error: Cannot find module '~/server/api/routers/task'

Já verifiquei:
- O arquivo existe em src/server/api/routers/task.ts
- O import está correto: import { taskRouter } from "~/server/api/routers/task"
- Rodei npm install

O que mais posso tentar?
```

---

## 📚 Recursos Úteis

- [Stack Overflow](https://stackoverflow.com/) - Procure erros
- [T3 Stack Discord](https://t3.gg/discord) - Comunidade T3
- [Next.js Docs](https://nextjs.org/docs) - Documentação oficial
- [tRPC Docs](https://trpc.io/docs) - Documentação tRPC
