# @repo/types

Shared TypeScript types, interfaces, and Zod validation schemas for the gamified TODO application.

## Overview

This package provides type-safe definitions and validation schemas used across the web and mobile applications. It includes:

- **Database types**: TypeScript interfaces matching the Supabase database schema
- **API types**: Request and response types for all API endpoints
- **Utility types**: Common type patterns and helpers
- **Zod schemas**: Runtime validation schemas for data validation
- **Validation helpers**: Utility functions for working with Zod validation

## Installation

This package is part of the monorepo and is automatically available to other packages via workspace dependencies.

```json
{
  "dependencies": {
    "@repo/types": "*"
  }
}
```

## Usage

### Database Types

```typescript
import type { Task, Character, Reward } from '@repo/types';

const task: Task = {
  id: '123',
  userId: '456',
  type: 'daily',
  title: 'Morning workout',
  difficulty: 'medium',
  isCompleted: false,
  tags: ['health', 'fitness'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### API Types

```typescript
import type { CreateTaskRequest, CreateTaskResponse } from '@repo/types';

async function createTask(data: CreateTaskRequest): Promise<CreateTaskResponse> {
  // API call implementation
}
```

### Validation Schemas

```typescript
import { createTaskSchema, validate } from '@repo/types';

const result = validate(createTaskSchema, {
  type: 'daily',
  title: 'Morning workout',
  difficulty: 'medium',
});

if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}
```

### Validation Helpers

```typescript
import { 
  validate, 
  validateOrThrow, 
  safeParse, 
  isValid,
  getFirstError,
  hasFieldError 
} from '@repo/types';

// Validate and get result
const result = validate(schema, data);

// Validate and throw on error
const validData = validateOrThrow(schema, data);

// Safe parse (returns null on error)
const maybeData = safeParse(schema, data);

// Check if valid
if (isValid(schema, data)) {
  // Data is valid
}

// Get first error for a field
const titleError = getFirstError(result.errors, 'title');

// Check if field has error
if (hasFieldError(result.errors, 'title')) {
  // Handle error
}
```

### Utility Types

```typescript
import type { 
  DeepPartial, 
  RequireFields, 
  PaginatedResponse,
  ApiResponse,
  Result 
} from '@repo/types';

// Deep partial type
type PartialTask = DeepPartial<Task>;

// Require specific fields
type TaskWithTitle = RequireFields<Partial<Task>, 'title'>;

// Paginated response
const response: PaginatedResponse<Task> = {
  data: tasks,
  total: 100,
  limit: 20,
  offset: 0,
  hasMore: true,
};

// API response wrapper
const apiResponse: ApiResponse<Task> = {
  success: true,
  data: task,
};

// Result type for operations
const result: Result<Task, Error> = {
  ok: true,
  value: task,
};
```

### Constants

```typescript
import { 
  XP_REWARDS, 
  GOLD_PER_XP, 
  HP_PENALTIES,
  STREAK_MILESTONES,
  calculateRequiredXP,
  calculateLevel 
} from '@repo/types';

// XP rewards by difficulty
const xp = XP_REWARDS.medium; // 20

// Calculate gold from XP
const gold = xp * GOLD_PER_XP; // 10

// HP penalty for missed daily
const hpLoss = HP_PENALTIES.hard; // 15

// Calculate XP required for next level
const requiredXP = calculateRequiredXP(5); // 559

// Calculate level from total XP
const level = calculateLevel(1000); // 6
```

## Available Schemas

### Task Schemas
- `createTaskSchema` - Validate task creation
- `updateTaskSchema` - Validate task updates
- `completeTaskSchema` - Validate task completion
- `getTasksSchema` - Validate task query parameters
- `deleteTaskSchema` - Validate task deletion

### Character Schemas
- `updateCharacterSchema` - Validate character updates
- `equipItemSchema` - Validate item equipping
- `unequipItemSchema` - Validate item unequipping

### Reward Schemas
- `createCustomRewardSchema` - Validate custom reward creation
- `purchaseRewardSchema` - Validate reward purchase
- `redeemRewardSchema` - Validate reward redemption
- `getRewardsSchema` - Validate reward query parameters

### Streak & Habit Schemas
- `updateStreakSchema` - Validate streak updates
- `logHabitSchema` - Validate habit logging
- `getStreaksSchema` - Validate streak queries

### Social Schemas
- `sendFriendRequestSchema` - Validate friend requests
- `acceptFriendRequestSchema` - Validate friend request acceptance
- `createChallengeSchema` - Validate challenge creation
- `joinChallengeSchema` - Validate challenge joining

### Authentication Schemas
- `signUpSchema` - Validate user registration
- `signInSchema` - Validate user login
- `socialAuthSchema` - Validate social authentication

## Type Safety

All types are strictly typed and provide excellent IDE autocomplete support. The package uses TypeScript 5.9 features for maximum type safety.

## Contributing

When adding new types or schemas:

1. Add database types to `src/database.ts`
2. Add API types to `src/api.ts`
3. Add Zod schemas to `src/schemas.ts`
4. Add utility types to `src/utils.ts`
5. Export from `src/index.ts`
6. Run `npm run check-types` to verify

## License

Private package for internal use only.
