import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react'
import { useColorScheme } from 'react-native'
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  Theme as NavTheme,
} from '@react-navigation/native'
import { setImperativeTheming } from '@/lib/theme/context.utils'

import { lightTheme, darkTheme } from '@/lib/theme/theme'
import type { ThemedFnT, AllowedStylesT as AllowedStyles, ThemedStyle } from '@/lib/theme/types'

type ImmutableThemeContextMode = 'light' | 'dark'
type ThemeContextMode = ImmutableThemeContextMode | undefined

type ColorsType = typeof Colors.light | typeof Colors.dark

export interface Theme {
  colors: ColorsType
  isDark: boolean
}

type ThemedStyle<T> = (theme: Theme) => T
type AllowedStyles<T> = T | ThemedStyle<T> | Array<T | ThemedStyle<T>>

export type ThemeContextValue = {
  navigationTheme: NavTheme
  theme: Theme
  themeContext: ImmutableThemeContextMode
  setThemeContextOverride: (next: ThemeContextMode) => void
  themed: ThemedFnT
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps {
  initialContext?: ThemeContextMode
}

export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  initialContext,
}) => {
  // System color scheme from OS settings
  const systemScheme = useColorScheme() // 'light' | 'dark' | null
  // In-app override (persisting to storage is optional and not included here)
  const [overrideScheme, setOverrideScheme] = useState<ThemeContextMode>(undefined)

  // Resolve final theme context in priority order: initial prop -> override -> system -> light
  const themeContext: ImmutableThemeContextMode = useMemo(() => {
    const resolved =
      initialContext ??
      overrideScheme ??
      (systemScheme === 'dark' || systemScheme === 'light' ? systemScheme : 'light')
    return resolved === 'dark' ? 'dark' : 'light'
  }, [initialContext, overrideScheme, systemScheme])

  const theme: Theme = useMemo(
    () => (themeContext === 'dark' ? darkTheme : lightTheme),
    [themeContext]
  )

  const navigationTheme: NavTheme = useMemo(() => {
    const base = themeContext === 'dark' ? NavDarkTheme : NavDefaultTheme
    // Optionally align some nav colors with our app Colors
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.colors.background,
        text: theme.colors.text,
        primary: theme.colors.tint,
        card: theme.colors.background,
        border: base.colors.border, // keep default unless you want to map to Colors
        notification: base.colors.notification,
      },
    }
  }, [theme, themeContext])

  // Update native system UI background to match theme background (requires expo-system-ui)
  useEffect(() => {
    setImperativeTheming(theme)
  }, [theme])

  const setThemeContextOverride = useCallback((next: ThemeContextMode) => {
    setOverrideScheme(next)
    // If you want persistence, plug in AsyncStorage or SecureStore here.
  }, [])

  const themed = useCallback(
    <T,>(styleOrStyleFn: AllowedStyles<T>) => {
      const arr = Array.isArray(styleOrStyleFn) ? styleOrStyleFn : [styleOrStyleFn]
      const resolved = arr.map((s) => (typeof s === 'function' ? (s as ThemedStyle<T>)(theme) : s))
      // Merge plain objects into a single style object; arrays can be returned as-is if preferred
      return Object.assign({}, ...resolved) as T
    },
    [theme]
  )

  const value: ThemeContextValue = useMemo(
    () => ({
      navigationTheme,
      theme,
      themeContext,
      setThemeContextOverride,
      themed,
    }),
    [navigationTheme, theme, themeContext, setThemeContextOverride, themed]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useAppTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useAppTheme must be used within a ThemeProvider')
  }
  return ctx
}

export default ThemeProvider
