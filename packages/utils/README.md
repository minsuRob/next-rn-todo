# @repo/utils

Shared utility functions for the gamified TODO application.

## Overview

This package provides utility functions for XP calculations, date/time operations, and gold management used across web and mobile applications.

## Modules

### XP Utilities (`xp.ts`)

Functions for calculating experience points and character progression:

- `calculateXP(difficulty, statBonuses?)` - Calculate XP reward for task completion
- `calculateRequiredXP(level)` - Calculate XP needed for next level
- `calculateLevel(totalXP)` - Determine level from total XP
- `calculateXPProgress(currentXP, level)` - Get progress towards next level
- `checkLevelUp(currentXP, currentLevel)` - Check if character should level up

### Date Utilities (`date.ts`)

Functions for streak tracking and task scheduling:

- `calculateStreak(lastCompletedDate, currentDate?)` - Calculate current streak
- `shouldIncrementStreak(lastCompletedDate, currentDate?)` - Check if streak should increment
- `shouldResetStreak(lastCompletedDate, currentDate?)` - Check if streak should reset
- `shouldResetDailyTasks(lastResetDate, currentDate?)` - Check if daily tasks should reset
- `isValidRepeatPattern(pattern)` - Validate repeat pattern
- `isTaskActiveToday(pattern, currentDate?)` - Check if task is active today
- `getNextActiveDate(pattern, fromDate?)` - Get next active date for task
- `isOverdue(dueDate, currentDate?)` - Check if task is overdue
- `getDaysUntilDue(dueDate, currentDate?)` - Get days until due date

### Gold Utilities (`gold.ts`)

Functions for gold rewards and transactions:

- `calculateGoldReward(difficulty, statBonuses?)` - Calculate gold reward for task completion
- `canAffordPurchase(currentGold, cost)` - Check if user can afford purchase
- `deductGold(currentGold, cost)` - Deduct gold with validation
- `calculateLevelUpGoldBonus(newLevel)` - Calculate bonus gold for leveling up
- `calculateDefeatPenalty(currentGold, penaltyPercentage?)` - Calculate gold penalty for defeat
- `applyGoldBonuses(baseGold, statBonuses?)` - Apply stat bonuses to gold
- `isValidGoldAmount(amount)` - Validate gold amount

## Usage

```typescript
import { calculateXP, calculateGoldReward, isTaskActiveToday } from '@repo/utils'

// Calculate rewards for completing a hard task
const xp = calculateXP('hard') // 40 XP
const gold = calculateGoldReward('hard') // 20 gold

// With equipment bonuses
const bonuses = { xpMultiplier: 1.1, goldMultiplier: 1.2 }
const bonusXP = calculateXP('hard', bonuses) // 44 XP
const bonusGold = calculateGoldReward('hard', bonuses) // 26 gold

// Check if daily task is active today
const pattern = { days: [1, 3, 5], interval: 'weekly' }
const isActive = isTaskActiveToday(pattern) // true if today is Mon, Wed, or Fri
```

## Dependencies

- `@repo/types` - Shared TypeScript types
- `date-fns` - Date manipulation library
