import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@repo/api'
import { taskKeys } from './tasks.js'
import { characterKeys } from './character.js'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Generic hook to subscribe to realtime updates for a table
 */
export function useRealtimeSubscription(
  table: string,
  callback: (payload: unknown) => void,
  filter?: { column: string; value: string }
) {
  useEffect(() => {
    const supabase = getSupabaseClient()
    let channel: RealtimeChannel

    try {
      // Create channel with optional filter
      const channelName = filter ? `${table}:${filter.column}=eq.${filter.value}` : `${table}:*`

      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
          },
          (payload) => {
            callback(payload)
          }
        )
        .subscribe()
    } catch (error) {
      console.error(`Failed to subscribe to ${table}:`, error)
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [table, callback, filter])
}

/**
 * Hook to subscribe to task updates in realtime
 * Automatically invalidates task queries when changes occur
 */
export function useTaskUpdates(userId?: string) {
  const queryClient = useQueryClient()

  const handleTaskChange = useCallback(
    (payload: unknown) => {
      const typedPayload = payload as {
        eventType?: string
        new?: { id: string }
        old?: { id: string }
      }

      // Invalidate all task queries to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })

      // If it's an update or insert, we could optimistically update the cache
      if (typedPayload.eventType === 'INSERT' || typedPayload.eventType === 'UPDATE') {
        const newTask = typedPayload.new
        if (newTask) {
          // Update specific task in cache if it exists
          queryClient.setQueryData(taskKeys.detail(newTask.id), newTask)
        }
      }

      // If it's a delete, remove from cache
      if (typedPayload.eventType === 'DELETE') {
        const oldTask = typedPayload.old
        if (oldTask) {
          queryClient.removeQueries({ queryKey: taskKeys.detail(oldTask.id) })
        }
      }
    },
    [queryClient]
  )

  useRealtimeSubscription(
    'tasks',
    handleTaskChange,
    userId ? { column: 'user_id', value: userId } : undefined
  )
}

/**
 * Hook to subscribe to character updates in realtime
 * Automatically invalidates character queries when changes occur
 */
export function useCharacterUpdates(userId?: string) {
  const queryClient = useQueryClient()

  const handleCharacterChange = useCallback(
    (payload: unknown) => {
      const typedPayload = payload as {
        eventType?: string
        new?: unknown
      }

      // Invalidate character queries to refetch
      queryClient.invalidateQueries({ queryKey: characterKeys.all })

      // Optimistically update character in cache
      if (typedPayload.eventType === 'UPDATE') {
        const updatedCharacter = typedPayload.new
        if (updatedCharacter) {
          queryClient.setQueryData(characterKeys.detail(), (old: unknown) => ({
            ...(old as object),
            character: updatedCharacter,
          }))
        }
      }
    },
    [queryClient]
  )

  useRealtimeSubscription(
    'characters',
    handleCharacterChange,
    userId ? { column: 'user_id', value: userId } : undefined
  )
}

/**
 * Hook to subscribe to challenge updates in realtime
 */
export function useChallengeUpdates(challengeId?: string) {
  const queryClient = useQueryClient()

  const handleChallengeChange = useCallback(
    (payload: unknown) => {
      const typedPayload = payload as {
        eventType?: string
        new?: unknown
      }

      // Invalidate challenge queries
      queryClient.invalidateQueries({ queryKey: ['challenges'] })

      if (typedPayload.eventType === 'UPDATE' && typedPayload.new) {
        // Update specific challenge in cache
        queryClient.setQueryData(['challenges', 'detail', challengeId], typedPayload.new)
      }
    },
    [queryClient, challengeId]
  )

  useRealtimeSubscription(
    'challenges',
    handleChallengeChange,
    challengeId ? { column: 'id', value: challengeId } : undefined
  )
}

/**
 * Hook to enable realtime sync for all user data
 * Subscribes to tasks, character, and other relevant tables
 */
export function useRealtimeSync(userId?: string) {
  useTaskUpdates(userId)
  useCharacterUpdates(userId)

  return {
    isEnabled: !!userId,
  }
}
