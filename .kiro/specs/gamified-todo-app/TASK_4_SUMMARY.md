# Task 4 Summary: 공유 유틸리티 패키지 생성

## Completed: ✅

## Overview

Created a shared utilities package (`@repo/utils`) containing XP calculations, date/time helpers, and gold management functions used across web and mobile applications.

## Implementation Details

### Package Structure

```
packages/utils/
├── src/
│   ├── xp.ts          # XP calculation utilities
│   ├── date.ts        # Date and time helpers
│   ├── gold.ts        # Gold calculation utilities
│   └── index.ts       # Main exports
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

### Subtask 4.1: XP 계산 유틸리티 구현 ✅

Implemented XP calculation functions:

- **`calculateXP(difficulty, statBonuses?)`** - Calculates XP reward based on task difficulty with equipment bonuses
  - Trivial: 5 XP
  - Easy: 10 XP
  - Medium: 20 XP
  - Hard: 40 XP
- **`calculateRequiredXP(level)`** - Calculates XP needed for next level using formula: `100 * (level ^ 1.5)`

- **`calculateLevel(totalXP)`** - Determines character level from total accumulated XP

- **`calculateXPProgress(currentXP, level)`** - Returns progress towards next level with percentage

- **`checkLevelUp(currentXP, currentLevel)`** - Checks if character should level up and returns new level

**Requirements Addressed:** 2.3, 3.2, 3.3, 4.7

### Subtask 4.2: 날짜 및 시간 헬퍼 생성 ✅

Implemented date and time helper functions:

- **`calculateStreak(lastCompletedDate, currentDate?)`** - Calculates current streak based on completion dates

- **`shouldIncrementStreak(lastCompletedDate, currentDate?)`** - Determines if streak should be incremented

- **`shouldResetStreak(lastCompletedDate, currentDate?)`** - Checks if streak should be reset (missed day)

- **`shouldResetDailyTasks(lastResetDate, currentDate?)`** - Checks if daily tasks need to be reset

- **`isValidRepeatPattern(pattern)`** - Validates repeat pattern structure

- **`isTaskActiveToday(pattern, currentDate?)`** - Checks if task should be active based on repeat pattern

- **`getNextActiveDate(pattern, fromDate?)`** - Calculates next active date for a task

- **`isOverdue(dueDate, currentDate?)`** - Checks if a task is overdue

- **`getDaysUntilDue(dueDate, currentDate?)`** - Calculates days until due date

**Requirements Addressed:** 5.1, 5.2, 2.5

### Subtask 4.3: 골드 계산 유틸리티 구축 ✅

Implemented gold calculation and management functions:

- **`calculateGoldReward(difficulty, statBonuses?)`** - Calculates gold reward (1 gold per 2 XP) with equipment bonuses

- **`canAffordPurchase(currentGold, cost)`** - Validates if user has enough gold

- **`deductGold(currentGold, cost)`** - Deducts gold with validation, throws error if insufficient

- **`calculateLevelUpGoldBonus(newLevel)`** - Calculates bonus gold for leveling up (10 \* level)

- **`calculateDefeatPenalty(currentGold, penaltyPercentage?)`** - Calculates gold loss when HP reaches 0 (default 10%)

- **`applyGoldBonuses(baseGold, statBonuses?)`** - Applies equipment stat bonuses to gold

- **`isValidGoldAmount(amount)`** - Validates gold transaction amounts

**Requirements Addressed:** 4.1, 4.3

## Key Features

1. **Type Safety**: All functions use TypeScript with proper type definitions from `@repo/types`

2. **Equipment Bonuses**: XP and gold calculations support stat multipliers from equipped items

3. **Validation**: Gold functions include validation to prevent invalid transactions

4. **Flexible Date Handling**: Date functions accept optional current date parameter for testing

5. **Error Handling**: Functions throw descriptive errors for invalid inputs

6. **Documentation**: Comprehensive JSDoc comments for all functions

## Dependencies

- `@repo/types` - Shared TypeScript types and interfaces
- `date-fns` - Date manipulation and formatting library

## Testing

All files pass TypeScript type checking:

```bash
npm run check-types --workspace=packages/utils
```

## Usage Example

```typescript
import {
  calculateXP,
  calculateGoldReward,
  isTaskActiveToday,
  shouldIncrementStreak,
} from '@repo/utils'

// Calculate rewards for completing a hard task
const xp = calculateXP('hard') // 40 XP
const gold = calculateGoldReward('hard') // 20 gold

// With equipment bonuses (10% XP, 20% gold)
const bonuses = { xpMultiplier: 1.1, goldMultiplier: 1.2 }
const bonusXP = calculateXP('hard', bonuses) // 44 XP
const bonusGold = calculateGoldReward('hard', bonuses) // 26 gold

// Check if daily task is active today (Mon, Wed, Fri)
const pattern = { days: [1, 3, 5], interval: 'weekly' }
const isActive = isTaskActiveToday(pattern)

// Check if streak should increment
const shouldIncrement = shouldIncrementStreak('2025-10-15')
```

## Next Steps

This utilities package is now ready to be used by:

- Task 5: 공유 API 클라이언트 패키지 생성
- Task 10: 캐릭터 진행 시스템 구현
- Task 11: 연속 기록 및 습관 추적 구현

The utilities provide the core calculation logic needed for the gamification features.
