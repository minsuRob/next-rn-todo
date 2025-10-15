import { ViewStyle } from "react-native"

/**
 * Shared styles used across the app.
 * If/when a theme spacing module is added, replace the fallbackSpacing values with the theme import.
 */

// Fallback spacing values to avoid external dependencies.
// Replace with: `import { spacing } from "./spacing"` once available.
const fallbackSpacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

export const $styles = {
  row: { flexDirection: "row" } as ViewStyle,
  flex1: { flex: 1 } as ViewStyle,
  flexWrap: { flexWrap: "wrap" } as ViewStyle,

  // Common container padding used throughout the app
  container: {
    paddingTop: fallbackSpacing.lg + fallbackSpacing.xl, // 24 + 32 = 56
    paddingHorizontal: fallbackSpacing.lg, // 24
  } as ViewStyle,

  // Full-size center content wrapper (e.g., toggles, loaders)
  toggleInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  } as ViewStyle,
}
