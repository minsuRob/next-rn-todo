// Main export file for @repo/hooks package

// Authentication hooks
export { AuthProvider, useAuth, useSession, useUser } from './auth.js'

// Task management hooks
export {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCompleteTask,
  taskKeys,
} from './tasks.js'

// Character hooks
export {
  useCharacter,
  useUpdateCharacter,
  useLevelUp,
  useEquipment,
  characterKeys,
} from './character.js'

// Rewards hooks
export {
  useRewards,
  useCreateCustomReward,
  usePurchaseReward,
  useRedeemReward,
  useInventory,
  rewardKeys,
  inventoryKeys,
} from './rewards.js'

// Realtime hooks
export {
  useRealtimeSubscription,
  useTaskUpdates,
  useCharacterUpdates,
  useChallengeUpdates,
  useRealtimeSync,
} from './realtime.js'
