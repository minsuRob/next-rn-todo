import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { Avatar, ProgressBar, Button, Container } from '@repo/ui'
import { useCharacter } from '@repo/hooks'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Colors } from '@/constants/theme'

export default function CharacterScreen() {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']
  const { data: characterData, isLoading } = useCharacter()

  const character = characterData?.character
  const equippedItems = characterData?.equippedItems || []
  const xpNeeded = Math.floor(100 * Math.pow(character?.level || 1, 1.5))

  if (isLoading) {
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
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Character</Text>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            View your character stats
          </Text>
        </View>

        {/* Character Display */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.characterDisplay}>
            <View style={styles.avatarContainer}>
              <Avatar name={character?.userId || 'User'} size="xl" />
              <View style={[styles.levelBadge, { backgroundColor: colors.tint }]}>
                <Text style={styles.levelText}>Lv {character?.level || 1}</Text>
              </View>
            </View>

            <Text style={[styles.characterName, { color: colors.text }]}>
              Level {character?.level || 1} Adventurer
            </Text>

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

            {/* Gold */}
            <View style={[styles.goldCard, { backgroundColor: colors.tint + '20' }]}>
              <Text style={styles.goldIcon}>💰</Text>
              <View>
                <Text style={[styles.goldValue, { color: colors.tint }]}>
                  {character?.gold || 0}
                </Text>
                <Text style={[styles.goldLabel, { color: colors.tabIconDefault }]}>Gold</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Stats Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="⚔️"
              label="Level"
              value={character?.level?.toString() || '1'}
              colors={colors}
            />
            <StatCard
              icon="✨"
              label="Total XP"
              value={character?.xp?.toString() || '0'}
              colors={colors}
            />
            <StatCard icon="💪" label="HP" value={`${character?.hp || 100}/100`} colors={colors} />
            <StatCard
              icon="💰"
              label="Gold"
              value={character?.gold?.toString() || '0'}
              colors={colors}
            />
          </View>
        </View>

        {/* Equipment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipment</Text>
            <Button title="Manage" onPress={() => {}} variant="secondary" size="sm" />
          </View>

          {equippedItems.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
                No equipment equipped. Visit the shop!
              </Text>
            </View>
          ) : (
            <View style={styles.equipmentGrid}>
              {equippedItems.map((item: any) => (
                <View
                  key={item.id}
                  style={[styles.equipmentSlot, { backgroundColor: colors.card }]}
                >
                  <Text style={styles.equipmentIcon}>🎒</Text>
                  <Text style={[styles.equipmentName, { color: colors.text }]}>
                    {item.name || 'Item'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Container>
    </ScrollView>
  )
}

function StatCard({
  icon,
  label,
  value,
  colors,
}: {
  icon: string
  label: string
  value: string
  colors: any
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <Text style={styles.statCardIcon}>{icon}</Text>
      <Text style={[styles.statCardValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statCardLabel, { color: colors.tabIconDefault }]}>{label}</Text>
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
  characterDisplay: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
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
  characterName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  statSection: {
    width: '100%',
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
    width: '100%',
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
})
