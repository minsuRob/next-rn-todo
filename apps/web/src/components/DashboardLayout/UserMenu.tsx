'use client'

import React from 'react'
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import { useRouter } from 'next/navigation'
import { useTheme } from '@repo/ui'
import { useAuth } from '@repo/hooks'

interface UserMenuProps {
  onClose: () => void
}

export const UserMenu = ({ onClose }: UserMenuProps) => {
  const { theme } = useTheme()
  const router = useRouter()
  const { signOut } = useAuth()

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    onClose()
  }

  const menuItems = [
    { label: 'Profile', icon: '👤', action: () => handleNavigation('/dashboard/profile') },
    { label: 'Settings', icon: '⚙️', action: () => handleNavigation('/dashboard/settings') },
    { label: 'Sign Out', icon: '🚪', action: handleSignOut, danger: true },
  ]

  return (
    <>
      {/* Backdrop */}
      {Platform.OS === 'web' && <Pressable style={styles.backdrop} onPress={onClose} />}

      {/* Menu */}
      <View
        style={[
          styles.menu,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            shadowColor: '#000',
          },
        ]}
      >
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.action}
            style={({ pressed }) => [
              styles.menuItem,
              {
                backgroundColor: pressed ? theme.colors.surfaceSecondary : 'transparent',
              },
            ]}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.menuLabel,
                {
                  color: item.danger ? theme.colors.error : theme.colors.text,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    ...(Platform.OS === 'web' && {
      position: 'fixed' as any,
    }),
    zIndex: 40,
  },
  menu: {
    position: 'absolute',
    top: '100%' as any,
    right: 0,
    marginTop: 8,
    minWidth: 200,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 50,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
})
