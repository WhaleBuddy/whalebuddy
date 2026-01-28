# Naming Conventions

## Files and Directories

- Use `kebab-case` for all files and folders
- Examples: `user-profile/`, `task-card.tsx`, `api-client.ts`

## Code

- Variables/Functions: `camelCase` → `userName`, `getUserById`
- Components: `PascalCase` → `UserCard`, `TaskList`
- Global Constants: `UPPER_SNAKE_CASE` → `MAX_RETRY_COUNT`
- Types/Interfaces: `PascalCase` → `User`, `TaskProps`

## Database

- Tables are auto-prefixed with `whalebuddy_` by `createTable`
- Use singular names: `post`, `user`, `task` (not `posts`)
