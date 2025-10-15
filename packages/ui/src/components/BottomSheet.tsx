import React, { useEffect, useRef } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  snapPoints?: number[]
  closeOnBackdrop?: boolean
  style?: ViewStyle
}

export const BottomSheet = ({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.5],
  closeOnBackdrop = true,
  style,
}: BottomSheetProps) => {
  const { theme } = useTheme()
  const screenHeight = Dimensions.get('window').height
  const translateY = useRef(new Animated.Value(screenHeight)).current

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start()
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, translateY, screenHeight])

  const maxHeight = screenHeight * Math.max(...snapPoints)

  const overlayStyles: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  }

  const sheetStyles: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight,
    ...theme.shadows.lg,
  }

  const handleStyles: ViewStyle = {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  }

  const handleBarStyles: ViewStyle = {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  }

  const headerStyles: ViewStyle = {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: title ? 1 : 0,
    borderBottomColor: theme.colors.border,
  }

  const titleStyles: TextStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  }

  const contentStyles: ViewStyle = {
    padding: theme.spacing.lg,
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={overlayStyles} onPress={closeOnBackdrop ? onClose : undefined}>
        <Animated.View
          style={[
            sheetStyles,
            {
              transform: [{ translateY }],
            },
            style,
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={handleStyles}>
            <View style={handleBarStyles} />
          </View>

          {title && (
            <View style={headerStyles}>
              <Text style={titleStyles}>{title}</Text>
            </View>
          )}

          <ScrollView style={contentStyles}>{children}</ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
