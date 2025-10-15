# @repo/ui

Shared UI component library built with React Native that works seamlessly across web (via react-native-web) and mobile platforms.

## Features

- 🎨 **Cross-platform**: Works on web (Next.js) and mobile (React Native/Expo)
- 🌗 **Theme support**: Built-in light and dark themes
- ♿ **Accessible**: ARIA labels and semantic components
- 📱 **Responsive**: Adapts to different screen sizes
- 🎭 **Customizable**: Easy to style and extend

## Installation

This package is part of the monorepo and is automatically available to other workspace packages.

```bash
pnpm install
```

## Usage

### Setup Theme Provider

Wrap your app with the `ThemeProvider`:

```tsx
import { ThemeProvider } from '@repo/ui'

function App() {
  return <ThemeProvider>{/* Your app content */}</ThemeProvider>
}
```

### Using Components

```tsx
import { Button, Input, Card, Stack } from '@repo/ui'

function MyComponent() {
  return (
    <Card>
      <Stack spacing="md">
        <Input label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} />
        <Button title="Submit" onPress={handleSubmit} variant="primary" />
      </Stack>
    </Card>
  )
}
```

### Using Theme

```tsx
import { useTheme } from '@repo/ui'

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Current theme: {isDark ? 'Dark' : 'Light'}</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  )
}
```

## Components

### Input Components

- `Button` - Pressable button with variants
- `Input` - Text input with validation
- `Select` - Dropdown selector
- `Checkbox` - Checkbox input
- `Switch` - Toggle switch

### Layout Components

- `Container` - Responsive container with max-width
- `Stack` - Flex layout with spacing
- `Grid` - Grid layout with responsive columns
- `Spacer` - Spacing utility

### Feedback Components

- `Toast` - Toast notifications
- `Spinner` - Loading indicator
- `Skeleton` - Skeleton loader
- `EmptyState` - Empty state placeholder

### Display Components

- `Card` - Card container
- `Avatar` - User avatar
- `Badge` - Count badge
- `ProgressBar` - Progress indicator

### Modal Components

- `Modal` - Modal dialog
- `BottomSheet` - Bottom sheet (mobile-optimized)
- `ConfirmDialog` - Confirmation dialog

## Web Setup (Next.js)

To use these components in Next.js, configure `next.config.js`:

```js
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    return config
  },
}

module.exports = nextConfig
```

## Mobile Setup (React Native/Expo)

The components work out of the box with React Native and Expo. Just import and use them.

## Theming

The package includes a comprehensive theming system:

- Colors (primary, secondary, text, background, etc.)
- Spacing (xs, sm, md, lg, xl, xxl)
- Typography (font sizes, weights, line heights)
- Border radius
- Shadows

You can customize the theme by modifying `src/theme/index.ts`.

## Best Practices

1. **Always use theme values**: Access colors, spacing, etc. from the theme object
2. **Use StyleSheet or inline styles**: Both work with React Native
3. **Test on both platforms**: Ensure components work on web and mobile
4. **Keep components simple**: Focus on reusability and composition
5. **Use semantic HTML on web**: React Native Web handles this automatically

## Contributing

When adding new components:

1. Create the component in `src/components/`
2. Export it from `src/index.ts`
3. Use TypeScript for type safety
4. Follow the existing component patterns
5. Test on both web and mobile platforms
