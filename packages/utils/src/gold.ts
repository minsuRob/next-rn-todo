import type { TaskDifficulty, StatBonuses } from '@repo/types'
import { calculateXP } from './xp'

/**
 * Calculate gold reward for completing a task
 * Gold is proportional to XP earned (1 gold per 2 XP)
 * Applies equipment stat bonuses if provided
 *
 * @param difficulty - Task difficulty level
 * @param statBonuses - Optional equipment stat bonuses
 * @returns Gold amount to award
 */
export function calculateGoldReward(difficulty: TaskDifficulty, statBonuses?: StatBonuses): number {
  const xpEarned = calculateXP(difficulty, statBonuses)
  const baseGold = Math.floor(xpEarned / 2)
  const goldMultiplier = statBonuses?.goldMultiplier ?? 1

  return Math.floor(baseGold * goldMultiplier)
}

/**
 * Validate if user has enough gold for a purchase
 *
 * @param currentGold - User's current gold amount
 * @param cost - Cost of the item
 * @returns True if user can afford the purchase
 */
export function canAffordPurchase(currentGold: number, cost: number): boolean {
  if (currentGold < 0) {
    throw new Error('Current gold cannot be negative')
  }

  if (cost < 0) {
    throw new Error('Cost cannot be negative')
  }

  return currentGold >= cost
}

/**
 * Calculate gold after a purchase with validation
 * Throws error if insufficient funds
 *
 * @param currentGold - User's current gold amount
 * @param cost - Cost of the item
 * @returns Remaining gold after purchase
 */
export function deductGold(currentGold: number, cost: number): number {
  if (!canAffordPurchase(currentGold, cost)) {
    throw new Error(`Insufficient gold. Required: ${cost}, Available: ${currentGold}`)
  }

  return currentGold - cost
}

/**
 * Calculate bonus gold for leveling up
 * Players receive bonus gold when they level up
 *
 * @param newLevel - The level just reached
 * @returns Bonus gold amount
 */
export function calculateLevelUpGoldBonus(newLevel: number): number {
  if (newLevel < 1) {
    throw new Error('Level must be at least 1')
  }

  // Bonus increases with level: 10 gold * level
  return 10 * newLevel
}

/**
 * Calculate gold penalty for defeat (HP reaching 0)
 * Players lose a percentage of their gold when defeated
 *
 * @param currentGold - User's current gold amount
 * @param penaltyPercentage - Percentage of gold to lose (default 10%)
 * @returns Object with gold lost and remaining gold
 */
export function calculateDefeatPenalty(
  currentGold: number,
  penaltyPercentage: number = 10
): {
  goldLost: number
  remainingGold: number
} {
  if (currentGold < 0) {
    throw new Error('Current gold cannot be negative')
  }

  if (penaltyPercentage < 0 || penaltyPercentage > 100) {
    throw new Error('Penalty percentage must be between 0 and 100')
  }

  const goldLost = Math.floor(currentGold * (penaltyPercentage / 100))
  const remainingGold = currentGold - goldLost

  return {
    goldLost,
    remainingGold,
  }
}

/**
 * Calculate total gold with stat bonuses applied
 * Used when displaying potential earnings
 *
 * @param baseGold - Base gold amount
 * @param statBonuses - Equipment stat bonuses
 * @returns Total gold with bonuses applied
 */
export function applyGoldBonuses(baseGold: number, statBonuses?: StatBonuses): number {
  if (baseGold < 0) {
    throw new Error('Base gold cannot be negative')
  }

  const multiplier = statBonuses?.goldMultiplier ?? 1
  return Math.floor(baseGold * multiplier)
}

/**
 * Validate gold transaction amount
 *
 * @param amount - Transaction amount
 * @returns True if amount is valid
 */
export function isValidGoldAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount >= 0
}
