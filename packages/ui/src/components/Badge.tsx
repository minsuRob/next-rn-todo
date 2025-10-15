import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface BadgeProps {
  count?: number
  text?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  dot?: boolean
  style?: ViewStyle
}

export const Badge = ({
  count,
  text,
  variant = 'primary',
  size = 'md',
  dot = false,
  style,
}: BadgeProps) => {
  const { theme } = useTheme()

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary
      case 'secondary':
        return theme.colors.secondary
      case 'success':
        return theme.colors.success
      case 'warning':
        return theme.colors.warning
      case 'error':
        return theme.colors.error
      case 'info':
        return theme.colors.info
      default:
        return theme.colors.primary
    }
  }

  const getSize = () => {
    if (dot) return 8
    return size === 'sm' ? 18 : 22
  }

  const badgeSize = getSize()

  const containerStyles: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: badgeSize / 2,
    minWidth: dot ? badgeSize : badgeSize,
    height: badgeSize,
    paddingHorizontal: dot ? 0 : theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  }

  const textStyles: TextStyle = {
    color: '#FFFFFF',
    fontSize: size === 'sm' ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  }

  if (dot) {
    return <View style={[containerStyles, style]} />
  }

  const displayText = text || (count !== undefined ? (count > 99 ? '99+' : count.toString()) : '')

  return (
    <View style={[containerStyles, style]}>
      <Text style={textStyles}>{displayText}</Text>
    </View>
  )
}
