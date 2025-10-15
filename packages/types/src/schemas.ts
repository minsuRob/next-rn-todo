// Zod validation schemas

import { z } from 'zod';

// ============================================================================
// Enum Schemas
// ============================================================================

export const taskTypeSchema = z.enum(['habit', 'daily', 'todo']);
export const taskDifficultySchema = z.enum(['trivial', 'easy', 'medium', 'hard']);
export const friendshipStatusSchema = z.enum(['pending', 'accepted', 'rejected']);
export const equipmentSlotSchema = z.enum(['head', 'body', 'weapon', 'accessory']);
export const transactionTypeSchema = z.enum(['xp_gain', 'xp_loss', 'gold_gain', 'gold_loss']);
export const themeModeSchema = z.enum(['light', 'dark', 'system']);
export const themeVariantSchema = z.enum(['default', 'fantasy', 'cyberpunk']);

// ============================================================================
// Common Schemas
// ============================================================================

export const repeatPatternSchema = z.object({
  days: z.array(z.number().min(0).max(6)),
  interval: z.enum(['daily', 'weekly', 'custom']),
});

export const checklistItemSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(200),
  isCompleted: z.boolean(),
});

export const avatarConfigSchema = z.object({
  hairstyle: z.string().optional(),
  skinTone: z.string().optional(),
  accessories: z.array(z.string()).optional(),
});

export const statBonusesSchema = z.object({
  xpMultiplier: z.number().min(1).max(5).optional(),
  goldMultiplier: z.number().min(1).max(5).optional(),
  hpBonus: z.number().min(0).max(100).optional(),
});

// ============================================================================
// Task Schemas
// ============================================================================

export const createTaskSchema = z.object({
  type: taskTypeSchema,
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  difficulty: taskDifficultySchema.default('easy'),
  dueDate: z.string().datetime().optional(),
  repeatPattern: repeatPatternSchema.optional(),
  tags: z.array(z.string().max(50)).default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  difficulty: taskDifficultySchema.optional(),
  dueDate: z.string().datetime().nullable().optional(),
  repeatPattern: repeatPatternSchema.nullable().optional(),
  checklist: z.array(checklistItemSchema).optional(),
  tags: z.array(z.string().max(50)).optional(),
});

export const completeTaskSchema = z.object({
  taskId: z.string().uuid(),
});

export const getTasksSchema = z.object({
  type: taskTypeSchema.optional(),
  isCompleted: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export const deleteTaskSchema = z.object({
  taskId: z.string().uuid(),
});

// ============================================================================
// Character Schemas
// ============================================================================

export const updateCharacterSchema = z.object({
  theme: themeVariantSchema.optional(),
  avatarConfig: avatarConfigSchema.optional(),
});

export const equipItemSchema = z.object({
  inventoryItemId: z.string().uuid(),
});

export const unequipItemSchema = z.object({
  inventoryItemId: z.string().uuid(),
});

// ============================================================================
// Reward Schemas
// ============================================================================

export const createCustomRewardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price: z.number().int().positive('Price must be positive'),
  iconUrl: z.string().url('Invalid URL').optional(),
  isEquipment: z.boolean().default(false),
  equipmentSlot: equipmentSlotSchema.optional(),
  statBonuses: statBonusesSchema.optional(),
});

export const purchaseRewardSchema = z.object({
  rewardId: z.string().uuid(),
});

export const redeemRewardSchema = z.object({
  inventoryItemId: z.string().uuid(),
});

export const getRewardsSchema = z.object({
  isCustom: z.boolean().optional(),
  isEquipment: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

// ============================================================================
// Streak and Habit Schemas
// ============================================================================

export const updateStreakSchema = z.object({
  taskId: z.string().uuid(),
  completed: z.boolean(),
});

export const logHabitSchema = z.object({
  taskId: z.string().uuid(),
  isPositive: z.boolean(),
});

export const getStreaksSchema = z.object({
  taskId: z.string().uuid().optional(),
});

// ============================================================================
// Analytics Schemas
// ============================================================================

export const getXPHistorySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  interval: z.enum(['day', 'week', 'month']).default('day'),
});

// ============================================================================
// Social Schemas
// ============================================================================

export const sendFriendRequestSchema = z.object({
  friendUsername: z.string().min(1, 'Username is required').max(50),
});

export const acceptFriendRequestSchema = z.object({
  friendshipId: z.string().uuid(),
});

export const createChallengeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const joinChallengeSchema = z.object({
  challengeId: z.string().uuid(),
});

export const getChallengeLeaderboardSchema = z.object({
  challengeId: z.string().uuid(),
});

// ============================================================================
// Authentication Schemas
// ============================================================================

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const socialAuthSchema = z.object({
  provider: z.enum(['google', 'apple']),
});

// ============================================================================
// Profile Schemas
// ============================================================================

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  avatarUrl: z.string().url().optional(),
});
