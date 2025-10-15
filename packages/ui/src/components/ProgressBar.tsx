import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, ViewStyle, TextStyle } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: string
  height?: number
  animated?: boolean
  style?: ViewStyle
}

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  color,
  height = 8,
  animated = true,
  style,
}: ProgressBarProps) => {
  const { theme } = useTheme()
  const animatedWidth = useRef(new Animated.Value(0)).current

  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: percentage,
        duration: 500,
        useNativeDriver: false,
      }).start()
    } else {
      animatedWidth.setValue(percentage)
    }
  }, [percentage, animated, animatedWidth])

  const containerStyles: ViewStyle = {
    marginBottom: label || showPercentage ? theme.spacing.sm : 0,
  }

  const labelContainerStyles: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  }

  const labelStyles: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  }

  const percentageStyles: TextStyle = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  }

  const trackStyles: ViewStyle = {
    height,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: height / 2,
    overflow: 'hidden',
  }

  const fillColor = color || theme.colors.primary

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={[containerStyles, style]}>
      {(label || showPercentage) && (
        <View style={labelContainerStyles}>
          {label && <Text style={labelStyles}>{label}</Text>}
          {showPercentage && <Text style={percentageStyles}>{Math.round(percentage)}%</Text>}
        </View>
      )}
      <View style={trackStyles}>
        <Animated.View
          style={{
            height: '100%',
            width,
            backgroundColor: fillColor,
            borderRadius: height / 2,
          }}
        />
      </View>
    </View>
  )
}
