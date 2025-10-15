import React, { useState } from 'react'
import { View, Text, Pressable, Modal, FlatList, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  label?: string
  value?: string
  options: SelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  containerStyle?: ViewStyle
  disabled?: boolean
}

export const Select = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  error,
  containerStyle,
  disabled = false,
}: SelectProps) => {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value)

  const containerStyles: ViewStyle = {
    marginBottom: theme.spacing.md,
  }

  const labelStyles: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  }

  const selectButtonStyles: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  }

  const selectTextStyles: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: selectedOption ? theme.colors.text : theme.colors.textTertiary,
  }

  const modalOverlayStyles: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const modalContentStyles: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    width: '80%',
    maxHeight: '60%',
    ...theme.shadows.lg,
  }

  const optionStyles: ViewStyle = {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  }

  const optionTextStyles: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <View style={[containerStyles, containerStyle]}>
      {label && <Text style={labelStyles}>{label}</Text>}

      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        style={({ pressed }) => [
          selectButtonStyles,
          pressed && !disabled && { opacity: 0.8 },
          disabled && { opacity: 0.5 },
        ]}
        disabled={disabled}
      >
        <Text style={selectTextStyles}>{selectedOption?.label || placeholder}</Text>
      </Pressable>

      {error && (
        <Text
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
          }}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={modalOverlayStyles} onPress={() => setIsOpen(false)}>
          <View style={modalContentStyles}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  style={({ pressed }) => [
                    optionStyles,
                    pressed && { backgroundColor: theme.colors.surfaceSecondary },
                    item.value === value && {
                      backgroundColor: theme.colors.primaryLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      optionTextStyles,
                      item.value === value && {
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.primary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}
