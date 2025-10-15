// Supabase database type definition
// This will be auto-generated in production using supabase gen types

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          user_id: string
          level: number
          xp: number
          hp: number
          gold: number
          theme: string
          avatar_config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level?: number
          xp?: number
          hp?: number
          gold?: number
          theme?: string
          avatar_config?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: number
          xp?: number
          hp?: number
          gold?: number
          theme?: string
          avatar_config?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          type: 'habit' | 'daily' | 'todo'
          title: string
          description: string | null
          difficulty: 'trivial' | 'easy' | 'medium' | 'hard'
          is_completed: boolean
          due_date: string | null
          repeat_pattern: Json | null
          checklist: Json | null
          tags: string[]
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'habit' | 'daily' | 'todo'
          title: string
          description?: string | null
          difficulty?: 'trivial' | 'easy' | 'medium' | 'hard'
          is_completed?: boolean
          due_date?: string | null
          repeat_pattern?: Json | null
          checklist?: Json | null
          tags?: string[]
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'habit' | 'daily' | 'todo'
          title?: string
          description?: string | null
          difficulty?: 'trivial' | 'easy' | 'medium' | 'hard'
          is_completed?: boolean
          due_date?: string | null
          repeat_pattern?: Json | null
          checklist?: Json | null
          tags?: string[]
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      habit_logs: {
        Row: {
          id: string
          task_id: string
          user_id: string
          is_positive: boolean
          logged_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          is_positive: boolean
          logged_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          is_positive?: boolean
          logged_at?: string
        }
      }
      streaks: {
        Row: {
          id: string
          task_id: string
          user_id: string
          current_streak: number
          best_streak: number
          last_completed_date: string | null
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          current_streak?: number
          best_streak?: number
          last_completed_date?: string | null
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          current_streak?: number
          best_streak?: number
          last_completed_date?: string | null
        }
      }
      rewards: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          price: number
          icon_url: string | null
          is_custom: boolean
          is_equipment: boolean
          equipment_slot: string | null
          stat_bonuses: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          price: number
          icon_url?: string | null
          is_custom?: boolean
          is_equipment?: boolean
          equipment_slot?: string | null
          stat_bonuses?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          price?: number
          icon_url?: string | null
          is_custom?: boolean
          is_equipment?: boolean
          equipment_slot?: string | null
          stat_bonuses?: Json | null
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          quantity: number
          is_equipped: boolean
          acquired_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          quantity?: number
          is_equipped?: boolean
          acquired_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          quantity?: number
          is_equipped?: boolean
          acquired_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          source: string
          source_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          source: string
          source_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          source?: string
          source_id?: string | null
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          creator_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
        }
      }
      challenge_participants: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          xp_earned: number
          joined_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          xp_earned?: number
          joined_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          xp_earned?: number
          joined_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
