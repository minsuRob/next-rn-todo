'use client'

import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { useTheme, ProgressBar, Avatar, Button, Container } from '@repo/ui'
import { useCharacter, useTasks, useCompleteTask } from '@repo/hooks'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const { data: characterData, isLoading: isLoadingCharacter } = useCharacter()
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks({ limit: 10 })
  const { mutate: completeTask } = useCompleteTask()

  const character = characterData?.character
  const todayTasks = tasksData?.tasks || []

  // Calculate XP progress
  const xpProgress = character ? (character.xp / (100 * Math.pow(character.level, 1.5))) * 100 : 0

  // Calculate HP percentage
  const hpPercentage = character ? (character.hp / 100) * 100 : 100

  // Mock streak data (would come from backend)
  const currentStreak = 5

  const handleCompleteTask = (taskId: string) => {
    completeTask({ taskId })
  }

  if (isLoadingCharacter || isLoadingTasks) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Dashboard</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Welcome back! Let's make today productive.
          </Text>
        </View>

        {/* Character Stats Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.characterHeader}>
            <Avatar name={character?.userId || 'User'} size="lg" />
            <View style={styles.characterInfo}>
              <Text style={[styles.characterName, { color: theme.colors.text }]}>
                Level {character?.level || 1} Adventurer
              </Text>
              <Text style={[styles.characterSubtext, { color: theme.colors.textSecondary }]}>
                {character?.gold || 0} 💰 Gold
              </Text>
            </View>
          </View>

          {/* XP Progress */}
          <View style={styles.statSection}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Experience
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {character?.xp || 0} / {Math.floor(100 * Math.pow(character?.level || 1, 1.5))} XP
              </Text>
            </View>
            <ProgressBar
              value={character?.xp || 0}
              max={Math.floor(100 * Math.pow(character?.level || 1, 1.5))}
              color={theme.colors.primary}
              height={12}
            />
          </View>

          {/* HP Progress */}
          <View style={styles.statSection}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Health</Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {character?.hp || 100} / 100 HP
              </Text>
            </View>
            <ProgressBar
              value={character?.hp || 100}
              max={100}
              color={theme.colors.error}
              height={12}
            />
          </View>

          {/* Streak Indicator */}
          <View style={[styles.streakCard, { backgroundColor: theme.colors.primaryLight }]}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View style={styles.streakInfo}>
              <Text style={[styles.streakValue, { color: theme.colors.primary }]}>
                {currentStreak} Day Streak
              </Text>
              <Text style={[styles.streakLabel, { color: theme.colors.textSecondary }]}>
                Keep it going!
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Tasks</Text>
            <Pressable onPress={() => router.push('/dashboard/tasks')}>
              <Text style={[styles.sectionLink, { color: theme.colors.primary }]}>View All</Text>
            </Pressable>
          </View>

          {todayTasks.length === 0 ? (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No tasks for today. Create one to get started!
              </Text>
            </View>
          ) : (
            todayTasks.slice(0, 5).map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                <View style={styles.taskContent}>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      <Text style={[styles.taskType, { color: theme.colors.textTertiary }]}>
                        {task.type}
                      </Text>
                      <Text style={[styles.taskDifficulty, { color: theme.colors.textTertiary }]}>
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
                    <Text style={[styles.completedBadge, { color: theme.colors.success }]}>
                      ✓ Done
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Pressable
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/dashboard/tasks')}
            >
              <Text style={styles.quickActionIcon}>✓</Text>
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>New Task</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/dashboard/character')}
            >
              <Text style={styles.quickActionIcon}>⚔️</Text>
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>Character</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/dashboard/shop')}
            >
              <Text style={styles.quickActionIcon}>🏪</Text>
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>Shop</Text>
            </Pressable>

            <Pressable
              style={[styles.quickActionCard, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.push('/dashboard/analytics')}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>Analytics</Text>
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
    borderWidth: 1,
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
    minWidth: 150,
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
