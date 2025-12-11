# ⭐ Guia de Git - WhaleBuddy

**Guia prático para o dia a dia**

---

## 📋 Regras Básicas

### Branches

```
WB-XXX/descricao-curta-em-ingles
```

**Exemplo:** `WB-014/add-telegram-bot`

### Commits (Conventional Commits)

```
tipo(WB-XXX): descrição curta em inglês
```

**Exemplo:** `feat(WB-014): add telegram bot integration`

**Tipos principais:**

- `feat` → nova funcionalidade
- `fix` → correção de bug
- `refactor` → melhorar código
- `chore` → configs, dependências
- `docs` → documentação

---

## 🚀 Workflow Completo (Passo a Passo)

### 1️⃣ Começar uma nova task

```bash
# Atualizar a main
git checkout main
git pull origin main

# Criar branch da task
git checkout -b WB-014/add-telegram-bot
```

### 2️⃣ Trabalhar no código

```bash
# Ver o que mudou
git status

# Ver diferenças detalhadas
git diff
```

### 3️⃣ Salvar seu trabalho (commit)

```bash
# Adicionar todos os arquivos
git add .

# Ou adicionar arquivo específico
git add src/server/api/routers/telegram.ts

# Fazer commit
git commit -m "feat(WB-014): add telegram bot integration"
```

### 4️⃣ Enviar para o GitHub

```bash
# Primeira vez (cria a branch no GitHub)
git push -u origin WB-014/add-telegram-bot

# Próximas vezes (já existe no GitHub)
git push
```

### 5️⃣ Criar Pull Request

1. Acesse o GitHub
2. Clique em **"Compare & pull request"**
3. Preencha o template que aparece automaticamente:
   - **Título:** `feat(WB-014): add telegram bot integration`
   - **Descrição:** Preencha as seções do template
   - **Checklist:** Marque todos os itens ✅
4. Clique em **"Create pull request"**

💡 **Dica:** O GitHub já mostra um template pronto, só preencher!

### 6️⃣ Code Review (se pedirem mudanças)

```bash
# Fazer as correções no código

# Commitar as mudanças
git add .
git commit -m "fix(WB-014): address review comments"

# Enviar (a PR atualiza automaticamente)
git push
```

### 7️⃣ Após o merge

```bash
# Voltar para main
git checkout main

# Atualizar com as mudanças
git pull origin main

# Deletar branch local (já foi mergeada)
git branch -d WB-014/add-telegram-bot
```

---

## 🔄 Situações Comuns

### Atualizar sua branch com mudanças da main

```bash
# Ir para main e atualizar
git checkout main
git pull origin main

# Voltar para sua branch
git checkout WB-014/add-telegram-bot

# Trazer mudanças da main
git merge main

# Se tudo ok, enviar
git push
```

### Resolver conflitos

Quando aparecer conflito após `git merge main`:

1. **Abra os arquivos com conflito** (Git mostra quais são)
2. **Procure por:**
   ```
   <<<<<<< HEAD
   seu código
   =======
   código da main
   >>>>>>> main
   ```
3. **Escolha qual código manter** (ou combine os dois)
4. **Remova as marcações** (`<<<<<<<`, `=======`, `>>>>>>>`)
5. **Salve o arquivo**
6. **Finalize:**
   ```bash
   git add .
   git commit -m "fix(WB-014): resolve merge conflicts"
   git push
   ```

### Ver histórico de commits

```bash
# Ver últimos commits
git log --oneline

# Ver commits de um arquivo específico
git log --oneline src/server/api/routers/post.ts

# Ver detalhes de um commit
git show abc123
```

### Desfazer mudanças (antes do commit)

```bash
# Desfazer mudanças em um arquivo
git checkout -- src/app/page.tsx

# Desfazer todas as mudanças
git checkout -- .
```

### Corrigir último commit (antes do push)

```bash
# Adicionar mais arquivos ao último commit
git add arquivo-esquecido.ts
git commit --amend --no-edit

# Mudar mensagem do último commit
git commit --amend -m "feat(WB-014): nova mensagem"
```

⚠️ **Atenção:** Só use `--amend` se ainda NÃO deu push!

---

## ❌ Erros Comuns

### "Your branch is behind"

**Problema:** Sua branch está desatualizada.

**Solução:**

```bash
git pull origin WB-014/add-telegram-bot
```

### "Please commit your changes or stash them"

**Problema:** Você tem mudanças não commitadas.

**Solução 1 - Commitar:**

```bash
git add .
git commit -m "feat(WB-014): work in progress"
```

**Solução 2 - Guardar temporariamente:**

```bash
# Guardar mudanças
git stash

# Fazer o que precisa (pull, checkout, etc)
git pull

# Recuperar mudanças
git stash pop
```

### "fatal: not a git repository"

**Problema:** Você não está na pasta do projeto.

**Solução:**

```bash
cd ~/whalebuddy
```

---

## 🧾 COLA RÁPIDA (comandos do dia a dia)

```bash
# 1. Atualizar projeto antes de começar
git checkout main
git pull origin main

# 2. Criar branch da task
git checkout -b WB-XXX/descricao-curta

# 3. Trabalhar no código...

# 4. Ver o que mudou
git status

# 5. Adicionar mudanças
git add .

# 6. Fazer commit (conventional commits!)
git commit -m "feat(WB-XXX): short description"

# 7. Enviar para GitHub (primeira vez)
git push -u origin WB-XXX/descricao-curta

# 8. Próximos pushes (depois do primeiro)
git push

# 9. Atualizar branch com mudanças da main
git checkout main
git pull origin main
git checkout WB-XXX/descricao-curta
git merge main
git push
```

---

## 💡 Dicas Importantes

✅ **Sempre** rode `git pull` antes de criar uma branch
✅ **Sempre** use mensagens de commit descritivas
✅ **Sempre** teste seu código antes de fazer commit
✅ **Sempre** revise o que está commitando com `git status`

❌ **Nunca** faça commit direto na `main`
❌ **Nunca** force push (`git push -f`) sem permissão
❌ **Nunca** commite arquivos sensíveis (`.env`, senhas, etc)
❌ **Nunca** use `git add .` sem verificar o que está adicionando

---

## 📚 Recursos

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Docs](https://docs.github.com/)
