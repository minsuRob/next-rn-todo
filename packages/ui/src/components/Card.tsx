import React from 'react'
import { View, Pressable, ViewStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface CardProps {
  children: React.ReactNode
  onPress?: () => void
  variant?: 'elevated' | 'outlined' | 'filled'
  padding?: boolean
  style?: ViewStyle
}

export const Card = ({
  children,
  onPress,
  variant = 'elevated',
  padding = true,
  style,
}: CardProps) => {
  const { theme } = useTheme()

  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      ...(padding && { padding: theme.spacing.md }),
    }

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        }
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.surfaceSecondary,
        }
      default:
        return baseStyles
    }
  }

  const cardStyles = getCardStyles()

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyles, pressed && { opacity: 0.8 }, style]}
      >
        {children}
      </Pressable>
    )
  }

  return <View style={[cardStyles, style]}>{children}</View>
}
