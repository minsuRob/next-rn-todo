# Monorepo Infrastructure Setup

This document describes the monorepo infrastructure and shared package configuration for the Gamified TODO App.

## Overview

The project uses **Turborepo** to manage a monorepo containing web (Next.js) and mobile (React Native) applications with shared packages.

## Structure

```
gamified-todo-monorepo/
├── apps/
│   ├── web/              # Next.js web application
│   └── native/           # React Native mobile app (Expo)
├── packages/
│   ├── ui/               # Shared React Native components
│   ├── types/            # Shared TypeScript types & Zod schemas
│   ├── utils/            # Shared utility functions
│   ├── hooks/            # Shared React hooks
│   ├── api/              # Type-safe API client
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
└── supabase/             # Supabase backend configuration
```

## Turborepo Configuration

### Pipeline Tasks

The `turbo.json` file defines the following tasks:

- **build**: Builds all packages and apps with dependency ordering
- **dev**: Runs development servers (persistent, no cache)
- **lint**: Lints all code
- **test**: Runs tests with coverage
- **check-types**: Type checks all TypeScript code
- **clean**: Removes build artifacts and node_modules

### Task Dependencies

Tasks use `dependsOn: ["^build"]` to ensure packages are built before dependent apps.

## TypeScript Configuration

### Available Configurations

1. **base.json** - Base configuration for all packages
   - Strict mode enabled
   - ES2022 target
   - Path aliases configured
   - Module resolution: NodeNext

2. **nextjs.json** - Next.js specific configuration
   - Extends base.json
   - JSX: preserve
   - Module resolution: Bundler
   - Next.js plugin enabled

3. **react-native.json** - React Native specific configuration
   - Extends base.json
   - JSX: react-native
   - Module resolution: Bundler
   - Synthetic default imports enabled

4. **react-library.json** - React library configuration
   - Extends base.json
   - JSX: react-jsx

### Path Aliases

All configurations include the following path aliases:

```typescript
{
  "@/*": ["./src/*"],
  "@repo/ui": ["../../packages/ui/src"],
  "@repo/types": ["../../packages/types/src"],
  "@repo/utils": ["../../packages/utils/src"],
  "@repo/hooks": ["../../packages/hooks/src"],
  "@repo/api": ["../../packages/api/src"]
}
```

## ESLint Configuration

### Available Configurations

1. **base** - Base ESLint configuration
   - TypeScript ESLint
   - Prettier integration
   - Turbo plugin for env var checking
   - Only warnings (no errors)

2. **next-js** - Next.js specific configuration
   - Extends base
   - React hooks rules
   - Next.js plugin
   - Core Web Vitals rules

3. **react-native** - React Native specific configuration
   - Extends base
   - React hooks rules
   - Node globals
   - Unused vars warnings

4. **react-internal** - React library configuration
   - Extends base
   - React hooks rules
   - Browser globals

### Usage in Packages

```javascript
// eslint.config.mjs
import { config } from '@repo/eslint-config/base'
export default config
```

## Prettier Configuration

The project uses Prettier for consistent code formatting:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## Package Management

### Workspace Configuration

The monorepo uses npm workspaces defined in the root `package.json`:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

### Adding Dependencies

```bash
# Add to root (dev dependency)
npm install -D <package>

# Add to specific workspace
npm install <package> -w @repo/ui
npm install <package> -w web

# Add to all workspaces
npm install <package> --workspaces
```

## Scripts

### Root Level Scripts

- `npm run build` - Build all packages and apps
- `npm run dev` - Run all apps in development mode
- `npm run lint` - Lint all code
- `npm run test` - Run all tests
- `npm run check-types` - Type check all code
- `npm run format` - Format all code with Prettier
- `npm run format:check` - Check code formatting
- `npm run clean` - Clean all build artifacts

### Filtering

Run tasks for specific packages:

```bash
# Run dev for web app only
npm run dev --filter=web

# Run build for ui package only
npm run build --filter=@repo/ui

# Run lint for all packages (not apps)
npm run lint --filter=./packages/*
```

## Best Practices

### 1. Shared Code

- Place reusable components in `packages/ui`
- Place types and schemas in `packages/types`
- Place utility functions in `packages/utils`
- Place custom hooks in `packages/hooks`

### 2. Type Safety

- Always use TypeScript
- Define Zod schemas for runtime validation
- Use path aliases for clean imports
- Run `npm run check-types` before committing

### 3. Code Quality

- Run `npm run lint` before committing
- Format code with `npm run format`
- Write tests for shared packages
- Use ESLint warnings, not errors

### 4. Performance

- Leverage Turborepo caching
- Build packages before apps
- Use incremental builds
- Enable remote caching for CI/CD

## Next Steps

After setting up the infrastructure:

1. Create shared packages (types, utils, hooks, api, ui)
2. Set up Supabase backend
3. Create Next.js web app
4. Create React Native mobile app
5. Implement features according to the task list

## Troubleshooting

### TypeScript Path Aliases Not Working

Ensure your `tsconfig.json` extends the correct base config:

```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

### ESLint Not Finding Configuration

Make sure you're importing the config correctly:

```javascript
import { config } from '@repo/eslint-config/base'
export default config
```

### Turbo Cache Issues

Clear the cache:

```bash
npx turbo clean
rm -rf .turbo
```

### Workspace Dependencies Not Resolving

Reinstall dependencies:

```bash
npm run clean
npm install
```
