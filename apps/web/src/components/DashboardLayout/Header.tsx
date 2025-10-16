'use client'

import React, { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native'
import { useTheme, Avatar } from '@repo/ui'
import { useAuth } from '@repo/hooks'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  onMenuPress: () => void
}

export const Header = ({ onMenuPress }: HeaderProps) => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
      ]}
    >
      <View style={styles.headerContent}>
        {/* Mobile menu button */}
        <Pressable
          onPress={onMenuPress}
          style={({ pressed }) => [
            styles.menuButton,
            { backgroundColor: pressed ? theme.colors.surfaceSecondary : 'transparent' },
          ]}
        >
          <View style={styles.menuIcon}>
            <View style={[styles.menuLine, { backgroundColor: theme.colors.text }]} />
            <View style={[styles.menuLine, { backgroundColor: theme.colors.text }]} />
            <View style={[styles.menuLine, { backgroundColor: theme.colors.text }]} />
          </View>
        </Pressable>

        {/* Logo/Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>⚔️ Gamified TODO</Text>
        </View>

        {/* User menu */}
        <View style={styles.userSection}>
          <Pressable
            onPress={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={({ pressed }) => [
              styles.userButton,
              { backgroundColor: pressed ? theme.colors.surfaceSecondary : 'transparent' },
            ]}
          >
            <Avatar name={user?.email || 'User'} size="sm" />
            <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>
              {user?.email?.split('@')[0] || 'User'}
            </Text>
          </Pressable>

          {isUserMenuOpen && <UserMenu onClose={() => setIsUserMenuOpen(false)} />}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    ...(Platform.OS === 'web' && {
      position: 'sticky' as any,
      top: 0,
      zIndex: 50,
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 64,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: 'space-around',
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  userSection: {
    position: 'relative',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    maxWidth: 200,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
})
