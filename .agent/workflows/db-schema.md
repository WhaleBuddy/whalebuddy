---
description: How to create database tables with Drizzle ORM
---

# Create Database Schema

## 1. Edit Schema File

Edit `src/server/db/schema.ts`.

## 2. Table Template

```typescript
export const tableName = createTable(
  "table_name", // Will become whalebuddy_table_name
  (d) => ({
    // Primary key options:
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    // OR for UUID:
    // id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),

    // Common columns:
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text(),
    isActive: d.boolean().default(true).notNull(),
    count: d.integer().default(0),

    // Foreign key to users:
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),

    // Timestamps:
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    // Indexes:
    index("table_name_user_id_idx").on(t.userId),
    index("table_name_name_idx").on(t.name),
  ],
);
```

## 3. Add Relations (Optional)

```typescript
export const tableNameRelations = relations(tableName, ({ one, many }) => ({
  user: one(users, { fields: [tableName.userId], references: [users.id] }),
  children: many(childTable),
}));
```

// turbo

## 4. Push to Database

```bash
npm run db:push
```

## 5. View in Drizzle Studio

```bash
npm run db:studio
```

Opens at http://localhost:4983

## Column Types Reference

| Type      | Drizzle                             | Notes              |
| --------- | ----------------------------------- | ------------------ |
| String    | `varchar({ length: N })`            | Use for short text |
| Long text | `text()`                            | For descriptions   |
| Integer   | `integer()`                         | Whole numbers      |
| Boolean   | `boolean()`                         | true/false         |
| Timestamp | `timestamp({ withTimezone: true })` | Date/time          |
| JSON      | `jsonb()`                           | JSON data          |
