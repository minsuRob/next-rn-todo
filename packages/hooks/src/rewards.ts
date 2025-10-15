import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRewards,
  createCustomReward,
  purchaseReward,
  redeemReward,
  getInventory,
} from '@repo/api'
import type {
  GetRewardsRequest,
  CreateCustomRewardRequest,
  PurchaseRewardRequest,
  RedeemRewardRequest,
} from '@repo/types'

/**
 * Query key factory for rewards
 */
export const rewardKeys = {
  all: ['rewards'] as const,
  lists: () => [...rewardKeys.all, 'list'] as const,
  list: (filters: GetRewardsRequest) => [...rewardKeys.lists(), filters] as const,
}

/**
 * Query key factory for inventory
 */
export const inventoryKeys = {
  all: ['inventory'] as const,
  list: () => [...inventoryKeys.all, 'list'] as const,
}

/**
 * Hook to fetch rewards with optional filtering
 */
export function useRewards(request: GetRewardsRequest = {}) {
  return useQuery({
    queryKey: rewardKeys.list(request),
    queryFn: () => getRewards(request),
  })
}

/**
 * Hook to create a custom reward
 */
export function useCreateCustomReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateCustomRewardRequest) => createCustomReward(request),
    onSuccess: () => {
      // Invalidate rewards lists
      queryClient.invalidateQueries({ queryKey: rewardKeys.lists() })
    },
  })
}

/**
 * Hook to purchase a reward with gold
 */
export function usePurchaseReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: PurchaseRewardRequest) => purchaseReward(request),
    onSuccess: (data) => {
      // Update character gold in cache
      queryClient.setQueryData(['character', 'detail'], (old: unknown) => ({
        ...(old as object),
        character: data.character,
      }))
      // Invalidate inventory to show new item
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
    },
  })
}

/**
 * Hook to redeem a custom reward
 */
export function useRedeemReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: RedeemRewardRequest) => redeemReward(request),
    onSuccess: () => {
      // Invalidate inventory to reflect quantity change
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
    },
  })
}

/**
 * Hook to fetch user's inventory
 */
export function useInventory() {
  return useQuery({
    queryKey: inventoryKeys.list(),
    queryFn: () => getInventory(),
  })
}
