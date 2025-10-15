// API request and response types

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
  TaskType,
  TaskDifficulty,
  RepeatPattern,
  ChecklistItem,
  EquipmentSlot,
  StatBonuses,
} from './database';

// ============================================================================
// Authentication API
// ============================================================================

export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

export interface SignUpResponse {
  user: {
    id: string;
    email: string;
  };
  profile: Profile;
  character: Character;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: {
    id: string;
    email: string;
  };
  session: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SocialAuthProvider {
  provider: 'google' | 'apple';
}

// ============================================================================
// Task API
// ============================================================================

export interface CreateTaskRequest {
  type: TaskType;
  title: string;
  description?: string;
  difficulty?: TaskDifficulty;
  dueDate?: string;
  repeatPattern?: RepeatPattern;
  tags?: string[];
}

export interface CreateTaskResponse {
  task: Task;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  difficulty?: TaskDifficulty;
  dueDate?: string;
  repeatPattern?: RepeatPattern;
  checklist?: ChecklistItem[];
  tags?: string[];
}

export interface UpdateTaskResponse {
  task: Task;
}

export interface CompleteTaskRequest {
  taskId: string;
}

export interface CompleteTaskResponse {
  task: Task;
  xpGained: number;
  goldGained: number;
  leveledUp: boolean;
  newLevel?: number;
}

export interface GetTasksRequest {
  type?: TaskType;
  isCompleted?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface GetTasksResponse {
  tasks: Task[];
  total: number;
}

export interface DeleteTaskRequest {
  taskId: string;
}

// ============================================================================
// Character API
// ============================================================================

export interface GetCharacterResponse {
  character: Character;
  equippedItems: InventoryItem[];
  totalStats: {
    xpMultiplier: number;
    goldMultiplier: number;
    hpBonus: number;
  };
}

export interface UpdateCharacterRequest {
  theme?: string;
  avatarConfig?: Partial<Character['avatarConfig']>;
}

export interface UpdateCharacterResponse {
  character: Character;
}

export interface EquipItemRequest {
  inventoryItemId: string;
}

export interface EquipItemResponse {
  inventoryItem: InventoryItem;
  character: Character;
}

export interface UnequipItemRequest {
  inventoryItemId: string;
}

export interface UnequipItemResponse {
  inventoryItem: InventoryItem;
}

// ============================================================================
// Reward API
// ============================================================================

export interface GetRewardsRequest {
  isCustom?: boolean;
  isEquipment?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetRewardsResponse {
  rewards: Reward[];
  total: number;
}

export interface CreateCustomRewardRequest {
  name: string;
  description?: string;
  price: number;
  iconUrl?: string;
  isEquipment?: boolean;
  equipmentSlot?: EquipmentSlot;
  statBonuses?: StatBonuses;
}

export interface CreateCustomRewardResponse {
  reward: Reward;
}

export interface PurchaseRewardRequest {
  rewardId: string;
}

export interface PurchaseRewardResponse {
  inventoryItem: InventoryItem;
  character: Character;
  transaction: Transaction;
}

export interface RedeemRewardRequest {
  inventoryItemId: string;
}

export interface RedeemRewardResponse {
  success: boolean;
  message: string;
}

export interface GetInventoryResponse {
  items: Array<InventoryItem & { reward: Reward }>;
}

// ============================================================================
// Streak and Habit API
// ============================================================================

export interface GetStreaksRequest {
  taskId?: string;
}

export interface GetStreaksResponse {
  streaks: Streak[];
}

export interface UpdateStreakRequest {
  taskId: string;
  completed: boolean;
}

export interface UpdateStreakResponse {
  streak: Streak;
  bonusXp?: number;
  milestone?: number;
}

export interface LogHabitRequest {
  taskId: string;
  isPositive: boolean;
}

export interface LogHabitResponse {
  habitLog: HabitLog;
  xpGained?: number;
  goldGained?: number;
}

// ============================================================================
// Analytics API
// ============================================================================

export interface GetXPHistoryRequest {
  startDate?: string;
  endDate?: string;
  interval?: 'day' | 'week' | 'month';
}

export interface GetXPHistoryResponse {
  data: Array<{
    date: string;
    xp: number;
  }>;
}

export interface GetTaskStatsResponse {
  totalCompleted: number;
  completionRate: number;
  byType: {
    habit: number;
    daily: number;
    todo: number;
  };
  byDifficulty: {
    trivial: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface GetStreakDataResponse {
  currentStreaks: Streak[];
  longestStreak: Streak | null;
  totalActiveDays: number;
}

// ============================================================================
// Social API
// ============================================================================

export interface SendFriendRequestRequest {
  friendUsername: string;
}

export interface SendFriendRequestResponse {
  friendship: Friendship;
}

export interface AcceptFriendRequestRequest {
  friendshipId: string;
}

export interface AcceptFriendRequestResponse {
  friendship: Friendship;
}

export interface GetFriendsResponse {
  friends: Array<Friendship & { profile: Profile; character: Character }>;
}

export interface CreateChallengeRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface CreateChallengeResponse {
  challenge: Challenge;
}

export interface JoinChallengeRequest {
  challengeId: string;
}

export interface JoinChallengeResponse {
  participant: ChallengeParticipant;
}

export interface GetChallengeLeaderboardRequest {
  challengeId: string;
}

export interface GetChallengeLeaderboardResponse {
  leaderboard: Array<
    ChallengeParticipant & {
      profile: Profile;
      character: Character;
    }
  >;
}

// ============================================================================
// Error Response
// ============================================================================

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
