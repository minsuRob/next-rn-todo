# Gamified TODO App - Monorepo

A cross-platform gamified TODO list application built with Next.js (web) and React Native (mobile), powered by Supabase.

## 🏗️ Monorepo Structure

This is a Turborepo monorepo containing:

### Apps

- `apps/web` - Next.js web application
- `apps/native` - React Native mobile application (Expo)

### Packages

- `packages/ui` - Shared React Native components (works on web via React Native Web)
- `packages/types` - Shared TypeScript types and Zod schemas
- `packages/utils` - Shared utility functions
- `packages/hooks` - Shared React hooks
- `packages/api` - Type-safe API client for Supabase
- `packages/eslint-config` - Shared ESLint configurations
- `packages/typescript-config` - Shared TypeScript configurations

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 10.8.2

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run specific app
npm run dev --filter=web
npm run dev --filter=native

# Build all packages and apps
npm run build

# Lint all packages and apps
npm run lint

# Run tests
npm run test

# Type check
npm run check-types

# Format code
npm run format
```

## 📦 Package Management

This monorepo uses npm workspaces. To add a dependency:

```bash
# Add to root (dev dependency)
npm install -D <package> -w root

# Add to specific workspace
npm install <package> -w @repo/ui
npm install <package> -w web
```

## 🔧 Configuration

### TypeScript

- `@repo/typescript-config/base.json` - Base TypeScript config
- `@repo/typescript-config/nextjs.json` - Next.js specific config
- `@repo/typescript-config/react-native.json` - React Native specific config
- `@repo/typescript-config/react-library.json` - React library config

### ESLint

- `@repo/eslint-config/base` - Base ESLint config
- `@repo/eslint-config/next-js` - Next.js specific config
- `@repo/eslint-config/react-native` - React Native specific config
- `@repo/eslint-config/react-internal` - React library config

### Path Aliases

All packages support the following path aliases:

- `@/*` - Source directory
- `@repo/ui` - UI components package
- `@repo/types` - Types package
- `@repo/utils` - Utils package
- `@repo/hooks` - Hooks package
- `@repo/api` - API client package

## 🏃 Turborepo Tasks

- `build` - Build all apps and packages
- `dev` - Run all apps in development mode
- `lint` - Lint all packages and apps
- `test` - Run tests for all packages and apps
- `check-types` - Type check all packages and apps
- `clean` - Clean all build artifacts and node_modules

## 📝 Code Style

This project uses:

- **Prettier** for code formatting
- **ESLint** for code linting
- **TypeScript** for type safety

Format your code before committing:

```bash
npm run format
```

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Run `npm run lint` and `npm run check-types`
4. Format your code with `npm run format`
5. Commit your changes
6. Create a pull request

## 📚 Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turborepo.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
