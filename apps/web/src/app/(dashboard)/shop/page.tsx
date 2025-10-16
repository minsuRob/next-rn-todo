'use client'

import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native'
import { useTheme, Button, Container } from '@repo/ui'
import { useCharacter } from '@repo/hooks'

// Mock rewards data (would come from API)
const MOCK_REWARDS = [
  {
    id: '1',
    name: 'Health Potion',
    description: 'Restore 20 HP',
    price: 50,
    icon: '🧪',
    type: 'consumable',
  },
  {
    id: '2',
    name: 'Warrior Helmet',
    description: '+5 Defense',
    price: 200,
    icon: '⛑️',
    type: 'equipment',
  },
  {
    id: '3',
    name: 'Magic Sword',
    description: '+10 Attack',
    price: 300,
    icon: '⚔️',
    type: 'equipment',
  },
  {
    id: '4',
    name: 'Coffee Break',
    description: 'Take a 15-minute break',
    price: 30,
    icon: '☕',
    type: 'custom',
  },
  {
    id: '5',
    name: 'Movie Night',
    description: 'Watch your favorite movie',
    price: 100,
    icon: '🎬',
    type: 'custom',
  },
  {
    id: '6',
    name: 'Gaming Session',
    description: '1 hour of guilt-free gaming',
    price: 150,
    icon: '🎮',
    type: 'custom',
  },
]

export default function ShopPage() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop')
  const [isCreateRewardOpen, setIsCreateRewardOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState<any>(null)

  const { data: characterData, isLoading } = useCharacter()
  const character = characterData?.character

  // Mock inventory (would come from API)
  const inventory = [
    { id: '1', name: 'Health Potion', icon: '🧪', quantity: 3 },
    { id: '2', name: 'Coffee Break', icon: '☕', quantity: 1 },
  ]

  const handlePurchase = (reward: any) => {
    if (!character || character.gold < reward.price) {
      alert('Not enough gold!')
      return
    }
    setSelectedReward(reward)
  }

  const confirmPurchase = () => {
    // Would call API to purchase
    alert(`Purchased ${selectedReward.name}!`)
    setSelectedReward(null)
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container maxWidth="lg">
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.colors.text }]}>Shop & Inventory</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Spend your hard-earned gold on rewards
              </Text>
            </View>
            <View style={[styles.goldBadge, { backgroundColor: theme.colors.primaryLight }]}>
              <Text style={styles.goldIcon}>💰</Text>
              <Text style={[styles.goldAmount, { color: theme.colors.primary }]}>
                {character?.gold || 0}
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              onPress={() => setActiveTab('shop')}
              style={[
                styles.tab,
                {
                  borderBottomColor: activeTab === 'shop' ? theme.colors.primary : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: activeTab === 'shop' ? theme.colors.primary : theme.colors.textSecondary,
                  },
                ]}
              >
                Shop
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('inventory')}
              style={[
                styles.tab,
                {
                  borderBottomColor:
                    activeTab === 'inventory' ? theme.colors.primary : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 'inventory' ? theme.colors.primary : theme.colors.textSecondary,
                  },
                ]}
              >
                Inventory
              </Text>
            </Pressable>
          </View>

          {/* Shop Tab */}
          {activeTab === 'shop' && (
            <View style={styles.content}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Available Rewards
                </Text>
                <Button
                  title="+ Custom Reward"
                  onPress={() => setIsCreateRewardOpen(true)}
                  variant="secondary"
                  size="sm"
                />
              </View>

              <View style={styles.rewardsGrid}>
                {MOCK_REWARDS.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    onPurchase={() => handlePurchase(reward)}
                    canAfford={(character?.gold || 0) >= reward.price}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <View style={styles.content}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Your Inventory
              </Text>

              {inventory.length === 0 ? (
                <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.emptyIcon, { color: theme.colors.textTertiary }]}>🎒</Text>
                  <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    Your inventory is empty. Purchase items from the shop!
                  </Text>
                </View>
              ) : (
                <View style={styles.inventoryGrid}>
                  {inventory.map((item) => (
                    <InventoryCard key={item.id} item={item} theme={theme} />
                  ))}
                </View>
              )}
            </View>
          )}
        </Container>
      </ScrollView>

      {/* Purchase Confirmation Modal */}
      {selectedReward && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedReward(null)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setSelectedReward(null)}>
            <Pressable
              style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.rewardIconLarge}>{selectedReward.icon}</Text>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Purchase {selectedReward.name}?
              </Text>
              <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
                {selectedReward.description}
              </Text>
              <View style={[styles.priceTag, { backgroundColor: theme.colors.primaryLight }]}>
                <Text style={[styles.priceText, { color: theme.colors.primary }]}>
                  💰 {selectedReward.price} Gold
                </Text>
              </View>
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setSelectedReward(null)}
                  variant="secondary"
                />
                <Button title="Purchase" onPress={confirmPurchase} variant="primary" />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Create Custom Reward Modal */}
      <CreateRewardModal
        isOpen={isCreateRewardOpen}
        onClose={() => setIsCreateRewardOpen(false)}
        theme={theme}
      />
    </View>
  )
}

// Reward Card Component
function RewardCard({
  reward,
  onPurchase,
  canAfford,
  theme,
}: {
  reward: any
  onPurchase: () => void
  canAfford: boolean
  theme: any
}) {
  return (
    <View
      style={[
        styles.rewardCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <Text style={styles.rewardIcon}>{reward.icon}</Text>
      <Text style={[styles.rewardName, { color: theme.colors.text }]}>{reward.name}</Text>
      <Text style={[styles.rewardDescription, { color: theme.colors.textSecondary }]}>
        {reward.description}
      </Text>
      <View style={styles.rewardFooter}>
        <Text style={[styles.rewardPrice, { color: theme.colors.primary }]}>💰 {reward.price}</Text>
        <Button
          title="Buy"
          onPress={onPurchase}
          variant="primary"
          size="sm"
          disabled={!canAfford}
        />
      </View>
    </View>
  )
}

// Inventory Card Component
function InventoryCard({ item, theme }: { item: any; theme: any }) {
  return (
    <View
      style={[
        styles.inventoryCard,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      <Text style={styles.inventoryIcon}>{item.icon}</Text>
      <Text style={[styles.inventoryName, { color: theme.colors.text }]}>{item.name}</Text>
      <View style={[styles.quantityBadge, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.quantityText}>x{item.quantity}</Text>
      </View>
    </View>
  )
}

// Create Reward Modal Component
function CreateRewardModal({
  isOpen,
  onClose,
  theme,
}: {
  isOpen: boolean
  onClose: () => void
  theme: any
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const handleCreate = () => {
    if (!name.trim() || !price) return
    // Would call API to create custom reward
    alert(`Created custom reward: ${name}`)
    setName('')
    setDescription('')
    setPrice('')
    onClose()
  }

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Create Custom Reward
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Reward Name *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Movie Night"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="What's this reward for?"
              placeholderTextColor={theme.colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Price (Gold) *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="100"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.modalActions}>
            <Button title="Cancel" onPress={onClose} variant="secondary" />
            <Button
              title="Create"
              onPress={handleCreate}
              variant="primary"
              disabled={!name.trim() || !price}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  goldIcon: {
    fontSize: 20,
  },
  goldAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 24,
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
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  rewardCard: {
    flex: 1,
    minWidth: 200,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  rewardDescription: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  inventoryCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  inventoryIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  inventoryName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  quantityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  rewardIconLarge: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  priceTag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
})
