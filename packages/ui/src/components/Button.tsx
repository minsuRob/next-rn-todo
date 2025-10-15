import React from 'react'
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) => {
  const { theme } = useTheme()

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceSecondary

    switch (variant) {
      case 'primary':
        return theme.colors.primary
      case 'secondary':
        return theme.colors.secondary
      case 'danger':
        return theme.colors.error
      case 'outline':
      case 'ghost':
        return 'transparent'
      default:
        return theme.colors.primary
    }
  }

  const getTextColor = () => {
    if (disabled) return theme.colors.textTertiary

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF'
      case 'outline':
      case 'ghost':
        return theme.colors.primary
      default:
        return '#FFFFFF'
    }
  }

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md }
      case 'lg':
        return { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl }
      case 'md':
      default:
        return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg }
    }
  }

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return theme.typography.fontSize.sm
      case 'lg':
        return theme.typography.fontSize.lg
      case 'md':
      default:
        return theme.typography.fontSize.md
    }
  }

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: theme.borderRadius.md,
    ...getPadding(),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...(variant === 'outline' && {
      borderWidth: 1,
      borderColor: disabled ? theme.colors.border : theme.colors.primary,
    }),
    ...(fullWidth && { width: '100%' }),
  }

  const textStyleObj: TextStyle = {
    color: getTextColor(),
    fontSize: getFontSize(),
    fontWeight: theme.typography.fontWeight.semibold,
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [buttonStyle, pressed && !disabled && { opacity: 0.8 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[textStyleObj, textStyle]}>{title}</Text>
      )}
    </Pressable>
  )
}
