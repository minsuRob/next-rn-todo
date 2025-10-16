'use client'

import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useTheme, Avatar, ProgressBar, Container, Button } from '@repo/ui'
import { useCharacter } from '@repo/hooks'

export default function CharacterPage() {
  const { theme } = useTheme()
  const { data: characterData, isLoading } = useCharacter()

  const character = characterData?.character
  const equippedItems = characterData?.equippedItems || []

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  const xpNeeded = Math.floor(100 * Math.pow(character?.level || 1, 1.5))
  const xpProgress = character ? (character.xp / xpNeeded) * 100 : 0

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Character</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            View your character stats and equipment
          </Text>
        </View>

        {/* Character Display */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.characterDisplay}>
            <View style={styles.avatarContainer}>
              <Avatar name={character?.userId || 'User'} size="xl" />
              <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.levelText}>Lv {character?.level || 1}</Text>
              </View>
            </View>

            <View style={styles.characterStats}>
              <Text style={[styles.characterName, { color: theme.colors.text }]}>
                Level {character?.level || 1} Adventurer
              </Text>

              {/* XP Bar */}
              <View style={styles.statSection}>
                <View style={styles.statHeader}>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Experience
                  </Text>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {character?.xp || 0} / {xpNeeded} XP
                  </Text>
                </View>
                <ProgressBar
                  value={character?.xp || 0}
                  max={xpNeeded}
                  color={theme.colors.primary}
                  height={12}
                />
              </View>

              {/* HP Bar */}
              <View style={styles.statSection}>
                <View style={styles.statHeader}>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Health
                  </Text>
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

              {/* Gold */}
              <View style={[styles.goldCard, { backgroundColor: theme.colors.primaryLight }]}>
                <Text style={styles.goldIcon}>💰</Text>
                <View>
                  <Text style={[styles.goldValue, { color: theme.colors.primary }]}>
                    {character?.gold || 0}
                  </Text>
                  <Text style={[styles.goldLabel, { color: theme.colors.textSecondary }]}>
                    Gold
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Stats Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="⚔️"
              label="Level"
              value={character?.level?.toString() || '1'}
              theme={theme}
            />
            <StatCard
              icon="✨"
              label="Total XP"
              value={character?.xp?.toString() || '0'}
              theme={theme}
            />
            <StatCard icon="💪" label="HP" value={`${character?.hp || 100}/100`} theme={theme} />
            <StatCard
              icon="💰"
              label="Gold"
              value={character?.gold?.toString() || '0'}
              theme={theme}
            />
          </View>
        </View>

        {/* Equipment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Equipment</Text>
            <Button title="Manage" onPress={() => {}} variant="secondary" size="sm" />
          </View>

          {equippedItems.length === 0 ? (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No equipment equipped. Visit the shop to purchase items!
              </Text>
            </View>
          ) : (
            <View style={styles.equipmentGrid}>
              {equippedItems.map((item: any) => (
                <View
                  key={item.id}
                  style={[
                    styles.equipmentSlot,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                  ]}
                >
                  <Text style={styles.equipmentIcon}>🎒</Text>
                  <Text style={[styles.equipmentName, { color: theme.colors.text }]}>
                    {item.name || 'Item'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Level Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Level Progress</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                Current Level
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                Level {character?.level || 1}
              </Text>
            </View>

            <ProgressBar
              value={character?.xp || 0}
              max={xpNeeded}
              color={theme.colors.primary}
              height={16}
              showPercentage
            />

            <View style={styles.progressInfo}>
              <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
                Next Level
              </Text>
              <Text style={[styles.progressValue, { color: theme.colors.text }]}>
                {xpNeeded - (character?.xp || 0)} XP needed
              </Text>
            </View>

            <View style={[styles.levelRewards, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={[styles.rewardsTitle, { color: theme.colors.primary }]}>
                Next Level Rewards
              </Text>
              <View style={styles.rewardsList}>
                <Text style={[styles.rewardItem, { color: theme.colors.textSecondary }]}>
                  • 50 Gold
                </Text>
                <Text style={[styles.rewardItem, { color: theme.colors.textSecondary }]}>
                  • New customization options
                </Text>
                <Text style={[styles.rewardItem, { color: theme.colors.textSecondary }]}>
                  • Achievement badge
                </Text>
              </View>
            </View>
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
}: {
  icon: string
  label: string
  value: string
  theme: any
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Text style={styles.statCardIcon}>{icon}</Text>
      <Text style={[styles.statCardValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statCardLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
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
  characterDisplay: {
    alignItems: 'center',
    gap: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  characterStats: {
    width: '100%',
  },
  characterName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
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
  goldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 12,
  },
  goldIcon: {
    fontSize: 32,
  },
  goldValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  goldLabel: {
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
    marginBottom: 16,
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
  statCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    padding: 32,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  equipmentSlot: {
    flex: 1,
    minWidth: 120,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  equipmentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  equipmentName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  levelRewards: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  rewardsList: {
    gap: 4,
  },
  rewardItem: {
    fontSize: 14,
  },
})
