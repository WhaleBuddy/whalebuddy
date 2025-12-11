# 🚀 Guia de Desenvolvimento - WhaleBuddy

> **Setup inicial, comandos úteis e workflow de desenvolvimento**

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 20 ou superior) → [Download](https://nodejs.org/)
- **Git** → [Download](https://git-scm.com/)
- **Docker** (para o banco de dados) → [Download](https://www.docker.com/)
- **Editor de código** (recomendamos VS Code) → [Download](https://code.visualstudio.com/)

---

## 🏁 Setup Inicial (primeira vez)

### 1. Clonar o repositório

```bash
git clone git@github.com:WhaleBuddy/whalebuddy.git
cd whalebuddy
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/whalebuddy"

# NextAuth
AUTH_SECRET="gere-um-secret-aqui"  # Execute: npx auth secret
AUTH_DISCORD_ID="seu-discord-client-id"
AUTH_DISCORD_SECRET="seu-discord-client-secret"
```

**Como gerar o AUTH_SECRET:**

```bash
npx auth secret
```

**Como obter credenciais do Discord:**

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá em "OAuth2" e copie o Client ID e Client Secret

### 4. Iniciar o banco de dados

```bash
./start-database.sh
```

Ou manualmente com Docker:

```bash
docker run --name whalebuddy-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 5. Criar as tabelas no banco

```bash
npm run db:push
```

### 6. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📦 Comandos Principais

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento (com Turbopack - mais rápido!)
npm run dev

# Verificar erros de TypeScript e ESLint
npm run check

# Rodar apenas o linter
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Verificar formatação do código
npm run format:check

# Formatar código automaticamente
npm run format:write
```

### Banco de Dados

```bash
# Aplicar mudanças no schema para o banco (desenvolvimento)
npm run db:push

# Gerar migrations (produção)
npm run db:generate

# Aplicar migrations
npm run db:migrate

# Abrir interface visual do banco (Drizzle Studio)
npm run db:studio
```

### Build e Deploy

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção (após build)
npm run start

# Build + Start (preview de produção)
npm run preview

# Verificar tipos TypeScript
npm run typecheck
```

---

## 🔄 Workflow de Desenvolvimento Diário

### 1. Antes de começar a trabalhar

```bash
# Atualizar código
git checkout main
git pull origin main

# Criar branch da task
git checkout -b WB-XXX/descricao-da-task

# Garantir que dependências estão atualizadas
npm install

# Iniciar banco (se não estiver rodando)
./start-database.sh

# Iniciar servidor
npm run dev
```

### 2. Durante o desenvolvimento

```bash
# Ver mudanças em tempo real
npm run dev  # (já deve estar rodando)

# Verificar erros antes de commitar
npm run check

# Formatar código
npm run format:write
```

### 3. Antes de fazer commit

```bash
# Verificar tudo
npm run check
npm run format:check

# Se tudo estiver ok, fazer commit
git add .
git commit -m "feat(WB-XXX): descrição da mudança"
git push
```

---

## 🗄️ Trabalhando com Banco de Dados

### Adicionar uma nova tabela

1. Edite `src/server/db/schema.ts`:

```typescript
export const tasks = pgTable("whalebuddy_task", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

2. Aplique as mudanças:

```bash
npm run db:push
```

### Ver dados no banco

```bash
npm run db:studio
```

Isso abre uma interface visual em [http://localhost:4983](http://localhost:4983)

---

## 🐛 Problemas Comuns

### Erro: "Port 3000 already in use"

Outro processo está usando a porta 3000.

**Solução:**

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro: "Cannot connect to database"

O banco de dados não está rodando.

**Solução:**

```bash
./start-database.sh
```

### Erro: "Module not found"

Dependências não instaladas ou desatualizadas.

**Solução:**

```bash
rm -rf node_modules
npm install
```

### Erros de TypeScript após pull

O cache do TypeScript pode estar desatualizado.

**Solução:**

```bash
rm -rf .next
npm run dev
```

---

## 🔗 Links Úteis

- **Documentação do Projeto:** [README.md](../README.md)
- **Guia de Git:** [git.md](./git.md)
- **Estrutura de Pastas:** [folder-structure.md](./folder-structure.md)
- **T3 Stack Docs:** https://create.t3.gg/
- **Next.js Docs:** https://nextjs.org/docs
- **tRPC Docs:** https://trpc.io/docs
- **Drizzle ORM Docs:** https://orm.drizzle.team/docs
