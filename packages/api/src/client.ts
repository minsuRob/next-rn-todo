import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export interface SupabaseClientConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  options?: {
    auth?: {
      persistSession?: boolean
      autoRefreshToken?: boolean
      detectSessionInUrl?: boolean
      storage?: any
    }
  }
}

let supabaseInstance: SupabaseClient<Database> | null = null

/**
 * Creates and returns a Supabase client instance
 * Implements singleton pattern to reuse the same client
 */
export function createSupabaseClient(config: SupabaseClientConfig): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const { supabaseUrl, supabaseAnonKey, options = {} } = config

  // Default auth configuration
  const defaultAuthConfig = {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    ...options,
    auth: {
      ...defaultAuthConfig,
      ...options.auth,
    },
  })

  return supabaseInstance
}

/**
 * Returns the existing Supabase client instance
 * Throws error if client hasn't been initialized
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      return createSupabaseClient({ supabaseUrl, supabaseAnonKey })
    }

    throw new Error('Supabase client not initialized. Call createSupabaseClient first.')
  }
  return supabaseInstance
}

/**
 * Resets the Supabase client instance
 * Useful for testing or re-initialization
 */
export function resetSupabaseClient(): void {
  supabaseInstance = null
}
