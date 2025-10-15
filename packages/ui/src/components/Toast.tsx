import React, { useState, useEffect, useCallback } from 'react'
import { Text, Animated, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onHide?: () => void
}

interface ToastState extends ToastProps {
  duration: number
}

let toastRef: ((props: ToastProps) => void) | null = null

export const showToast = (props: ToastProps) => {
  if (toastRef) {
    toastRef(props)
  }
}

export const Toast = () => {
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)
  const [toastProps, setToastProps] = useState<ToastState>({
    message: '',
    type: 'info',
    duration: 3000,
  })
  const opacity = React.useRef(new Animated.Value(0)).current
  const translateY = React.useRef(new Animated.Value(-100)).current

  useEffect(() => {
    toastRef = (props: ToastProps) => {
      setToastProps({ ...props, duration: props.duration || 3000 })
      setVisible(true)
    }

    return () => {
      toastRef = null
    }
  }, [])

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false)
      toastProps.onHide?.()
    })
  }, [opacity, translateY, toastProps])

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      const timer = setTimeout(() => {
        hideToast()
      }, toastProps.duration)

      return () => clearTimeout(timer)
    }
  }, [visible, toastProps.duration, hideToast, opacity, translateY])

  const getBackgroundColor = () => {
    switch (toastProps.type) {
      case 'success':
        return theme.colors.success
      case 'error':
        return theme.colors.error
      case 'warning':
        return theme.colors.warning
      case 'info':
      default:
        return theme.colors.info
    }
  }

  if (!visible) return null

  const containerStyles: ViewStyle = {
    position: 'absolute',
    top: 50,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: getBackgroundColor(),
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.lg,
    zIndex: 9999,
  }

  const textStyles: TextStyle = {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  }

  return (
    <Animated.View
      style={[
        containerStyles,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={textStyles}>{toastProps.message}</Text>
    </Animated.View>
  )
}
