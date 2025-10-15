import React from 'react'
import { Pressable, Text, ViewStyle, TextStyle, Animated } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  label?: string
  disabled?: boolean
  containerStyle?: ViewStyle
}

export const Switch = ({
  value,
  onValueChange,
  label,
  disabled = false,
  containerStyle,
}: SwitchProps) => {
  const { theme } = useTheme()
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [value, animatedValue])

  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  }

  const switchTrackStyles: ViewStyle = {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  }

  const switchThumbStyles: ViewStyle = {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    ...theme.shadows.sm,
  }

  const labelStyles: TextStyle = {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  }

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  })

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.primary],
  })

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      style={({ pressed }) => [
        containerStyles,
        pressed && !disabled && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
        containerStyle,
      ]}
      disabled={disabled}
    >
      <Animated.View style={[switchTrackStyles, { backgroundColor }]}>
        <Animated.View
          style={[
            switchThumbStyles,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
      {label && <Text style={labelStyles}>{label}</Text>}
    </Pressable>
  )
}
