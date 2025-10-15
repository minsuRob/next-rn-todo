import type {
  GetRewardsRequest,
  GetRewardsResponse,
  CreateCustomRewardRequest,
  CreateCustomRewardResponse,
  PurchaseRewardRequest,
  PurchaseRewardResponse,
  RedeemRewardRequest,
  RedeemRewardResponse,
  GetInventoryResponse,
} from '@repo/types'
import { getSupabaseClient } from './client.js'
import { handleSupabaseError, NotFoundError, InsufficientResourcesError } from './errors.js'
import { mapReward, mapInventoryItem, mapCharacter, mapTransaction } from './mappers.js'

/**
 * Get rewards with optional filtering
 */
export async function getRewards(request: GetRewardsRequest = {}): Promise<GetRewardsResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('rewards')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Apply filters
    if (request.isCustom !== undefined) {
      query = query.eq('is_custom', request.isCustom)
    }

    if (request.isEquipment !== undefined) {
      query = query.eq('is_equipment', request.isEquipment)
    }

    // Apply pagination
    const limit = request.limit || 50
    const offset = request.offset || 0
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return {
      rewards: (data || []).map(mapReward),
      total: count || 0,
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Create a custom reward
 */
export async function createCustomReward(
  request: CreateCustomRewardRequest
): Promise<CreateCustomRewardResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('rewards')
      .insert({
        user_id: user.id,
        name: request.name,
        description: request.description || null,
        price: request.price,
        icon_url: request.iconUrl || null,
        is_custom: true,
        is_equipment: request.isEquipment || false,
        equipment_slot: request.equipmentSlot || null,
        stat_bonuses: request.statBonuses || null,
      })
      .select()
      .single()

    if (error) throw error

    return {
      reward: mapReward(data),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Purchase a reward with gold
 */
export async function purchaseReward(
  request: PurchaseRewardRequest
): Promise<PurchaseRewardResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get the reward
    const { data: rewardData, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', request.rewardId)
      .single()

    if (rewardError) throw rewardError
    if (!rewardData) throw new NotFoundError('Reward')

    // Get character
    const { data: characterData, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (characterError) throw characterError
    if (!characterData) throw new NotFoundError('Character')

    // Check if user has enough gold
    if (characterData.gold < rewardData.price) {
      throw new InsufficientResourcesError('gold')
    }

    // Deduct gold
    const newGold = characterData.gold - rewardData.price

    const { data: updatedCharacter, error: updateCharacterError } = await supabase
      .from('characters')
      .update({
        gold: newGold,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateCharacterError) throw updateCharacterError

    // Check if item already exists in inventory
    const { data: existingInventory } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', user.id)
      .eq('reward_id', request.rewardId)
      .single()

    let inventoryItem

    if (existingInventory) {
      // Increment quantity
      const { data: updatedInventory, error: updateInventoryError } = await supabase
        .from('inventory')
        .update({
          quantity: existingInventory.quantity + 1,
        })
        .eq('id', existingInventory.id)
        .select()
        .single()

      if (updateInventoryError) throw updateInventoryError
      inventoryItem = updatedInventory
    } else {
      // Create new inventory item
      const { data: newInventory, error: createInventoryError } = await supabase
        .from('inventory')
        .insert({
          user_id: user.id,
          reward_id: request.rewardId,
          quantity: 1,
          is_equipped: false,
        })
        .select()
        .single()

      if (createInventoryError) throw createInventoryError
      inventoryItem = newInventory
    }

    // Log transaction
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'gold_loss',
        amount: rewardData.price,
        source: 'reward_purchase',
        source_id: request.rewardId,
      })
      .select()
      .single()

    if (transactionError) throw transactionError

    return {
      inventoryItem: mapInventoryItem(inventoryItem),
      character: mapCharacter(updatedCharacter),
      transaction: mapTransaction(transactionData),
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Redeem a custom reward (consume from inventory)
 */
export async function redeemReward(request: RedeemRewardRequest): Promise<RedeemRewardResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get inventory item
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory')
      .select('*, rewards(*)')
      .eq('id', request.inventoryItemId)
      .eq('user_id', user.id)
      .single()

    if (inventoryError) throw inventoryError
    if (!inventoryData) throw new NotFoundError('Inventory item')

    // Check if it's a custom reward
    if (!inventoryData.rewards?.is_custom) {
      return {
        success: false,
        message: 'Only custom rewards can be redeemed',
      }
    }

    // Check quantity
    if (inventoryData.quantity <= 0) {
      throw new InsufficientResourcesError('reward quantity')
    }

    // Decrease quantity or delete if 0
    if (inventoryData.quantity === 1) {
      const { error: deleteError } = await supabase
        .from('inventory')
        .delete()
        .eq('id', request.inventoryItemId)

      if (deleteError) throw deleteError
    } else {
      const { error: updateError } = await supabase
        .from('inventory')
        .update({
          quantity: inventoryData.quantity - 1,
        })
        .eq('id', request.inventoryItemId)

      if (updateError) throw updateError
    }

    return {
      success: true,
      message: 'Reward redeemed successfully',
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

/**
 * Get user's inventory with reward details
 */
export async function getInventory(): Promise<GetInventoryResponse> {
  const supabase = getSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('inventory')
      .select('*, rewards(*)')
      .eq('user_id', user.id)
      .order('acquired_at', { ascending: false })

    if (error) throw error

    const items = (data || []).map((item: any) => ({
      ...mapInventoryItem(item),
      reward: mapReward(item.rewards),
    }))

    return { items }
  } catch (error) {
    return handleSupabaseError(error)
  }
}
