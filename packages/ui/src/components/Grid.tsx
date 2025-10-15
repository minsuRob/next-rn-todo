import React from 'react'
import { View, ViewStyle, useWindowDimensions } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export interface GridProps {
  children: React.ReactNode
  columns?: number | { sm?: number; md?: number; lg?: number }
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  style?: ViewStyle
}

export const Grid = ({ children, columns = 2, spacing = 'md', style }: GridProps) => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()

  const getColumns = () => {
    if (typeof columns === 'number') {
      return columns
    }

    // Responsive breakpoints
    if (width >= 1024 && columns.lg) return columns.lg
    if (width >= 768 && columns.md) return columns.md
    if (columns.sm) return columns.sm
    return 2
  }

  const numColumns = getColumns()
  const gap = theme.spacing[spacing]

  const gridStyles: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -gap / 2,
  }

  const childrenArray = React.Children.toArray(children)

  return (
    <View style={[gridStyles, style]}>
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / numColumns}%`,
            paddingHorizontal: gap / 2,
            marginBottom: gap,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  )
}
