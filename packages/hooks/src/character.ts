import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCharacter, updateCharacter, equipItem, unequipItem } from '@repo/api'
import type { UpdateCharacterRequest, EquipItemRequest, UnequipItemRequest } from '@repo/types'

/**
 * Query key factory for character
 */
export const characterKeys = {
  all: ['character'] as const,
  detail: () => [...characterKeys.all, 'detail'] as const,
  equipment: () => [...characterKeys.all, 'equipment'] as const,
}

/**
 * Hook to fetch character data with equipped items and stats
 */
export function useCharacter() {
  return useQuery({
    queryKey: characterKeys.detail(),
    queryFn: () => getCharacter(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to update character theme or avatar configuration
 */
export function useUpdateCharacter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateCharacterRequest) => updateCharacter(request),
    onSuccess: (data) => {
      // Update character in cache
      queryClient.setQueryData(characterKeys.detail(), (old: unknown) => ({
        ...(old as object),
        character: data.character,
      }))
    },
  })
}

/**
 * Hook to handle level up logic
 * This is a convenience hook that monitors character XP and level changes
 */
export function useLevelUp() {
  const { data, isLoading } = useCharacter()

  const character = data?.character
  const hasLeveledUp = character && character.xp >= 0 // Level up is handled server-side

  return {
    character,
    isLoading,
    hasLeveledUp,
    level: character?.level,
    xp: character?.xp,
    gold: character?.gold,
  }
}

/**
 * Hook to manage equipment (equip/unequip items)
 */
export function useEquipment() {
  const queryClient = useQueryClient()

  const equipMutation = useMutation({
    mutationFn: (request: EquipItemRequest) => equipItem(request),
    onSuccess: (data) => {
      // Update character data in cache
      queryClient.setQueryData(characterKeys.detail(), (old: unknown) => {
        const oldData = old as { equippedItems?: unknown[] } | undefined
        return {
          ...oldData,
          character: data.character,
          equippedItems: oldData?.equippedItems
            ? [...oldData.equippedItems, data.inventoryItem]
            : [data.inventoryItem],
        }
      })
      // Invalidate inventory to refetch
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })

  const unequipMutation = useMutation({
    mutationFn: (request: UnequipItemRequest) => unequipItem(request),
    onSuccess: (data) => {
      // Update character data in cache
      queryClient.setQueryData(characterKeys.detail(), (old: unknown) => {
        const oldData = old as { equippedItems?: Array<{ id: string }> } | undefined
        return {
          ...oldData,
          equippedItems: oldData?.equippedItems?.filter(
            (item) => item.id !== data.inventoryItem.id
          ),
        }
      })
      // Invalidate inventory to refetch
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })

  return {
    equip: equipMutation.mutate,
    unequip: unequipMutation.mutate,
    isEquipping: equipMutation.isPending,
    isUnequipping: unequipMutation.isPending,
    equipError: equipMutation.error,
    unequipError: unequipMutation.error,
  }
}
