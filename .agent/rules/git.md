# Git Conventions

## Branch Naming

Format: `WB-XXX/kebab-case-description`
Example: `WB-014/add-telegram-bot`

## Commit Messages

Format: `type(WB-XXX): description in english`
Example: `feat(WB-014): add telegram bot integration`

Types:

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code improvement
- `chore` - Config/dependencies
- `docs` - Documentation

## Rules

- Never push directly to `main`
- Never force push without permission
- Never commit `.env` files
- Always create branches from updated `main`
- Always merge `main` into feature branch before PR
