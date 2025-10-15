import React from 'react'
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
  style?: ViewStyle
}

export const Modal = ({
  visible,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  style,
}: ModalProps) => {
  const { theme } = useTheme()

  const getMaxWidth = () => {
    switch (size) {
      case 'sm':
        return 400
      case 'md':
        return 600
      case 'lg':
        return 800
      case 'full':
        return '95%'
      default:
        return 600
    }
  }

  const overlayStyles: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  }

  const modalStyles: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    maxWidth: getMaxWidth(),
    width: '100%',
    maxHeight: '90%',
    ...theme.shadows.lg,
  }

  const headerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  }

  const titleStyles: TextStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
  }

  const closeButtonStyles: ViewStyle = {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  }

  const closeButtonTextStyles: TextStyle = {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.textSecondary,
  }

  const contentStyles: ViewStyle = {
    padding: theme.spacing.lg,
  }

  const footerStyles: ViewStyle = {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={overlayStyles} onPress={closeOnBackdrop ? onClose : undefined}>
        <Pressable style={[modalStyles, style]} onPress={(e) => e.stopPropagation()}>
          {(title || showCloseButton) && (
            <View style={headerStyles}>
              {title && <Text style={titleStyles}>{title}</Text>}
              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    closeButtonStyles,
                    pressed && { backgroundColor: theme.colors.surfaceSecondary },
                  ]}
                >
                  <Text style={closeButtonTextStyles}>×</Text>
                </Pressable>
              )}
            </View>
          )}

          <ScrollView style={contentStyles}>{children}</ScrollView>

          {footer && <View style={footerStyles}>{footer}</View>}
        </Pressable>
      </Pressable>
    </RNModal>
  )
}
