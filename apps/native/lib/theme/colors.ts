/**
 * Light theme color palette and semantic color tokens.
 * This module defines the base palette and the semantic colors
 * used throughout the app for the light theme.
 */

const palette = {
  // Neutrals
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  // Primary
  primary100: "#F4E0D9",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#C76542",
  primary600: "#A54F31",

  // Secondary
  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  // Accent
  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  // Feedback
  angry100: "#F2D6CD",
  angry500: "#C03403",

  // Overlays
  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * Base palette for one-off, non-semantic usages.
   * Prefer using the semantic tokens below where possible.
   */
  palette,

  /**
   * See-through helper.
   */
  transparent: "rgba(0, 0, 0, 0)",

  /**
   * Default text color.
   */
  text: palette.neutral800,

  /**
   * Dimmed/secondary text color.
   */
  textDim: palette.neutral600,

  /**
   * Default screen background.
   */
  background: palette.neutral200,

  /**
   * Default border color.
   */
  border: palette.neutral400,

  /**
   * Primary tinting color (brand).
   */
  tint: palette.primary500,

  /**
   * Inactive tinting color.
   */
  tintInactive: palette.neutral300,

  /**
   * Subtle lines and separators.
   */
  separator: palette.neutral300,

  /**
   * Error text color.
   */
  error: palette.angry500,

  /**
   * Error background color.
   */
  errorBackground: palette.angry100,
} as const

export type LightThemeColors = typeof colors
