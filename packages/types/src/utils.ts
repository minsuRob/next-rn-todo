// Utility types for common patterns

// Make all properties optional recursively
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Extract keys of a specific type
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

// Pagination parameters
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Pagination response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Sort parameters
export interface SortParams<T> {
  field: keyof T;
  order: 'asc' | 'desc';
}

// Filter operator types
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like';

// Generic filter type
export interface Filter<T> {
  field: keyof T;
  operator: FilterOperator;
  value: unknown;
}

// API response wrapper
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; details?: unknown } };

// Async state for UI
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Omit timestamp fields for create operations
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// Only timestamp fields for update operations
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// Extract non-nullable fields
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Make all fields nullable
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Type guard helper
export type TypeGuard<T> = (value: unknown) => value is T;

// Branded types for type safety
export type Brand<T, B> = T & { __brand: B };

// ID types with branding
export type UserId = Brand<string, 'UserId'>;
export type TaskId = Brand<string, 'TaskId'>;
export type CharacterId = Brand<string, 'CharacterId'>;
export type RewardId = Brand<string, 'RewardId'>;
export type ChallengeId = Brand<string, 'ChallengeId'>;

// Timestamp type
export type Timestamp = Brand<string, 'Timestamp'>;

// Result type for operations that can fail
export type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

// Callback types
export type Callback<T = void> = (value: T) => void;
export type AsyncCallback<T = void> = (value: T) => Promise<void>;

// Event handler types
export type EventHandler<T = unknown> = (event: T) => void;
export type AsyncEventHandler<T = unknown> = (event: T) => Promise<void>;

// Subscription cleanup function
export type Unsubscribe = () => void;

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeVariant = 'default' | 'fantasy' | 'cyberpunk';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

// Form field state
export interface FieldState<T> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// Form state
export type FormState<T> = {
  [K in keyof T]: FieldState<T[K]>;
};

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}

// XP calculation constants
export const XP_REWARDS = {
  trivial: 5,
  easy: 10,
  medium: 20,
  hard: 40,
} as const;

// Gold calculation (1 gold per 2 XP)
export const GOLD_PER_XP = 0.5;

// HP penalties for missed dailies
export const HP_PENALTIES = {
  trivial: 2,
  easy: 5,
  medium: 10,
  hard: 15,
} as const;

// Streak milestones
export const STREAK_MILESTONES = [7, 30, 100, 365] as const;

// Bonus XP for streak milestones
export const STREAK_BONUS_XP = {
  7: 50,
  30: 200,
  100: 1000,
  365: 5000,
} as const;

// Level calculation
export const calculateRequiredXP = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

export const calculateLevel = (totalXP: number): number => {
  let level = 1;
  let xpForNextLevel = calculateRequiredXP(level);
  let accumulatedXP = 0;

  while (accumulatedXP + xpForNextLevel <= totalXP) {
    accumulatedXP += xpForNextLevel;
    level++;
    xpForNextLevel = calculateRequiredXP(level);
  }

  return level;
};
