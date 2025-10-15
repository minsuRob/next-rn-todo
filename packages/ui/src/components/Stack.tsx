import React from 'react'
import { View, ViewStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface StackProps {
  children: React.ReactNode
  direction?: 'row' | 'column'
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  wrap?: boolean
  style?: ViewStyle
}

export const Stack = ({
  children,
  direction = 'column',
  spacing = 'md',
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  style,
}: StackProps) => {
  const { theme } = useTheme()

  const gap = theme.spacing[spacing]

  const stackStyles: ViewStyle = {
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap,
    ...(wrap && { flexWrap: 'wrap' }),
  }

  return <View style={[stackStyles, style]}>{children}</View>
}
