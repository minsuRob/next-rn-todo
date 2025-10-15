import React, { useState } from 'react'
import { View, TextInput, Text, ViewStyle, TextStyle, TextInputProps } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string
  helperText?: string
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...textInputProps
}: InputProps) => {
  const { theme } = useTheme()
  const [isFocused, setIsFocused] = useState(false)

  const containerStyles: ViewStyle = {
    marginBottom: theme.spacing.md,
  }

  const labelStyles: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  }

  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: error
      ? theme.colors.error
      : isFocused
        ? theme.colors.primary
        : theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  }

  const textInputStyles: TextStyle = {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  }

  const helperTextStyles: TextStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: error ? theme.colors.error : theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  }

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && <Text style={labelStyles}>{label}</Text>}

      <View style={inputContainerStyles}>
        {leftIcon && <View style={{ marginRight: theme.spacing.sm }}>{leftIcon}</View>}

        <TextInput
          {...textInputProps}
          style={[textInputStyles, inputStyle]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true)
            textInputProps.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            textInputProps.onBlur?.(e)
          }}
        />

        {rightIcon && <View style={{ marginLeft: theme.spacing.sm }}>{rightIcon}</View>}
      </View>

      {(error || helperText) && <Text style={helperTextStyles}>{error || helperText}</Text>}
    </View>
  )
}
