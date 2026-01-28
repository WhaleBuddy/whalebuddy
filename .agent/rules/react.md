# React Patterns

## Server vs Client Components

- Default: Server Components (no directive needed)
- Use `"use client"` only when required

## When to use "use client"

- Using React hooks (useState, useEffect, etc.)
- Using event handlers (onClick, onChange)
- Using browser APIs
- Using `api.*.useQuery()` or `api.*.useMutation()`

## Component Structure

- Always define TypeScript interfaces for props
- Handle loading states with spinners
- Handle error states with user-friendly messages
- Use path aliases for imports (`~/`)
