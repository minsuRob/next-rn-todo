# Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
# Run all apps
npm run dev

# Run specific app
npm run dev --filter=web
npm run dev --filter=native
```

## Common Commands

```bash
# Build everything
npm run build

# Lint code
npm run lint

# Type check
npm run check-types

# Run tests
npm run test

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## Project Structure

```
gamified-todo-monorepo/
├── apps/
│   ├── web/              # Next.js web app
│   └── native/           # React Native mobile app
├── packages/
│   ├── ui/               # Shared components
│   ├── types/            # Types & schemas
│   ├── utils/            # Utilities
│   ├── hooks/            # React hooks
│   ├── api/              # API client
│   ├── eslint-config/    # ESLint configs
│   └── typescript-config/ # TypeScript configs
└── supabase/             # Backend config
```

## Path Aliases

Use these in your imports:

```typescript
import { Button } from '@repo/ui'
import { Task } from '@repo/types'
import { calculateXP } from '@repo/utils'
import { useTasks } from '@repo/hooks'
import { api } from '@repo/api'
```

## Documentation

- [README.md](./README.md) - Project overview
- [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Infrastructure details
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guide

## Need Help?

Check the documentation or create an issue on GitHub.
