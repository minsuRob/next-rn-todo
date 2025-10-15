import React from 'react'
import { View, ViewStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  horizontal?: boolean
}

export const Spacer = ({ size = 'md', horizontal = false }: SpacerProps) => {
  const { theme } = useTheme()

  const spacerStyles: ViewStyle = horizontal
    ? { width: theme.spacing[size] }
    : { height: theme.spacing[size] }

  return <View style={spacerStyles} />
}
