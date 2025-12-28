---
description: Git workflow for starting work, committing, and creating PRs
---

# Git Workflow

## Starting New Work

// turbo

### 1. Update Main

```bash
git checkout main
git pull origin main
```

### 2. Create Feature Branch

```bash
git checkout -b WB-XXX/short-description-in-english
```

Format: `WB-{task-id}/{kebab-case-description}`

## During Development

### Check Status

```bash
git status
git diff
```

### Stage and Commit

```bash
git add .
git commit -m "type(WB-XXX): short description in english"
```

**Commit Types:**

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code improvement
- `chore` - Config/dependencies
- `docs` - Documentation

### Push to GitHub

```bash
# First push (creates remote branch)
git push -u origin WB-XXX/short-description

# Subsequent pushes
git push
```

## Sync with Main

When main has updates you need:

```bash
git checkout main
git pull origin main
git checkout WB-XXX/short-description
git merge main
git push
```

## Resolve Conflicts

If conflicts appear after merge:

1. Open conflicted files (marked by git)
2. Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
3. Choose correct code and remove markers
4. Complete merge:

```bash
git add .
git commit -m "fix(WB-XXX): resolve merge conflicts"
git push
```

## Create Pull Request

1. Go to GitHub
2. Click "Compare & pull request"
3. Fill template:
   - **Title:** `type(WB-XXX): description`
   - **Description:** Fill all sections
   - **Checklist:** Check all items ✅
4. Request reviewers
5. Click "Create pull request"

## After PR is Merged

```bash
git checkout main
git pull origin main
git branch -d WB-XXX/short-description
```

## Pre-Commit Checklist

// turbo

```bash
npm run check
npm run format:write
```

- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Code is formatted
- [ ] Tested locally
- [ ] No console.log statements
- [ ] Follows naming conventions
