import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Avatar, Button, Switch } from '@repo/ui'
import { useAuth } from '@repo/hooks'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'
import { useState } from 'react'

export default function SettingsScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)

  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)/login')
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Customize your experience
        </Text>
      </View>

      {/* Profile */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.profileHeader}>
            <Avatar name={user?.email || 'User'} size="lg" />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.tabIconDefault }]}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
              <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
                Get notified about tasks
              </Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Pressable style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Version</Text>
            <Text style={[styles.settingValue, { color: colors.tabIconDefault }]}>1.0.0</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Button title="Sign Out" onPress={handleSignOut} variant="secondary" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 16,
  },
})
