'use client'

import React from 'react'
import { View, Text, Pressable, StyleSheet, Platform, ScrollView } from 'react-native'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@repo/ui'

interface SidebarProps {
  isOpen: boolean
  isMobile: boolean
  isTablet: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  icon: string
  path: string
  badge?: number
}

export const Sidebar = ({ isOpen, isMobile, isTablet, onClose }: SidebarProps) => {
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { label: 'Tasks', icon: '✓', path: '/dashboard/tasks' },
    { label: 'Character', icon: '⚔️', path: '/dashboard/character' },
    { label: 'Shop', icon: '🏪', path: '/dashboard/shop' },
    { label: 'Analytics', icon: '📊', path: '/dashboard/analytics' },
    { label: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Don't render sidebar on mobile when closed
  if (isMobile && !isOpen) {
    return null
  }

  const sidebarWidth = isMobile ? 280 : isTablet ? 240 : 280

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: sidebarWidth,
          backgroundColor: theme.colors.surface,
          borderRightColor: theme.colors.border,
        },
        isMobile && styles.sidebarMobile,
        isMobile && isOpen && styles.sidebarMobileOpen,
      ]}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.nav}>
          {/* Main Navigation */}
          <View style={styles.navSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>MAIN</Text>
            {navItems.slice(0, 4).map((item) => (
              <Pressable
                key={item.path}
                onPress={() => handleNavigation(item.path)}
                style={({ pressed }) => [
                  styles.navItem,
                  {
                    backgroundColor: isActive(item.path)
                      ? theme.colors.primaryLight
                      : pressed
                        ? theme.colors.surfaceSecondary
                        : 'transparent',
                  },
                ]}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: isActive(item.path) ? theme.colors.primary : theme.colors.text,
                      fontWeight: isActive(item.path) ? '600' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
                {item.badge !== undefined && (
                  <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          {/* Other Navigation */}
          <View style={styles.navSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>OTHER</Text>
            {navItems.slice(4).map((item) => (
              <Pressable
                key={item.path}
                onPress={() => handleNavigation(item.path)}
                style={({ pressed }) => [
                  styles.navItem,
                  {
                    backgroundColor: isActive(item.path)
                      ? theme.colors.primaryLight
                      : pressed
                        ? theme.colors.surfaceSecondary
                        : 'transparent',
                  },
                ]}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: isActive(item.path) ? theme.colors.primary : theme.colors.text,
                      fontWeight: isActive(item.path) ? '600' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    borderRightWidth: 1,
    ...(Platform.OS === 'web' && {
      position: 'sticky' as any,
      top: 0,
      height: '100vh' as any,
      overflow: 'auto' as any,
    }),
  },
  sidebarMobile: {
    position: 'absolute',
    top: 0,
    left: -280,
    bottom: 0,
    zIndex: 50,
    ...(Platform.OS === 'web' && {
      position: 'fixed' as any,
      transition: 'left 0.3s ease-in-out' as any,
    }),
  },
  sidebarMobileOpen: {
    left: 0,
  },
  scrollView: {
    flex: 1,
  },
  nav: {
    paddingVertical: 16,
  },
  navSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    gap: 12,
  },
  navIcon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
})
