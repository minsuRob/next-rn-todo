// Database types matching Supabase schema

export type TaskType = 'habit' | 'daily' | 'todo';
export type TaskDifficulty = 'trivial' | 'easy' | 'medium' | 'hard';
export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';
export type EquipmentSlot = 'head' | 'body' | 'weapon' | 'accessory';
export type TransactionType = 'xp_gain' | 'xp_loss' | 'gold_gain' | 'gold_loss';

// Repeat pattern for daily tasks
export interface RepeatPattern {
  days: number[]; // 0-6 for Sunday-Saturday
  interval: 'daily' | 'weekly' | 'custom';
}

// Checklist item for todos
export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

// Avatar customization configuration
export interface AvatarConfig {
  hairstyle?: string;
  skinTone?: string;
  accessories?: string[];
}

// Stat bonuses from equipment
export interface StatBonuses {
  xpMultiplier?: number; // e.g., 1.1 for 10% bonus
  goldMultiplier?: number;
  hpBonus?: number;
}

// Profile (extends Supabase auth.users)
export interface Profile {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Character progression
export interface Character {
  id: string;
  userId: string;
  level: number;
  xp: number;
  hp: number;
  gold: number;
  theme: string;
  avatarConfig: AvatarConfig;
  createdAt: string;
  updatedAt: string;
}

// Task
export interface Task {
  id: string;
  userId: string;
  type: TaskType;
  title: string;
  description?: string;
  difficulty: TaskDifficulty;
  isCompleted: boolean;
  dueDate?: string;
  repeatPattern?: RepeatPattern;
  checklist?: ChecklistItem[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Habit log entry
export interface HabitLog {
  id: string;
  taskId: string;
  userId: string;
  isPositive: boolean;
  loggedAt: string;
}

// Streak tracking
export interface Streak {
  id: string;
  taskId: string;
  userId: string;
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate?: string;
}

// Reward
export interface Reward {
  id: string;
  userId: string;
  name: string;
  description?: string;
  price: number;
  iconUrl?: string;
  isCustom: boolean;
  isEquipment: boolean;
  equipmentSlot?: EquipmentSlot;
  statBonuses?: StatBonuses;
  createdAt: string;
}

// Inventory item
export interface InventoryItem {
  id: string;
  userId: string;
  rewardId: string;
  quantity: number;
  isEquipped: boolean;
  acquiredAt: string;
}

// Transaction log
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  source: string;
  sourceId?: string;
  createdAt: string;
}

// Challenge
export interface Challenge {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

// Challenge participant
export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  xpEarned: number;
  joinedAt: string;
}

// Friendship
export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: FriendshipStatus;
  createdAt: string;
}
