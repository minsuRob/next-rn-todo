/**
 * Theme typography module and fonts mapping for the native app.
 *
 * - Exposes `customFontsToLoad` for Expo `useFonts` to preload fonts.
 * - Provides a normalized `typography` object describing primary/secondary/code font stacks.
 * - Includes a tiny helper `getFontFamily` to pick a font by semantic family and weight.
 *
 * Note:
 * - You need to install the matching font packages to use the Google fonts:
 *   - @expo-google-fonts/space-grotesk
 *   - expo-font (already included in Expo SDK projects)
 */

import { Platform } from 'react-native'
import {
  SpaceGrotesk_300Light as spaceGroteskLight,
  SpaceGrotesk_400Regular as spaceGroteskRegular,
  SpaceGrotesk_500Medium as spaceGroteskMedium,
  SpaceGrotesk_600SemiBold as spaceGroteskSemiBold,
  SpaceGrotesk_700Bold as spaceGroteskBold,
} from '@expo-google-fonts/space-grotesk'

/**
 * Exported mapping for Expo `useFonts`.
 * Usage:
 *   const [fontsLoaded] = useFonts(customFontsToLoad)
 */
export const customFontsToLoad = {
  spaceGroteskLight,
  spaceGroteskRegular,
  spaceGroteskMedium,
  spaceGroteskSemiBold,
  spaceGroteskBold,
}

/**
 * Canonical font families per platform.
 * - `spaceGrotesk*` keys map to the `customFontsToLoad` keys above.
 * - Native system fonts are referenced by their platform-specific PostScript names.
 */
const fonts = {
  spaceGrotesk: {
    light: 'spaceGroteskLight',
    normal: 'spaceGroteskRegular',
    medium: 'spaceGroteskMedium',
    semiBold: 'spaceGroteskSemiBold',
    bold: 'spaceGroteskBold',
  },
  // iOS-only system families
  helveticaNeue: {
    thin: 'HelveticaNeue-Thin',
    light: 'HelveticaNeue-Light',
    normal: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
  },
  courier: {
    normal: 'Courier',
  },
  // Android-only system families
  sansSerif: {
    thin: 'sans-serif-thin',
    light: 'sans-serif-light',
    normal: 'sans-serif',
    medium: 'sans-serif-medium',
  },
  monospace: {
    normal: 'monospace',
  },
} as const

/**
 * Public typography contract used across the app.
 * - `primary`: main UI font
 * - `secondary`: headings / alternates
 * - `code`: monospace fallback for code-like text
 */
export const typography = {
  fonts,
  primary: fonts.spaceGrotesk,
  secondary: Platform.select({
    ios: fonts.helveticaNeue,
    android: fonts.sansSerif,
    default: fonts.spaceGrotesk,
  }),
  code: Platform.select({
    ios: fonts.courier,
    android: fonts.monospace,
    default: fonts.spaceGrotesk,
  }),
} as const

export type PrimaryWeight = keyof typeof fonts.spaceGrotesk
export type SecondaryWeightIos = keyof typeof fonts.helveticaNeue
export type SecondaryWeightAndroid = keyof typeof fonts.sansSerif
export type CodeWeightIos = keyof typeof fonts.courier
export type CodeWeightAndroid = keyof typeof fonts.monospace

/**
 * Helper to get the correct fontFamily string for a given semantic family & weight.
 *
 * Example:
 *   const fontFamily = getFontFamily('semiBold', 'primary')
 *   <Text style={{ fontFamily }}>Hello</Text>
 */
export function getFontFamily(
  weight: 'light' | 'normal' | 'medium' | 'semiBold' | 'bold' = 'normal',
  family: 'primary' | 'secondary' | 'code' = 'primary'
): string {
  if (family === 'primary') {
    return typography.primary[weight]
  }

  if (family === 'secondary') {
    if (Platform.OS === 'ios') {
      const iosWeight = (['thin', 'light', 'normal', 'medium'] as const).includes(
        weight as any
      )
        ? (weight as SecondaryWeightIos)
        : ('normal' as SecondaryWeightIos)
      // map generic to closest available
      const map: Record<typeof weight, SecondaryWeightIos> = {
        light: 'light',
        normal: 'normal',
        medium: 'medium',
        semiBold: 'medium',
        bold: 'medium',
      }
      return typography.secondary![map[weight] ?? iosWeight]
    } else {
      const androidWeight = (['thin', 'light', 'normal', 'medium'] as const).includes(
        weight as any
      )
        ? (weight as SecondaryWeightAndroid)
        : ('normal' as SecondaryWeightAndroid)
      const map: Record<typeof weight, SecondaryWeightAndroid> = {
        light: 'light',
        normal: 'normal',
        medium: 'medium',
        semiBold: 'medium',
        bold: 'medium',
      }
      return typography.secondary![map[weight] ?? androidWeight]
    }
  }

  // code family
  if (Platform.OS === 'ios') {
    const map: Record<typeof weight, CodeWeightIos> = {
      light: 'normal',
      normal: 'normal',
      medium: 'normal',
      semiBold: 'normal',
      bold: 'normal',
    }
    return typography.code![map[weight]]
  } else {
    const map: Record<typeof weight, CodeWeightAndroid> = {
      light: 'normal',
      normal: 'normal',
      medium: 'normal',
      semiBold: 'normal',
      bold: 'normal',
    }
    return typography.code![map[weight]]
  }
}
