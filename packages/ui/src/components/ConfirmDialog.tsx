import React from 'react'
import { Text, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'
import { Modal } from './Modal'
import { Button } from './Button'
import { Stack } from './Stack'

export interface ConfirmDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export const ConfirmDialog = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false,
}: ConfirmDialogProps) => {
  const { theme } = useTheme()

  const messageStyles: TextStyle = {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  }

  const getConfirmVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger'
      case 'warning':
        return 'secondary'
      case 'info':
      default:
        return 'primary'
    }
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
      footer={
        <Stack direction="row" spacing="md" justify="flex-end">
          <Button title={cancelText} onPress={onClose} variant="outline" disabled={loading} />
          <Button
            title={confirmText}
            onPress={onConfirm}
            variant={getConfirmVariant()}
            loading={loading}
          />
        </Stack>
      }
    >
      <Text style={messageStyles}>{message}</Text>
    </Modal>
  )
}
