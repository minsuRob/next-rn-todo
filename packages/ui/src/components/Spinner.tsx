import React from 'react'
import { View, ActivityIndicator, Text, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface SpinnerProps {
  size?: 'small' | 'large'
  color?: string
  text?: string
  fullScreen?: boolean
  style?: ViewStyle
}

export const Spinner = ({
  size = 'large',
  color,
  text,
  fullScreen = false,
  style,
}: SpinnerProps) => {
  const { theme } = useTheme()

  const containerStyles: ViewStyle = fullScreen
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
      }
    : {
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
      }

  const textStyles: TextStyle = {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: color || theme.colors.text,
  }

  return (
    <View style={[containerStyles, style]}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
      {text && <Text style={textStyles}>{text}</Text>}
    </View>
  )
}
