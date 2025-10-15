// Data mappers to convert between database rows and application types

import type {
  Task,
  Character,
  Reward,
  InventoryItem,
  Streak,
  HabitLog,
  Challenge,
  ChallengeParticipant,
  Friendship,
  Transaction,
  Profile,
  RepeatPattern,
  ChecklistItem,
  AvatarConfig,
  StatBonuses,
} from '@repo/types'
import type { Database } from './types.js'

type TaskRow = Database['public']['Tables']['tasks']['Row']
type CharacterRow = Database['public']['Tables']['characters']['Row']
type RewardRow = Database['public']['Tables']['rewards']['Row']
type InventoryRow = Database['public']['Tables']['inventory']['Row']
type StreakRow = Database['public']['Tables']['streaks']['Row']
type HabitLogRow = Database['public']['Tables']['habit_logs']['Row']
type ChallengeRow = Database['public']['Tables']['challenges']['Row']
type ChallengeParticipantRow = Database['public']['Tables']['challenge_participants']['Row']
type FriendshipRow = Database['public']['Tables']['friendships']['Row']
type TransactionRow = Database['public']['Tables']['transactions']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

/**
 * Maps database task row to Task type
 */
export function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    description: row.description || undefined,
    difficulty: row.difficulty,
    isCompleted: row.is_completed,
    dueDate: row.due_date || undefined,
    repeatPattern: row.repeat_pattern as unknown as RepeatPattern | undefined,
    checklist: row.checklist as unknown as ChecklistItem[] | undefined,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at || undefined,
  }
}

/**
 * Maps database character row to Character type
 */
export function mapCharacter(row: CharacterRow): Character {
  return {
    id: row.id,
    userId: row.user_id,
    level: row.level,
    xp: row.xp,
    hp: row.hp,
    gold: row.gold,
    theme: row.theme,
    avatarConfig: row.avatar_config as AvatarConfig,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Maps database reward row to Reward type
 */
export function mapReward(row: RewardRow): Reward {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description || undefined,
    price: row.price,
    iconUrl: row.icon_url || undefined,
    isCustom: row.is_custom,
    isEquipment: row.is_equipment,
    equipmentSlot: row.equipment_slot as any,
    statBonuses: row.stat_bonuses as StatBonuses | undefined,
    createdAt: row.created_at,
  }
}

/**
 * Maps database inventory row to InventoryItem type
 */
export function mapInventoryItem(row: InventoryRow): InventoryItem {
  return {
    id: row.id,
    userId: row.user_id,
    rewardId: row.reward_id,
    quantity: row.quantity,
    isEquipped: row.is_equipped,
    acquiredAt: row.acquired_at,
  }
}

/**
 * Maps database streak row to Streak type
 */
export function mapStreak(row: StreakRow): Streak {
  return {
    id: row.id,
    taskId: row.task_id,
    userId: row.user_id,
    currentStreak: row.current_streak,
    bestStreak: row.best_streak,
    lastCompletedDate: row.last_completed_date || undefined,
  }
}

/**
 * Maps database habit log row to HabitLog type
 */
export function mapHabitLog(row: HabitLogRow): HabitLog {
  return {
    id: row.id,
    taskId: row.task_id,
    userId: row.user_id,
    isPositive: row.is_positive,
    loggedAt: row.logged_at,
  }
}

/**
 * Maps database challenge row to Challenge type
 */
export function mapChallenge(row: ChallengeRow): Challenge {
  return {
    id: row.id,
    creatorId: row.creator_id,
    name: row.name,
    description: row.description || undefined,
    startDate: row.start_date,
    endDate: row.end_date,
    isActive: row.is_active,
    createdAt: row.created_at,
  }
}

/**
 * Maps database challenge participant row to ChallengeParticipant type
 */
export function mapChallengeParticipant(row: ChallengeParticipantRow): ChallengeParticipant {
  return {
    id: row.id,
    challengeId: row.challenge_id,
    userId: row.user_id,
    xpEarned: row.xp_earned,
    joinedAt: row.joined_at,
  }
}

/**
 * Maps database friendship row to Friendship type
 */
export function mapFriendship(row: FriendshipRow): Friendship {
  return {
    id: row.id,
    userId: row.user_id,
    friendId: row.friend_id,
    status: row.status as any,
    createdAt: row.created_at,
  }
}

/**
 * Maps database transaction row to Transaction type
 */
export function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as any,
    amount: row.amount,
    source: row.source,
    sourceId: row.source_id || undefined,
    createdAt: row.created_at,
  }
}

/**
 * Maps database profile row to Profile type
 */
export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    avatarUrl: row.avatar_url || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
