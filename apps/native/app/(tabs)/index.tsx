import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Avatar, ProgressBar, Button, Container } from '@repo/ui'
import { useCharacter, useTasks, useCompleteTask } from '@repo/hooks'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function DashboardScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const router = useRouter()

  const { data: characterData, isLoading: isLoadingCharacter } = useCharacter()
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks({ limit: 10 })
  const { mutate: completeTask } = useCompleteTask()

  const character = characterData?.character
  const todayTasks = tasksData?.tasks || []

  const xpNeeded = Math.floor(100 * Math.pow(character?.level || 1, 1.5))
  const currentStreak = 5 // Mock data

  const handleCompleteTask = (taskId: string) => {
    completeTask({ taskId })
  }

  if (isLoadingCharacter || isLoadingTasks) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            Welcome back! Let's make today productive.
          </Text>
        </View>

        {/* Character Stats Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.characterHeader}>
            <Avatar name={character?.userId || 'User'} size="lg" />
            <View style={styles.characterInfo}>
              <Text style={[styles.characterName, { color: colors.text }]}>
                Level {character?.level || 1} Adventurer
              </Text>
              <Text style={[styles.characterSubtext, { color: colors.tabIconDefault }]}>
                {character?.gold || 0} 💰 Gold
              </Text>
            </View>
          </View>

          {/* XP Progress */}
          <View style={styles.statSection}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Experience</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {character?.xp || 0} / {xpNeeded} XP
              </Text>
            </View>
            <ProgressBar
              value={character?.xp || 0}
              max={xpNeeded}
              color={colors.tint}
              height={12}
            />
          </View>

          {/* HP Progress */}
          <View style={styles.statSection}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.tabIconDefault }]}>Health</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {character?.hp || 100} / 100 HP
              </Text>
            </View>
            <ProgressBar value={character?.hp || 100} max={100} color="#ef4444" height={12} />
          </View>

          {/* Streak */}
          <View style={[styles.streakCard, { backgroundColor: colors.tint + '20' }]}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View style={styles.streakInfo}>
              <Text style={[styles.streakValue, { color: colors.tint }]}>
                {currentStreak} Day Streak
              </Text>
              <Text style={[styles.streakLabel, { color: colors.tabIconDefault }]}>
                Keep it going!
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Tasks</Text>
            <Pressable onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={[styles.sectionLink, { color: colors.tint }]}>View All</Text>
            </Pressable>
          </View>

          {todayTasks.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
                No tasks for today. Create one to get started!
              </Text>
            </View>
          ) : (
            todayTasks.slice(0, 5).map((task) => (
              <View key={task.id} style={[styles.taskCard, { backgroundColor: colors.card }]}>
                <View style={styles.taskContent}>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
                    <View style={styles.taskMeta}>
                      <Text style={[styles.taskType, { color: colors.tabIconDefault }]}>
                        {task.type}
                      </Text>
                      <Text style={[styles.taskDifficulty, { color: colors.tabIconDefault }]}>
                        • {task.difficulty}
                      </Text>
                    </View>
                  </View>
                  {!task.isCompleted && (
                    <Button
                      title="Complete"
                      onPress={() => handleCompleteTask(task.id)}
                      variant="primary"
                      size="sm"
                    />
                  )}
                  {task.isCompleted && (
                    <Text style={[styles.completedBadge, { color: '#22c55e' }]}>✓ Done</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Pressable
              style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(tabs)/tasks')}
            >
              <Text style={styles.quickActionIcon}>✓</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>New Task</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(tabs)/character')}
            >
              <Text style={styles.quickActionIcon}>⚔️</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Character</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(tabs)/shop')}
            >
              <Text style={styles.quickActionIcon}>🏪</Text>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Shop</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  characterSubtext: {
    fontSize: 14,
  },
  statSection: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 12,
  },
  streakIcon: {
    fontSize: 32,
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  streakLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    padding: 32,
  },
  taskCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  taskType: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  taskDifficulty: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  completedBadge: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: 100,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
})
