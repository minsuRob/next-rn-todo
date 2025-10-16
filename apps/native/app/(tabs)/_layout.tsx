import { Tabs } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'

import { HapticTab } from '@/components/haptic-tab'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

function TabBarIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 24, color }}>{emoji}</Text>
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon emoji="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <TabBarIcon emoji="✓" color={color} />,
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'Character',
          tabBarIcon: ({ color }) => <TabBarIcon emoji="⚔️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <TabBarIcon emoji="🏪" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon emoji="⚙️" color={color} />,
        }}
      />
    </Tabs>
  )
}
