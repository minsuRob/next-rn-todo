# Shared UI Components Setup Guide

This guide explains how to use the `@repo/ui` package across both React Native (mobile) and Next.js (web) applications.

## Architecture Overview

The `@repo/ui` package contains React Native components that work seamlessly on both platforms:

- **Mobile**: Uses React Native directly
- **Web**: Uses `react-native-web` to render React Native components as HTML/CSS

## Current Setup

### ✅ Completed: Shared UI Package

The `packages/ui` package is now configured with:

- React Native components (Button, Input, Card, etc.)
- Theme system with light/dark modes
- Cross-platform compatibility
- TypeScript support

### ✅ Completed: React Native App

The `apps/native` app is already configured to use React Native components.

**To use the shared UI components in the native app:**

1. Import components from `@repo/ui`:

```tsx
// apps/native/app/(tabs)/index.tsx
import { Button, Card, Stack, useTheme } from '@repo/ui'

export default function HomeScreen() {
  const { theme } = useTheme()

  return (
    <Card>
      <Stack spacing="md">
        <Button title="Click me" onPress={() => alert('Hello!')} />
      </Stack>
    </Card>
  )
}
```

2. Wrap your app with ThemeProvider:

```tsx
// apps/native/app/_layout.tsx
import { ThemeProvider } from '@repo/ui'

export default function RootLayout() {
  return <ThemeProvider>{/* Your existing layout */}</ThemeProvider>
}
```

## Future Setup: Next.js Web App

When you create a Next.js web app, follow these steps:

### 1. Create Next.js App

```bash
cd apps
pnpm create next-app web --typescript --app --tailwind
```

### 2. Install Dependencies

```bash
cd apps/web
pnpm add react-native-web
pnpm add -D @types/react-native
```

### 3. Configure Next.js

Update `apps/web/next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile packages from the monorepo
  transpilePackages: ['@repo/ui', '@repo/types', '@repo/utils'],

  // Configure webpack to alias react-native to react-native-web
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }

    // Handle React Native file extensions
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]

    return config
  },
}

module.exports = nextConfig
```

### 4. Update package.json

Add the UI package as a dependency in `apps/web/package.json`:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native-web": "^0.21.0"
  }
}
```

### 5. Setup Theme Provider

Wrap your app with the ThemeProvider in `apps/web/app/layout.tsx`:

```tsx
import { ThemeProvider } from '@repo/ui'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

### 6. Use Components

Now you can use the same components in your Next.js app:

```tsx
// apps/web/app/page.tsx
'use client'

import { Button, Card, Stack, Input } from '@repo/ui'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <main style={{ padding: 20 }}>
      <Card>
        <Stack spacing="md">
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <Button
            title="Submit"
            onPress={() => console.log('Submitted:', email)}
            variant="primary"
          />
        </Stack>
      </Card>
    </main>
  )
}
```

## Key Concepts

### 1. Write Once, Run Everywhere

Components are written using React Native primitives:

```tsx
import { View, Text, Pressable } from 'react-native'

// This works on both web and mobile!
function MyComponent() {
  return (
    <View>
      <Text>Hello World</Text>
      <Pressable onPress={() => alert('Clicked!')}>
        <Text>Click me</Text>
      </Pressable>
    </View>
  )
}
```

### 2. Platform-Specific Code (When Needed)

Use Platform API for platform-specific logic:

```tsx
import { Platform } from 'react-native'

const styles = {
  container: {
    padding: Platform.select({
      web: 20,
      native: 16,
    }),
  },
}
```

### 3. Responsive Design

Use `useWindowDimensions` for responsive layouts:

```tsx
import { useWindowDimensions } from 'react-native'

function ResponsiveComponent() {
  const { width } = useWindowDimensions()
  const isMobile = width < 768

  return <View style={{ flexDirection: isMobile ? 'column' : 'row' }}>{/* Content */}</View>
}
```

### 4. Styling

Use StyleSheet or inline styles (both work):

```tsx
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

// Or inline
<View style={{ flex: 1, backgroundColor: '#fff' }} />
```

## Component Mapping

React Native components map to web elements via react-native-web:

| React Native   | Web (HTML)                  |
| -------------- | --------------------------- |
| `<View>`       | `<div>`                     |
| `<Text>`       | `<span>`                    |
| `<Pressable>`  | `<div>` with click handlers |
| `<TextInput>`  | `<input>`                   |
| `<ScrollView>` | `<div>` with overflow       |
| `<Image>`      | `<img>`                     |

## Best Practices

### ✅ Do's

1. **Use theme values**: Always use `theme.colors`, `theme.spacing`, etc.
2. **Test on both platforms**: Ensure components work on web and mobile
3. **Use flexbox**: It works consistently across platforms
4. **Keep components simple**: Focus on reusability
5. **Use TypeScript**: For type safety and better DX

### ❌ Don'ts

1. **Don't use web-only APIs**: Like `document`, `window` (use Platform checks)
2. **Don't use CSS classes**: Use StyleSheet or inline styles
3. **Don't use HTML elements**: Use React Native primitives
4. **Don't hardcode dimensions**: Use responsive values
5. **Don't mix styling approaches**: Stick to React Native styles

## Troubleshooting

### Issue: Module not found 'react-native'

**Solution**: Make sure `react-native-web` is installed and aliased in webpack config.

### Issue: Styles not applying on web

**Solution**: Check that you're using React Native style objects, not CSS strings.

### Issue: Component looks different on web vs mobile

**Solution**: Test on both platforms and use Platform-specific code if needed.

### Issue: TypeScript errors

**Solution**: Install `@types/react-native` and ensure tsconfig includes the right types.

## Example: Complete Component

Here's a complete example showing best practices:

```tsx
import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '@repo/ui'

interface TaskCardProps {
  title: string
  completed: boolean
  onToggle: () => void
}

export function TaskCard({ title, completed, onToggle }: TaskCardProps) {
  const { theme } = useTheme()

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: completed ? theme.colors.primary : theme.colors.border,
            backgroundColor: completed ? theme.colors.primary : 'transparent',
          },
        ]}
      />
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            textDecorationLine: completed ? 'line-through' : 'none',
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
})
```

## Resources

- [React Native Web Docs](https://necolas.github.io/react-native-web/)
- [React Native Docs](https://reactnative.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)

## Summary

With this setup, you can:

✅ Write components once in React Native  
✅ Use them in both mobile (Expo) and web (Next.js)  
✅ Share theme, styles, and logic  
✅ Maintain a single codebase  
✅ Get native performance on mobile  
✅ Get SEO-friendly web pages

The key is using React Native primitives and react-native-web to bridge the gap between platforms!
