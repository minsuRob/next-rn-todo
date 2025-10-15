import React from 'react'
import { View, ViewStyle, useWindowDimensions } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface ContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
  style?: ViewStyle
}

export const Container = ({ children, maxWidth = 'lg', padding = true, style }: ContainerProps) => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()

  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'sm':
        return 640
      case 'md':
        return 768
      case 'lg':
        return 1024
      case 'xl':
        return 1280
      case 'full':
        return '100%'
      default:
        return 1024
    }
  }

  const containerStyles: ViewStyle = {
    width: '100%',
    maxWidth: getMaxWidth(),
    marginHorizontal: 'auto',
    ...(padding && {
      paddingHorizontal: width < 768 ? theme.spacing.md : theme.spacing.lg,
    }),
  }

  return <View style={[containerStyles, style]}>{children}</View>
}
