import type { TaskDifficulty, StatBonuses } from '@repo/types'

/**
 * Base XP values for each difficulty level
 * Based on requirements: Trivial: 5 XP, Easy: 10 XP, Medium: 20 XP, Hard: 40 XP
 */
const BASE_XP_VALUES: Record<TaskDifficulty, number> = {
  trivial: 5,
  easy: 10,
  medium: 20,
  hard: 40,
}

/**
 * Calculate XP reward for completing a task based on difficulty
 * Applies equipment stat bonuses if provided
 *
 * @param difficulty - Task difficulty level
 * @param statBonuses - Optional equipment stat bonuses
 * @returns XP amount to award
 */
export function calculateXP(difficulty: TaskDifficulty, statBonuses?: StatBonuses): number {
  const baseXP = BASE_XP_VALUES[difficulty]
  const multiplier = statBonuses?.xpMultiplier ?? 1

  return Math.floor(baseXP * multiplier)
}

/**
 * Calculate required XP to reach the next level
 * Formula: XP_needed = 100 * (level ^ 1.5)
 *
 * @param level - Current character level
 * @returns XP required to reach next level
 */
export function calculateRequiredXP(level: number): number {
  if (level < 1) {
    throw new Error('Level must be at least 1')
  }

  return Math.floor(100 * Math.pow(level, 1.5))
}

/**
 * Calculate character level from total XP
 * Inverse of the XP requirement formula
 *
 * @param totalXP - Total accumulated XP
 * @returns Current level based on total XP
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP < 0) {
    throw new Error('Total XP cannot be negative')
  }

  // Level 1 starts at 0 XP
  if (totalXP === 0) {
    return 1
  }

  // Find the level by iterating until we exceed totalXP
  let level = 1
  let xpForNextLevel = 0

  while (xpForNextLevel <= totalXP) {
    level++
    xpForNextLevel += calculateRequiredXP(level - 1)
  }

  return level - 1
}

/**
 * Calculate XP progress towards next level
 *
 * @param currentXP - Current XP amount
 * @param level - Current level
 * @returns Object with current XP, required XP, and progress percentage
 */
export function calculateXPProgress(
  currentXP: number,
  level: number
): {
  current: number
  required: number
  percentage: number
} {
  const required = calculateRequiredXP(level)
  const percentage = Math.min(100, (currentXP / required) * 100)

  return {
    current: currentXP,
    required,
    percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
  }
}

/**
 * Check if character should level up and calculate new level
 *
 * @param currentXP - Current XP amount
 * @param currentLevel - Current character level
 * @returns Object with shouldLevelUp flag and new level if applicable
 */
export function checkLevelUp(
  currentXP: number,
  currentLevel: number
): {
  shouldLevelUp: boolean
  newLevel: number
  remainingXP: number
} {
  const requiredXP = calculateRequiredXP(currentLevel)

  if (currentXP >= requiredXP) {
    const remainingXP = currentXP - requiredXP
    return {
      shouldLevelUp: true,
      newLevel: currentLevel + 1,
      remainingXP,
    }
  }

  return {
    shouldLevelUp: false,
    newLevel: currentLevel,
    remainingXP: currentXP,
  }
}
