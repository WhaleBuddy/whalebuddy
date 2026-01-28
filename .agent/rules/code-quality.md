# Code Quality

## Must Do

- Run `npm run check` before every commit
- Run `npm run format:write` to format code
- Handle loading and error states in components
- Use TypeScript interfaces for all props
- Validate all tRPC inputs with Zod schemas

## Never Do

- Commit with TypeScript or ESLint errors
- Use `any` type (use `unknown` with type guards)
- Leave `console.log` in production code
- Leave commented-out code
- Create files without using them
- Hardcode secrets in code
