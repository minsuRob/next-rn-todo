import React, { useEffect, useRef } from 'react'
import { Animated, ViewStyle, DimensionValue } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface SkeletonProps {
  width?: DimensionValue
  height?: number
  borderRadius?: number
  style?: ViewStyle
}

export const Skeleton = ({ width = '100%', height = 20, borderRadius, style }: SkeletonProps) => {
  const { theme } = useTheme()
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )

    animation.start()

    return () => animation.stop()
  }, [opacity])

  const skeletonStyles: ViewStyle = {
    width,
    height,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: borderRadius ?? theme.borderRadius.md,
  }

  return <Animated.View style={[skeletonStyles, { opacity }, style]} />
}
