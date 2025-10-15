import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'
import { Button } from './Button'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  style?: ViewStyle
}

export const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) => {
  const { theme } = useTheme()

  const containerStyles: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  }

  const titleStyles: TextStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: icon ? theme.spacing.md : 0,
  }

  const descriptionStyles: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  }

  return (
    <View style={[containerStyles, style]}>
      {icon && <View>{icon}</View>}
      <Text style={titleStyles}>{title}</Text>
      {description && <Text style={descriptionStyles}>{description}</Text>}
      {actionLabel && onAction && (
        <View style={{ marginTop: theme.spacing.lg }}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  )
}
