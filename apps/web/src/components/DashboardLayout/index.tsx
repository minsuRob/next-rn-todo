'use client'

import React, { useState } from 'react'
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native'
import { useTheme } from '@repo/ui'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header onMenuPress={toggleSidebar} />

      <View style={styles.content}>
        <Sidebar
          isOpen={isSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
          onClose={closeSidebar}
        />

        <View style={styles.main}>{children}</View>
      </View>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <View
          style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
          onTouchEnd={closeSidebar}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'hidden',
    }),
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    ...(Platform.OS === 'web' && {
      overflow: 'hidden',
    }),
  },
  main: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflow: 'auto',
    }),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
  },
})
