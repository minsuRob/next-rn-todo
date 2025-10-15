import type {
  GetCharacterResponse,
  UpdateCharacterRequest,
  UpdateCharacterResponse,
  EquipItemRequest,
  EquipItemResponse,
  UnequipItemRequest,
  UnequipItemResponse,
  StatBonuses,
} from '@repo/types'
import { getSupabaseClient } from './client.js'
import { handleSupabaseError, NotFoundError, ConflictError } from './errors.js'
import { mapCharacter, mapInventoryItem } from './mappers.js'

/**
 * Get character with equipped items and total stats
 */
export async function getCharacter(): Promise<GetCharacterResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get character
    const { data: characterData, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (characterError) throw characterError
    if (!characterData) throw new NotFoundError('Character')

    // Get equipped items with reward details
    const { data: equippedData, error: equippedError } = await supabase
      .from('inventory')
      .select('*, rewards(*)')
      .eq('user_id', user.id)
      .eq('is_equipped', true)

    if (equippedError) throw equippedError

    const equippedItems = (equippedData || []).map(mapInventoryItem)

    // Calculate total stats from equipped items
    const totalStats = calculateTotalStats(equippedData || [])

    return {
      character: mapCharacter(characterData),
      equippedItems,
      totalStats,
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Update character theme or avatar configuration
 */
export async function updateCharacter(
  request: UpdateCharacterRequest
): Promise<UpdateCharacterResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (request.theme !== undefined) {
      updateData.theme = request.theme
    }

    if (request.avatarConfig !== undefined) {
      // Get current avatar config and merge with updates
      const { data: currentCharacter } = await supabase
        .from('characters')
        .select('avatar_config')
        .eq('user_id', user.id)
        .single()

      updateData.avatar_config = {
        ...(currentCharacter?.avatar_config || {}),
        ...request.avatarConfig,
      }
    }

    const { data, error } = await supabase
      .from('characters')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    if (!data) throw new NotFoundError('Character')

    return {
      character: mapCharacter(data),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Equip an item from inventory
 */
export async function equipItem(request: EquipItemRequest): Promise<EquipItemResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get the inventory item with reward details
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('*, rewards(*)')
      .eq('id', request.inventoryItemId)
      .eq('user_id', user.id)
      .single()

    if (inventoryError) throw inventoryError
    if (!inventoryData) throw new NotFoundError('Inventory item')

    // Check if item is equipment
    if (!inventoryData.rewards?.is_equipment) {
      throw new ConflictError('Item is not equipment')
    }

    const equipmentSlot = inventoryData.rewards.equipment_slot

    // Unequip any item in the same slot
    if (equipmentSlot) {
      await supabase
        .from('inventory')
        .update({ is_equipped: false })
        .eq('user_id', user.id)
        .eq('is_equipped', true)
        .in('reward_id', supabase.from('rewards').select('id').eq('equipment_slot', equipmentSlot))
    }

    // Equip the item
    const { data: updatedInventory, error: updateError } = await supabase
      .from('inventory')
      .update({ is_equipped: true })
      .eq('id', request.inventoryItemId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) throw updateError

    // Get updated character
    const { data: characterData, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (characterError) throw characterError

    return {
      inventoryItem: mapInventoryItem(updatedInventory),
      character: mapCharacter(characterData),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Unequip an item
 */
export async function unequipItem(request: UnequipItemRequest): Promise<UnequipItemResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Unequip the item
    const { data: updatedInventory, error: updateError } = await supabase
      .from('inventory')
      .update({ is_equipped: false })
      .eq('id', request.inventoryItemId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) throw updateError
    if (!updatedInventory) throw new NotFoundError('Inventory item')

    return {
      inventoryItem: mapInventoryItem(updatedInventory),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Calculate total stats from equipped items
 */
function calculateTotalStats(equippedItems: Array<{ rewards: any }>): {
  xpMultiplier: number
  goldMultiplier: number
  hpBonus: number
} {
  const stats = {
    xpMultiplier: 1,
    goldMultiplier: 1,
    hpBonus: 0,
  }

  for (const item of equippedItems) {
    const bonuses = item.rewards?.stat_bonuses as StatBonuses | null
    if (bonuses) {
      if (bonuses.xpMultiplier) {
        stats.xpMultiplier *= bonuses.xpMultiplier
      }
      if (bonuses.goldMultiplier) {
        stats.goldMultiplier *= bonuses.goldMultiplier
      }
      if (bonuses.hpBonus) {
        stats.hpBonus += bonuses.hpBonus
      }
    }
  }

  return stats
}
