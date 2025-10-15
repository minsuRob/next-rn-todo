# Contributing Guide

Thank you for contributing to the Gamified TODO App! This guide will help you get started.

## Development Workflow

### 1. Setup

```bash
# Clone the repository
git clone <repository-url>
cd gamified-todo-monorepo

# Install dependencies
npm install

# Verify setup
npm run check-types
npm run lint
```

### 2. Making Changes

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Format your code
npm run format

# Check types
npm run check-types

# Lint your code
npm run lint

# Run tests
npm run test
```

### 3. Commit Guidelines

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:

```bash
git commit -m "feat: add XP calculation utility"
git commit -m "fix: resolve streak reset bug"
```

### 4. Pull Request

1. Push your branch to GitHub
2. Create a Pull Request
3. Ensure CI checks pass
4. Request review from maintainers
5. Address feedback
6. Merge when approved

## Code Standards

### TypeScript

- Use strict mode
- Define types for all function parameters and return values
- Avoid `any` type
- Use Zod schemas for runtime validation

```typescript
// Good
function calculateXP(difficulty: TaskDifficulty): number {
  // ...
}

// Bad
function calculateXP(difficulty: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Define prop types with TypeScript interfaces
- Use meaningful component and prop names
- Keep components small and focused

```typescript
// Good
interface TaskItemProps {
  task: Task
  onComplete: (taskId: string) => void
}

export function TaskItem({ task, onComplete }: TaskItemProps) {
  // ...
}
```

### File Organization

```
component-name/
├── index.tsx           # Component implementation
├── types.ts            # Component-specific types
├── styles.ts           # Styles (if needed)
└── __tests__/          # Tests
    └── index.test.tsx
```

### Naming Conventions

- **Components**: PascalCase (`TaskItem`, `CharacterCard`)
- **Functions**: camelCase (`calculateXP`, `formatDate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_HP`, `XP_MULTIPLIER`)
- **Types/Interfaces**: PascalCase (`Task`, `Character`)
- **Files**: kebab-case (`task-item.tsx`, `xp-calculator.ts`)

## Testing

### Unit Tests

Write unit tests for:

- Utility functions
- Custom hooks
- Complex logic

```typescript
import { describe, it, expect } from 'vitest'
import { calculateXP } from './xp-calculator'

describe('calculateXP', () => {
  it('should calculate XP for easy task', () => {
    expect(calculateXP('easy')).toBe(10)
  })
})
```

### Component Tests

Use Testing Library for component tests:

```typescript
import { render, screen } from '@testing-library/react'
import { TaskItem } from './task-item'

describe('TaskItem', () => {
  it('should render task title', () => {
    render(<TaskItem task={mockTask} onComplete={jest.fn()} />)
    expect(screen.getByText('My Task')).toBeInTheDocument()
  })
})
```

## Package Development

### Creating a New Package

```bash
# Create package directory
mkdir -p packages/my-package/src

# Create package.json
cat > packages/my-package/package.json << EOF
{
  "name": "@repo/my-package",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "typescript": "5.9.2"
  }
}
EOF

# Create tsconfig.json
cat > packages/my-package/tsconfig.json << EOF
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
EOF

# Create index file
touch packages/my-package/src/index.ts
```

### Using Shared Packages

```typescript
// In your app or package
import { Button } from '@repo/ui'
import { Task } from '@repo/types'
import { calculateXP } from '@repo/utils'
import { useTasks } from '@repo/hooks'
import { api } from '@repo/api'
```

## Debugging

### TypeScript Errors

```bash
# Check types in specific package
npm run check-types --filter=@repo/ui

# Check types in specific app
npm run check-types --filter=web
```

### ESLint Errors

```bash
# Lint specific package
npm run lint --filter=@repo/ui

# Auto-fix issues
npm run lint --filter=@repo/ui -- --fix
```

### Turbo Cache Issues

```bash
# Clear Turbo cache
rm -rf .turbo

# Force rebuild without cache
npm run build -- --force
```

## Performance Tips

1. **Use Turbo Filtering**: Only build/test what you're working on

   ```bash
   npm run dev --filter=web
   ```

2. **Leverage Caching**: Turbo caches task outputs automatically

3. **Parallel Execution**: Turbo runs tasks in parallel when possible

4. **Incremental Builds**: TypeScript uses incremental compilation

## Getting Help

- Check the [README.md](./README.md) for basic setup
- Review [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) for infrastructure details
- Check the [design document](./.kiro/specs/gamified-todo-app/design.md)
- Ask questions in GitHub Issues or Discussions

## Resources

- [Turborepo Documentation](https://turborepo.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)
