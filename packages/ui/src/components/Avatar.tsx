import React from 'react'
import { View, Image, Text, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface AvatarProps {
  source?: ImageSourcePropType
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  style?: ViewStyle
}

export const Avatar = ({ source, name, size = 'md', style }: AvatarProps) => {
  const { theme } = useTheme()

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 32
      case 'md':
        return 48
      case 'lg':
        return 64
      case 'xl':
        return 96
      default:
        return 48
    }
  }

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return theme.typography.fontSize.sm
      case 'md':
        return theme.typography.fontSize.md
      case 'lg':
        return theme.typography.fontSize.lg
      case 'xl':
        return theme.typography.fontSize.xxl
      default:
        return theme.typography.fontSize.md
    }
  }

  const avatarSize = getSize()

  const containerStyles: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }

  const textStyles: TextStyle = {
    color: '#FFFFFF',
    fontSize: getFontSize(),
    fontWeight: theme.typography.fontWeight.semibold,
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <View style={[containerStyles, style]}>
      {source ? (
        <Image
          source={source}
          style={{ width: avatarSize, height: avatarSize }}
          resizeMode="cover"
        />
      ) : name ? (
        <Text style={textStyles}>{getInitials(name)}</Text>
      ) : (
        <Text style={textStyles}>?</Text>
      )}
    </View>
  )
}
