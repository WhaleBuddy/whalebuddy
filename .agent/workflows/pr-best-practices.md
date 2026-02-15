---
description: PR and Development Best Practices
---

# 🎯 Pull Request & Development Best Practices

## 1. One PR Per Feature ⭐

### ❌ DON'T: Create Multiple PRs for the Same Feature

Instead of creating separate PRs like:

- feat(WB-21): add Discord channel registration endpoint #7
- feat(discord): add channel registration endpoint with validations #8
- Wb 20/list available channels on discord #9
- test(WB-19): add automated acceptance criteria validation #10

### ✅ DO: Use a Single PR with Progressive Commits

Create ONE comprehensive PR (e.g., #8) and:

1. **Create the initial PR** with the base feature
2. **Push fixes as new commits** to the same PR
3. **Add new features as commits** to the same PR
4. **Add tests as commits** to the same PR

**Benefits:**

- Easier code review (reviewers see the whole feature in context)
- Cleaner git history
- Fewer merge conflicts
- Better tracking of related changes

### Example Workflow

```bash
# Create feature branch
git checkout -b feat/discord-integration

# Initial implementation
git add .
git commit -m "feat(discord): add channel registration endpoint"
git push -u origin feat/discord-integration

# Create PR at this point

# Add improvements based on feedback
git add .
git commit -m "refactor(discord): extract API URL constant"
git push

# Add related features
git add .
git commit -m "feat(discord): add channel listing"
git push

# Add tests
git add .
git commit -m "test(discord): add integration tests"
git push
```

## 2. Foreign Key Best Practices 🔗

### Always Use `onDelete: "cascade"` for Dependent Data

```typescript
// ✅ CORRECT - Prevents orphaned records
userId: d
  .varchar({ length: 255 })
  .notNull()
  .references(() => users.id, { onDelete: "cascade" })
  .unique(),

// ❌ INCORRECT - Creates orphaned records when user is deleted
userId: d
  .varchar({ length: 255 })
  .notNull()
  .references(() => users.id),
```

**Why this matters:**

- When a user is deleted, their Discord integration is automatically removed
- Prevents orphaned records in the database
- Maintains data integrity
- Reduces database bloat

### Other Foreign Key Options

```typescript
// For required relationships that should prevent deletion
parentId: d.varchar({ length: 255 }).references(() => parent.id, {
  onDelete: "restrict",
});

// For optional relationships that should be nullified
optionalId: d.varchar({ length: 255 }).references(() => optional.id, {
  onDelete: "set null",
});
```

## 3. Test Naming Best Practices 🧪

### Make Sure Test Table Names Match Your Actual Schema

```typescript
// ❌ INCORRECT - Table name doesn't match schema
describe('Discord Integration Schema', () => {
  it('should allow inserting a Discord integration', async () => {
    // Using wrong table name
    await db.insert(discordConfigs).values({...});
  });
});

// ✅ CORRECT - Table name matches schema
describe('Discord Integration Schema', () => {
  it('should allow inserting a Discord integration', async () => {
    // Using correct table name from schema.ts
    await db.insert(discordIntegrations).values({...});
  });
});
```

**Schema Reference:**
Always check your `src/server/db/schema.ts` for the correct table names:

```typescript
export const discordIntegrations = createTable("discord_integration", ...);
//            ^^^^^^^^^^^^^^^^^^^ Use this name in tests
```

## 4. Additional Best Practices

### Conventional Commits

Use the conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks

### Code Review Ready Checklist

Before marking PR as ready for review:

- [ ] All TypeScript errors resolved (in your code)
- [ ] All ESLint errors resolved
- [ ] Tests added and passing
- [ ] Database migrations tested with `npm run db:push`
- [ ] Migration instructions in PR description
- [ ] Meaningful commit messages

### Database Changes Checklist

When modifying database schema:

- [ ] Add appropriate foreign key constraints
- [ ] Add `onDelete` behavior for all foreign keys
- [ ] Add unique constraints where needed
- [ ] Add indexes for frequently queried fields
- [ ] Test migration locally
- [ ] Document migration steps in PR

## 📚 Quick Reference

| Scenario            | Best Practice                      |
| ------------------- | ---------------------------------- |
| Related features    | One PR with multiple commits       |
| User-dependent data | Use `onDelete: "cascade"`          |
| Test table names    | Match schema exports exactly       |
| Commit messages     | Use conventional commits           |
| Foreign keys        | Always specify `onDelete` behavior |

---

**Remember:** These practices help maintain code quality, make reviews easier, and keep the codebase clean and maintainable! 🚀
