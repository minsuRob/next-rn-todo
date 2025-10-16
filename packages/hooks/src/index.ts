// Main export file for @repo/hooks package

// Authentication hooks
export { AuthProvider, useAuth, useSession, useUser } from './auth'

// Task management hooks
export {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCompleteTask,
  taskKeys,
} from './tasks'

// Character hooks
export {
  useCharacter,
  useUpdateCharacter,
  useLevelUp,
  useEquipment,
  characterKeys,
} from './character'

// Rewards hooks
export {
  useRewards,
  useCreateCustomReward,
  usePurchaseReward,
  useRedeemReward,
  useInventory,
  rewardKeys,
  inventoryKeys,
} from './rewards'

// Realtime hooks
export {
  useRealtimeSubscription,
  useTaskUpdates,
  useCharacterUpdates,
  useChallengeUpdates,
  useRealtimeSync,
} from './realtime'
