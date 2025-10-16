'use client'

import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useTheme, Container, ProgressBar } from '@repo/ui'
import { useCharacter, useTasks } from '@repo/hooks'

// Mock analytics data (would come from API)
const MOCK_XP_HISTORY = [
  { date: 'Mon', xp: 120 },
  { date: 'Tue', xp: 180 },
  { date: 'Wed', xp: 90 },
  { date: 'Thu', xp: 200 },
  { date: 'Fri', xp: 150 },
  { date: 'Sat', xp: 100 },
  { date: 'Sun', xp: 160 },
]

const MOCK_STREAK_CALENDAR = [
  [0, 1, 1, 0, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 0],
]

export default function AnalyticsPage() {
  const { theme } = useTheme()
  const { data: characterData, isLoading: isLoadingCharacter } = useCharacter()
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks({})

  const character = characterData?.character
  const tasks = tasksData?.tasks || []
  const completedTasks = tasks.filter((t) => t.isCompleted).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Calculate weekly stats
  const weeklyXP = MOCK_XP_HISTORY.reduce((sum, day) => sum + day.xp, 0)
  const weeklyTasks = 24 // Mock data
  const productivityScore = Math.round((weeklyXP / 1000) * 100)

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
          <Text style={[styles.title, { color: theme.colors.text }]}>Analytics</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Track your progress and productivity
          </Text>
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Weekly Summary</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="✨"
              label="Total XP"
              value={weeklyXP.toString()}
              theme={theme}
              color={theme.colors.primary}
            />
            <StatCard
              icon="✓"
              label="Tasks Completed"
              value={weeklyTasks.toString()}
              theme={theme}
              color={theme.colors.success}
            />
            <StatCard
              icon="📈"
              label="Productivity Score"
              value={`${productivityScore}%`}
              theme={theme}
              color={theme.colors.warning}
            />
            <StatCard
              icon="🔥"
              label="Current Streak"
              value="5 days"
              theme={theme}
              color={theme.colors.error}
            />
          </View>
        </View>

        {/* XP History Chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>XP History</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.chart}>
              {MOCK_XP_HISTORY.map((day, index) => {
                const maxXP = Math.max(...MOCK_XP_HISTORY.map((d) => d.xp))
                const height = (day.xp / maxXP) * 150
                return (
                  <View key={index} style={styles.chartColumn}>
                    <View style={styles.chartBarContainer}>
                      <View
                        style={[styles.chartBar, { height, backgroundColor: theme.colors.primary }]}
                      />
                    </View>
                    <Text style={[styles.chartLabel, { color: theme.colors.textSecondary }]}>
                      {day.date}
                    </Text>
                    <Text style={[styles.chartValue, { color: theme.colors.text }]}>{day.xp}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        {/* Task Completion Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Task Completion Rate
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.completionStats}>
              <View style={styles.completionInfo}>
                <Text style={[styles.completionLabel, { color: theme.colors.textSecondary }]}>
                  Completed
                </Text>
                <Text style={[styles.completionValue, { color: theme.colors.success }]}>
                  {completedTasks} / {totalTasks}
                </Text>
              </View>
              <ProgressBar
                value={completedTasks}
                max={totalTasks || 1}
                color={theme.colors.success}
                height={16}
                showPercentage
              />
            </View>

            <View style={styles.taskTypeBreakdown}>
              <Text style={[styles.breakdownTitle, { color: theme.colors.text }]}>
                By Task Type
              </Text>
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.colors.textSecondary }]}>
                  Habits
                </Text>
                <View style={styles.breakdownBar}>
                  <View
                    style={[
                      styles.breakdownFill,
                      { width: '60%', backgroundColor: theme.colors.primary },
                    ]}
                  />
                </View>
                <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>60%</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.colors.textSecondary }]}>
                  Dailies
                </Text>
                <View style={styles.breakdownBar}>
                  <View
                    style={[
                      styles.breakdownFill,
                      { width: '80%', backgroundColor: theme.colors.success },
                    ]}
                  />
                </View>
                <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>80%</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={[styles.breakdownLabel, { color: theme.colors.textSecondary }]}>
                  To-Dos
                </Text>
                <View style={styles.breakdownBar}>
                  <View
                    style={[
                      styles.breakdownFill,
                      { width: '45%', backgroundColor: theme.colors.warning },
                    ]}
                  />
                </View>
                <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>45%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Streak Calendar Heatmap */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Streak Calendar</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.calendar}>
              <View style={styles.calendarHeader}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <Text
                    key={day}
                    style={[styles.calendarDay, { color: theme.colors.textSecondary }]}
                  >
                    {day}
                  </Text>
                ))}
              </View>
              {MOCK_STREAK_CALENDAR.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.calendarWeek}>
                  {week.map((day, dayIndex) => (
                    <View
                      key={dayIndex}
                      style={[
                        styles.calendarCell,
                        {
                          backgroundColor: day
                            ? theme.colors.success
                            : theme.colors.surfaceSecondary,
                        },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.calendarLegend}>
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Less</Text>
              <View
                style={[styles.legendCell, { backgroundColor: theme.colors.surfaceSecondary }]}
              />
              <View style={[styles.legendCell, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>More</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Achievements
          </Text>
          <View style={styles.achievementsGrid}>
            <AchievementCard
              icon="🏆"
              title="First Steps"
              description="Complete your first task"
              unlocked
              theme={theme}
            />
            <AchievementCard
              icon="🔥"
              title="Week Warrior"
              description="Maintain a 7-day streak"
              unlocked
              theme={theme}
            />
            <AchievementCard
              icon="⭐"
              title="Level 5"
              description="Reach level 5"
              unlocked={false}
              theme={theme}
            />
            <AchievementCard
              icon="💎"
              title="Gold Hoarder"
              description="Accumulate 1000 gold"
              unlocked={false}
              theme={theme}
            />
          </View>
        </View>
      </Container>
    </ScrollView>
  )
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  theme,
  color,
}: {
  icon: string
  label: string
  value: string
  theme: any
  color: string
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.statIcon}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  )
}

// Achievement Card Component
function AchievementCard({
  icon,
  title,
  description,
  unlocked,
  theme,
}: {
  icon: string
  title: string
  description: string
  unlocked: boolean
  theme: any
}) {
  return (
    <View
      style={[
        styles.achievementCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: unlocked ? theme.colors.primary : theme.colors.border,
          opacity: unlocked ? 1 : 0.5,
        },
      ]}
    >
      <Text style={styles.achievementIcon}>{icon}</Text>
      <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
        {description}
      </Text>
      {unlocked && (
        <View style={[styles.unlockedBadge, { backgroundColor: theme.colors.success }]}>
          <Text style={styles.unlockedText}>✓ Unlocked</Text>
        </View>
      )}
    </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 4,
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: 10,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  completionStats: {
    marginBottom: 24,
  },
  completionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  completionLabel: {
    fontSize: 14,
  },
  completionValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  taskTypeBreakdown: {
    gap: 12,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownLabel: {
    width: 60,
    fontSize: 14,
  },
  breakdownBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownValue: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  calendar: {
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarDay: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  calendarCell: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  calendarLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: 12,
  },
  legendCell: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  unlockedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
})
