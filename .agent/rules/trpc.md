# tRPC Patterns

## Procedures

- `publicProcedure` - Only for truly public data
- `protectedProcedure` - For any user-specific data

## Input Validation

Always validate inputs with Zod:

```typescript
.input(z.object({
  name: z.string().min(1).max(256),
}))
```

## After Mutations

Invalidate related queries:

```typescript
const mutation = api.router.create.useMutation({
  onSuccess: () => utils.router.getAll.invalidate(),
});
```

## Register New Routers

Add to `src/server/api/root.ts`:

```typescript
export const appRouter = createTRPCRouter({
  newRouter: newRouter,
});
```
