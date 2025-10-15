import React from 'react'
import { Pressable, View, Text, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  containerStyle?: ViewStyle
}

export const Checkbox = ({
  checked,
  onChange,
  label,
  disabled = false,
  containerStyle,
}: CheckboxProps) => {
  const { theme } = useTheme()

  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  }

  const checkboxStyles: ViewStyle = {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: checked ? theme.colors.primary : theme.colors.border,
    backgroundColor: checked ? theme.colors.primary : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const labelStyles: TextStyle = {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  }

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      style={({ pressed }) => [
        containerStyles,
        pressed && !disabled && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
        containerStyle,
      ]}
      disabled={disabled}
    >
      <View style={checkboxStyles}>
        {checked && (
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
            }}
          />
        )}
      </View>
      {label && <Text style={labelStyles}>{label}</Text>}
    </Pressable>
  )
}
