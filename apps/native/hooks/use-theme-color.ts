/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useAppTheme } from '@/lib/theme/context'

type LightColors = typeof import('@/lib/theme/colors').colors
type DarkColors = typeof import('@/lib/theme/colorsDark').colors
type ColorName = keyof LightColors & keyof DarkColors

export function useThemeColor(props: { light?: string; dark?: string }, colorName: ColorName) {
  const { theme, themeContext } = useAppTheme()
  const colorFromProps = themeContext === 'dark' ? props.dark : props.light

  if (colorFromProps) {
    return colorFromProps
  } else {
    return theme.colors[colorName] as string
  }
}
