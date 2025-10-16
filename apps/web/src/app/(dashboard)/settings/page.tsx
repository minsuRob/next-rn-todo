'use client'

import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useTheme, Container, Switch, Select, Avatar, Button } from '@repo/ui'
import { useAuth } from '@repo/hooks'

export default function SettingsPage() {
  const { theme, isDark, setTheme } = useTheme()
  const { user } = useAuth()

  // Settings state
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    dailyReminders: true,
    levelUp: true,
    achievements: true,
  })

  const [preferences, setPreferences] = useState({
    language: 'en',
    startOfWeek: 'monday',
    dateFormat: 'MM/DD/YYYY',
  })

  const handleThemeChange = (value: string) => {
    setTheme(value === 'dark')
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Customize your experience
          </Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profile</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.profileHeader}>
              <Avatar name={user?.email || 'User'} size="lg" />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
            <Button title="Edit Profile" onPress={() => {}} variant="secondary" />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Theme</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Choose your preferred color scheme
                </Text>
              </View>
              <Select
                value={isDark ? 'dark' : 'light'}
                onChange={handleThemeChange}
                options={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                ]}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Avatar Style
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Customize your character avatar
                </Text>
              </View>
              <Button title="Customize" onPress={() => {}} variant="secondary" size="sm" />
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Task Reminders
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Get notified about upcoming tasks
                </Text>
              </View>
              <Switch
                value={notifications.taskReminders}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, taskReminders: value })
                }
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Daily Reminders
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Daily check-in notifications
                </Text>
              </View>
              <Switch
                value={notifications.dailyReminders}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, dailyReminders: value })
                }
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Level Up Alerts
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Celebrate when you level up
                </Text>
              </View>
              <Switch
                value={notifications.levelUp}
                onValueChange={(value) => setNotifications({ ...notifications, levelUp: value })}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Achievement Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Get notified about new achievements
                </Text>
              </View>
              <Switch
                value={notifications.achievements}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, achievements: value })
                }
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Language</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Choose your preferred language
                </Text>
              </View>
              <Select
                value={preferences.language}
                onChange={(value) => setPreferences({ ...preferences, language: value })}
                options={[
                  { label: 'English', value: 'en' },
                  { label: '한국어', value: 'ko' },
                  { label: '日本語', value: 'ja' },
                ]}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Start of Week
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  First day of the week
                </Text>
              </View>
              <Select
                value={preferences.startOfWeek}
                onChange={(value) => setPreferences({ ...preferences, startOfWeek: value })}
                options={[
                  { label: 'Monday', value: 'monday' },
                  { label: 'Sunday', value: 'sunday' },
                ]}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Date Format</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  How dates are displayed
                </Text>
              </View>
              <Select
                value={preferences.dateFormat}
                onChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                options={[
                  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data & Privacy</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Pressable style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Export Data</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Download all your data
                </Text>
              </View>
              <Text style={[styles.settingAction, { color: theme.colors.primary }]}>Export</Text>
            </Pressable>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <Pressable style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Delete Account
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Permanently delete your account
                </Text>
              </View>
              <Text style={[styles.settingAction, { color: theme.colors.error }]}>Delete</Text>
            </Pressable>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.aboutItem}>
              <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
                Version
              </Text>
              <Text style={[styles.aboutValue, { color: theme.colors.text }]}>1.0.0</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <Pressable style={styles.aboutItem}>
              <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
                Terms of Service
              </Text>
              <Text style={[styles.settingAction, { color: theme.colors.primary }]}>View</Text>
            </Pressable>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <Pressable style={styles.aboutItem}>
              <Text style={[styles.aboutLabel, { color: theme.colors.textSecondary }]}>
                Privacy Policy
              </Text>
              <Text style={[styles.settingAction, { color: theme.colors.primary }]}>View</Text>
            </Pressable>
          </View>
        </View>
      </Container>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 24,
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
    marginBottom: 32,
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
    marginBottom: 20,
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
    paddingVertical: 12,
    gap: 16,
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
  settingAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 16,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '600',
  },
})
