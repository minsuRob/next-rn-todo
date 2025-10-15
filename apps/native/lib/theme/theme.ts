/**
 * App theme aggregation
 *
 * This module aggregates the light and dark theme objects used across the app.
 * It composes tokens from colors, spacing, typography, and timing into two
 * concrete theme objects that can be consumed by a ThemeProvider or screens/components.
 *
 * Expected companion files (to be added separately):
 * - ./colors.ts
 * - ./colorsDark.ts
 * - ./spacing.ts
 * - ./spacingDark.ts
 * - ./typography.ts
 * - ./timing.ts
 */

// Token imports (these modules should export plain objects with the tokens)
import { colors as colorsLight } from './colors'
import { colors as colorsDark } from './colorsDark'
import { spacing as spacingLight } from './spacing'
import { spacing as spacingDark } from './spacingDark'
import { typography } from './typography'
import { timing } from './timing'

// Minimal local Theme typing (kept local to avoid hard dependency on a separate types file)
export type Theme = {
  colors: Record<string, unknown>
  spacing: Record<string, number>
  typography: Record<string, unknown>
  timing: Record<string, number>
  isDark: boolean
}

/**
 * Light theme
 */
export const lightTheme: Theme = {
  colors: colorsLight,
  spacing: spacingLight,
  typography,
  timing,
  isDark: false,
}

/**
 * Dark theme
 */
export const darkTheme: Theme = {
  colors: colorsDark,
  spacing: spacingDark,
  typography,
  timing,
  isDark: true,
}

export default lightTheme
